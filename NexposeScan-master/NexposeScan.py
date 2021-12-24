import requests, os, json, posixpath, urllib.parse
from requests.auth import HTTPBasicAuth
from time import sleep
import datetime, time

# nx_username = os.environ['XRAY_USERNAME'].replace('"', "")
# nx_password = os.environ['XRAY_PASSWORD'].replace('"', "")

nexpose_api_site_id = "332"

def get_asset_vulnerabilities():
    
    headers = {
        'Content-Type': "application/json",
        }
        
    url = "https://nexpose:3780/api/3/assets/806026/vulnerabilities"
    response = requests.get(url, headers=headers , auth=HTTPBasicAuth(nx_username, nx_password), verify=False)
    print(response.text)

    if response.status_code != 200:
        print("SCAN DID NOT INITIATED!!")
        return 0
    else:
        scan_status = response.json()['status']
        return scan_status 

    https://nexpose:3780/api/3/assets/806026/vulnerabilities?page=0&size=500
    return

def get_scan_status(scan_id):
    headers = {
        'Content-Type': "application/json",
        }

    url = "https://nexpose:3780/api/3/scans/" + scan_id
    response = requests.get(url, headers=headers , auth=HTTPBasicAuth(nx_username, nx_password), verify=False)
    print(response.text)

    if response.status_code != 200:
        print("SCAN DID NOT INITIATED!!")
        return 0
    else:
        scan_status = response.json()['status']
        return scan_status   

def run_vulnerability_scan(ip_address, site_id):
    payload = {
        "hosts": [
            ip_address
            ]
        }

    headers = {
        'Content-Type': "application/json",
        }

    url = "https://nexpose:3780/api/3/sites/" + site_id + "/scans"
    response = requests.post(url, headers=headers , auth=HTTPBasicAuth(nx_username, nx_password), data=json.dumps(payload), verify=False)
    print(response.text)

    if response.status_code != 201:
        print("SCAN DID NOT INITIATED!!")
        return 0
    else:
        scan_id = response.json()['id']
        return scan_id   

def get_asset_id(asset_ip_address):

    payload = {
        "filters": [
            {
                "field": "ip-address",
                "operator": "is",
                "value": asset_ip_address
            }
        ],
        "match": "all"
    }

    headers = {
        'Content-Type': "application/json"
        }

    url = "https://nexpose:3780/api/3/assets/search"
    response = requests.post(url, headers=headers , auth=HTTPBasicAuth(nx_username, nx_password), data=json.dumps(payload), verify=False)
    if response.status_code != 200:
        print("ASSET NOT EXIST!!")
        #TODO: Create an asset if asset does not exist
        return 0
    else:
        asset_id = response.json()['resources'][0]['id']
        return asset_id   


# @nexpose_scan.route('/kenna/push/vulns', methods = ['POST'])
def run():
    
    request = {
        'api_key': 'dneemedenede',
        'ip_address': '10.6.55.159'
    }

    if request['api_key'] != "dneemedenede":
        print("WRONG API KEY ")
    
    # find asset id
    asset_ip_address = request['ip_address']
    nx_asset_id = get_asset_id(asset_ip_address)

    # initiate the scan
    scan_id = run_vulnerability_scan(asset_ip_address, nexpose_api_site_id)

    print(scan_id)

    # get vulnerabilities
    # push vulnerabilties to graphql

    return 


if __name__=="__main__":
    run()
