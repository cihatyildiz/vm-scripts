import sys
import json
import requests
import urllib.parse
import socket

requests.packages.urllib3.disable_warnings()

kenna_tag_workstation = "#Workstation"
kenna_tag_windows_server = "#Windows Server"

kenna_api_key = "y7AWykA6hSkcaLKvZcRRXe4Heyyss-Nb2vawq_Xnn_TNd5Dq4iDzhNgw7voAy55H"

def getAssetsByTags(asset_tag, page=1):

    url = "https://api.kennasecurity.com/assets/search?tags[]=" + urllib.parse.quote(asset_tag) + "&page=" + str(page)
    headers = {
        "Content-Type" : "application/json",
        "X-Risk-Token" : kenna_api_key
    }
    response = requests.get(url, headers=headers, verify=False)
    if response.status_code != 200:
        return "ERROR" #TODO: add better description

    return response.json()

def getHostnameByIpAddress(ipaddress):
    
    try:
        result = socket.gethostbyaddr(ipaddress)
        return result[0]
    except Exception as e:
        print(e)

def isAssetADesktopDevice(asset, ipaddress=""):

    asset_hostname = asset['hostname']

    # quit if assets doesnt have hostname
    if asset_hostname == None:
        return False

    hostname_initials = [
        "cad", 
        "cal",
        "pad",
        "pal",
        "mxd",
        "mxl",
        "gad",
        "gal",
        "prd",
        "prl",
        "fsd",
        "fsl",
        "txl",
        "txd",
        "nyl",
        "fll",
        ]

    # check first 3 char of hostname
    if asset_hostname[:3].lower() not in hostname_initials:
        return False

    return True

def checkDesktopAssetTags(hostname):
    pass

def removeTagFromAsset(asset_id, tag_name):
    pass

def runProcessForWorkstations(doUpdate=False):

    status = True
    page = 1
    while status:
        response = getAssetsByTags(kenna_tag_workstation, page)
        response_meta = response['meta']
        response_assets = response['assets']

        # Quit when you go to last page
        if response_meta['page'] == response_meta['pages']:
            status = False
        page += 1

        # check each assset in the list
        for asset in response_assets:
            if isAssetADesktopDevice(asset):
                #print("Desktop")
                pass
            elif asset['hostname'] == None:
                print("no hostname for " + asset['ip_address'])
                print(getHostnameByIpAddress(asset['ip_address']))
                pass
            else:
                print(asset['hostname'])

if __name__ == "__main__":
    runProcessForWorkstations()