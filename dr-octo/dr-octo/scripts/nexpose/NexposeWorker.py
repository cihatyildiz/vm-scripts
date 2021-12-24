#!/usr/bin/python3

import sys, os, requests, json, time
from requests.auth import HTTPBasicAuth
from datetime import datetime

sys.path.insert(1, '/.../dr-octopus/dr-octopus/')

from libs.eagle_eye.vulns import EagleEyeVulns
from libs.eagle_eye.apps import EagleEyeApps
from libs.eagle_eye.assets import EagleEyeAssets

import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()

nexpose_username = os.environ['NEXPOSE_USERNAME'].replace('"', "")
nexpose_password = os.environ['NEXPOSE_PASSWORD'].replace('"', "")

nexpose_asset_group_id = 123
nexpose_db_scan_type = "nexpose"


def getAssetsByStatus(assetStatus):
    assets = []
    eagle_eye_assets = EagleEyeAssets()
    assets = eagle_eye_assets.getByStatus(assetStatus, "nexpose")
    return assets['data']


def getAssetIpAddress(assetId):
    eagle_eye_assets = EagleEyeAssets()
    ip_address = eagle_eye_assets.getAssetIpAddress(assetId)
    return ip_address


def getNexposeScanStatus(scan_id):
    url = "https://nexpose:3780/api/3/scans/" + str(scan_id)

    headers = {
        'Content-Type': "application/json",
        }
    response = requests.get(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), verify=False)
    if response.status_code != 200:
        print("ERROR - get_scan_status")
        return 0
    scan_status = response.json()['status']
    return scan_status


def getNexposeAssetID(ip_address):
    print(ip_address)
    payload = {
        "filters": [
            {
                "field": "ip-address",
                "operator": "is",
                "value": ip_address
            }
        ],
        "match": "all"
    }
    headers = {
        'Content-Type': "application/json",
        }
    url = "https://nexpose:3780/api/3/assets/search"
    response = requests.post(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), data=json.dumps(payload), verify=False)
    if response.status_code != 200:
        print(str(response.status_code))
        print("ASSET NOT EXIST!! T")
        return 0
    else:
        try:
            aid = response.json()['resources'][0]['id']
            print(aid)
            return aid
        except:
            print("No asset found")
            return("No asset found")


def formatVulnImpact(impact):
    formattedImpact = 'info'
    if impact < 3.4:
        formattedImpact = 'low'
    elif (impact < 6.7 and impact >= 3.4 ):
        formattedImpact = 'medium'
    elif (impact < 9 and impact >= 6.7 ):
        formattedImpact = 'high'
    elif impact >= 9 :
        formattedImpact = 'critical'
    return formattedImpact


def getFormattedVuln(vuln, ip_address, assetId):
    vulnDetails = getVulnDetails(vuln['id'])
    formattedVuln = {}
    try: 
        formattedVuln['appId'] = ""
        formattedVuln['assetId'] = assetId
        formattedVuln['title'] = vulnDetails['title']
        formattedVuln['srcTool'] = 'nexpose'
        formattedVuln['srcToolId'] = vuln['id']
        formattedVuln['status'] = vuln['status']
        formattedVuln['severity'] = formatVulnImpact(vulnDetails['cvss']['v2']['score'])
        formattedVuln['details'] = {}
        formattedVuln['details']['info'] = vulnDetails['description']['html']
        #formattedVuln['details']['info'] = vuln['proof'] #TODO: check for proof ingforation 
        return formattedVuln
    except Exception as e:
        print ('Exception: getFormattedVuln')
        print (e)
    return


def getVulnDetails(vuln_id):
    try: 
        url = "https://<nexpose-server>/api/3/vulnerabilities/" + str(vuln_id)
        headers = {
            'Content-Type': "application/json",
            }
        response = requests.get(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), verify=False)
        if response.status_code != 200:
            print("ERROR - getVulnDetails")
            return 0
        return response.json()

    except Exception as e:
        print ('Exception - getVulnDetails()')
        return


def getNexposeVulns(asset_id):
    url = "https://<nexpose-server>/api/3/assets/" + str(asset_id) + "/vulnerabilities?page=0&size=500"
    headers = {
        'Content-Type': "application/json",
        }
    response = requests.get(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), verify=False)
    if response.status_code != 200:
        print("ERROR: getNexposeVulns")
        return 0
    return response.json()


def pushNexposeVulns2DB(ip_adress):
    print("pushNexposeVulns2DB")
    eagle_eye_assets = EagleEyeAssets()
    nxAssetID = getNexposeAssetID(ip_adress)
    dbAssetID = eagle_eye_assets.getAssetIdIfExists(ip_adress)
    vulns = getNexposeVulns(nxAssetID)
    try:
        for vuln in vulns['resources']:
            if vuln['status'] == "vulnerable":
                prep_vuln = getFormattedVuln(vuln, ip_adress, dbAssetID)
                eagle_eye_vulns = EagleEyeVulns()
                #print(prep_vuln)
                response = eagle_eye_vulns.pushVulnV3(prep_vuln)
    except Exception as e:
        print ('Exception in scan()')
        print (e)
    return


def checkRunningScan(assets):
    eagle_eye_assets = EagleEyeAssets()
    for asset in assets:
        asset_id = asset['data']['assetId']
        asset_ip_addr = getAssetIpAddress(asset_id)
        scan_id = asset['data']['latestScanId']

        nexpose_scan_status = getNexposeScanStatus(scan_id)
        if nexpose_scan_status == "finished":
            pushNexposeVulns2DB(asset_ip_addr)
            asset_logs = eagle_eye_assets.getLogs(asset_id, nexpose_db_scan_type)
            log_id = asset_logs['data'][0]['id']
            scans = asset_logs['data'][0]['data']['scans']
            result = eagle_eye_assets.updateLog(log_id,asset_id,nexpose_db_scan_type,"idle",scans, scan_id)
            print("will push vulns")
            if result != "update success":
                print("Error: Asset's not been updated - {} - {}".format(asset_id, asset_ip_addr))


def addIpToNexposeSite(ip_address):
    payload = ip_address
    print(payload)
    headers = {
        'Content-Type': "application/json"
        }
    url = "https://<nexpose-server>/api/3/sites/" + str(nexpose_asset_group_id) + "/included_targets"
    response = requests.put(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), data=json.dumps(payload), verify=False)
    if response.status_code != 200:
        print("ASSET NOT EXIST!!")
        return 1
    return 0


def updateAssetsWithScanId(assets, status, scan_id):
    eagle_eye_assets = EagleEyeAssets()
    for asset in assets:
        asset_id = asset['data']['assetId']
        asset_ip_addr = getAssetIpAddress(asset_id)
        asset_logs = eagle_eye_assets.getLogs(asset_id, nexpose_db_scan_type)
        log_id = asset_logs['data'][0]['id']
        scans = asset_logs['data'][0]['data']['scans']
        print(scans)  
        result = eagle_eye_assets.updateLog(log_id,asset_id,nexpose_db_scan_type,status,scans, scan_id)
        if result != "update success":
            print("Error: Asset's not been updated - {} - {}".format(asset_id, asset_ip_addr))
    return "success"


def startNexposeScan(assets):
    ip_addresses = []
    scan_id = 0
    for asset in assets:
        ip_addresses.append(getAssetIpAddress(asset['data']['assetId']))
    print(ip_addresses)
    addIpToNexposeSite(ip_addresses)
    headers = {
        'Content-Type': "application/json"
        }
    url = "https://<nexpose-server>/api/3/sites/" + str(nexpose_asset_group_id) + "/scans"
    response = requests.post(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), verify=False)
    if response.status_code != 201:
        print(response.status_code)
        print("SCAN DID NOT INITIATED!!")
        return 0
    scan_id = response.json()['id']
    return str(scan_id)


def run():
    scan_id=0
    running_assets = getAssetsByStatus("scanning")
    if len(running_assets) != 0:
        print("scanning")
        checkRunningScan(running_assets)
    else:
        waiting_assets = getAssetsByStatus("waiting")
        print("waiting")
        print(waiting_assets)
        if len(waiting_assets) !=0:
            scan_id = startNexposeScan(waiting_assets)
            print("scan id:{}".format(scan_id))
            if scan_id != 0:
                print("updating status")
                updateAssetsWithScanId(waiting_assets, "scanning", scan_id)

def createLocalLog(msg):
    now = datetime.now() 
    dt = now.strftime("%m-%d-%Y-%H-%M-%S:")
    try:
        file_path = "/var/log/nexposerun.log"
        fp = open(file_path, 'a')
        fp.write("{} {}\n".format(dt, msg))
    except Exception as e:
        print("ERROR")
        print(e)
    finally:
        print("log has written")
        fp.close()

if __name__ == "__main__":
    pid = str(os.getpid())
    pidfile = "/tmp/nexposerun.pid"
    createLocalLog("Nexpose script has been started")
    if os.path.isfile(pidfile):
        createLocalLog("%s already exists, exiting" % pidfile)
        sys.exit()
    fp = open(pidfile, 'w')
    fp.write(str(pid))
    try:
        run()
    finally:
        os.unlink(pidfile)
