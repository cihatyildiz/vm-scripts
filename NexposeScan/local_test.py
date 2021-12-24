#!/usr/bin/python3

import sys
import os
import requests, json, time
from requests.auth import HTTPBasicAuth

count = 0
timeout = 20

nexpose_username = "<username>"
nexpose_password = "<password>"

def getScanStatus(scan_id):

    url = "https://<nexpose-server>/api/3/scans/" + str(scan_id)

    headers = {
        'Content-Type': "application/json",
        }
    response = requests.post(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), verify=False)

    if response.status_code != 200:
        print("ERROR - get_scan_status")
        return 0

    scan_status = response.json()['status']
    return scan_status


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


def getNexposeAssetID(ip_address):

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

    url = "https://<nexpose-server>/api/3/assets/search"
    response = requests.post(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), data=json.dumps(payload), verify=False)
    if response.status_code != 200:
        print("ASSET NOT EXIST!!")
        return 0
    else:
        asset_id = response.json()['resources'][0]['id']
        return asset_id


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


def getVulnRecommendation(vuln_id):
  try: 
    url = "https://<nexpose-server>/api/3/vulnerabilities/" + vuln_id + "/solutions"
    headers = {
      'Content-Type': "application/json",
    }
    response = requests.get(url, headers=headers , auth=HTTPBasicAuth(nexpose_username, nexpose_password), verify=False)
    if response.status_code != 200:
      print("ERROR - getVulnRecommendation")
      return 0
    return response.json()['resources']

  except Exception as e:
    print ('Exception - getVulnRecommendation()')
    return


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


def getFormattedVuln(vuln, ip_address, assetID):
  vulnDetails = getVulnDetails(vuln['id'])
  formattedVuln = {}

  try: 
    formattedVuln['appID'] = ip_address
    formattedVuln['title'] = vulnDetails['title']
    formattedVuln['srcTool'] = 'nexpose'
    formattedVuln['srcToolID'] = vuln['id']
    formattedVuln['status'] = vuln['status']
    formattedVuln['severity'] = formatVulnImpact(vulnDetails['cvss']['v2']['score'])
    formattedVuln['details'] = {}
    formattedVuln['details']['info'] = vulnDetails['description']['html']
    return formattedVuln
  except Exception as e:
    print ('Exception: getFormattedVuln')
    print (e)
  return

def getLocalConfig():
  nexpose_file = open('/crs/dr-octopus/dr-octopus/apis/nexpose/nexpose_scans.json', 'r')
  nexpose_data = json.load(nexpose_file)
  scan_id = nexpose_data['scan_id']
  ip_address = nexpose_data['scan_id']
  scan_status = nexpose_data['scan_status']

  return scan_id, ip_address, scan_status

def upcateLocalConfig(scan_id, ip_address, scan_status):
  nexpose_file = open('nexpose_scans.json', 'r')
  nexpose_data = json.load(nexpose_file)
  nexpose_data={
      'ip_address': ip_address,    
      'scan_id': scan_id, 
      'scan_status': scan_status
      }
  nexpose_file.close()
  with open('nexpose_scans.json', 'w') as nexpose_file:
    json.dump(nexpose_data, nexpose_file)
  nexpose_file.close()
  return


def formatNexposeVulnsPush2DB(ip_address):
  prep_vulns = []
  try:
    asset_id = getNexposeAssetID(ip_address)
    vulns = getNexposeVulns(asset_id)
    for vuln in vulns['resources']:
      if vuln['status'] == "vulnerable":
        prep_vuln = getFormattedVuln(vuln, ip_address, asset_id)
        prep_vulns.append(prep_vuln)
        #push 2 DB
        eagle_eye_vulns = EagleEyeVulns()
        response = eagle_eye_vulns.pushVulnV3(formattedVuln)
  except Exception as e:
    print ('Exception in scan()')
    print (e)
    vulns = []  
  if len(vulns) == 0:
    return 1 #TODO:
  return 0

def runNexposeCheck():
  # read nexpose_scans.json file
  scan_id, ip_address, scan_status = getLocalConfig()
  asset_id = getNexposeAssetID(ip_address)

  timeout = 0
  while timeout<20 :
    status = getScanStatus(scan_id)
    if status == "finished":
        formatNexposeVulnsPush2DB(ip_address)
        scan_status = "finished"
        upcateLocalConfig(scan_id, ip_address, scan_status)
        return
    timeout = timeout + 1
    time.sleep(1)
  print("Timeout occured")
  


def run():

    # read nexpose_scans.json file
    nexpose_file = open('/crs/dr-octopus/dr-octopus/apis/nexpose/nexpose_scans.json', 'r')
    nexpose_data = json.load(nexpose_file)

    scan_id = nexpose_data['scan_id']
    ip_address = nexpose_data['scan_id']
    scan_status = nexpose_data['scan_status']
    asset_id = getNexposeAssetID(ip_address)

    formattedVulns = []
    vulns = []

    


    # check scan status update
    while 1:
        if count >= timeout:
            print("TIMEOUT")
            exit(1)

        

        if status == "finished":
            vulns = getNexposeVulns(asset_id)
            for vuln in vulns:
                if vuln['status'] != "vulnerable":
                    formattedVuln = getFormattedVuln(vuln, ip_address, asset_id)
                    formattedVulns.append(formattedVuln)
                    #eagle_eye_vulns = EagleEyeVulns()
                    #response = eagle_eye_vulns.pushVulnV3(
                    #    formattedVuln
                    #)

                    print(formattedVulns)


            # Update .json file
            # Exit

def test():
    ip_address = "10.6.55.159"
    prep_vulns = []

    asset_id = getNexposeAssetID(ip_address)
    vulns = getNexposeVulns(asset_id)
    count = 0
    for vuln in vulns['resources']:
        if vuln['status'] == "vulnerable":
            prep_vuln = getFormattedVuln(vuln, ip_address, asset_id)
            prep_vulns.append(prep_vuln)
            count = count + 1
        if count > 5:
                break

    with open('results.json','w') as filex:
        filex.write(json.dump(prep_vulns))

test()
