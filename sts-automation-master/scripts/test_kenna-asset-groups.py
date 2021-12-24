# ----------------------------------------------------------------------
# Updated: 07/15/2021
# Author: Cihat Yildiz
#
# Description: This script gets all the asset group informaiton  
#       and shows in the CLI. 
# ----------------------------------------------------------------------    

import sys, os, requests, json, time
from requests.auth import HTTPBasicAuth
from datetime import datetime
from urllib.parse import unquote

import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()

from lib.jira import *
from lib.kenna import *

jira_username = os.environ['JIRA_USERNAME'].replace('"', "")
jira_password = os.environ['JIRA_PASSWORD'].replace('"', "")
kenna_token = os.environ['KENNA_TOKEN'].replace('"', "")

kenna_asset_groups = []

ag_raw_data = getKennaAssetGroups(kenna_token)
ag_data = ag_raw_data.json()
for ag in ag_data['asset_groups']:
    kenna_asset_groups.append(ag)
ag_data_page = ag_data["meta"]["page"]
ag_data_pages = ag_data["meta"]["pages"]
if ag_data_pages != ag_data_page:
    for p in range(2, ag_data_pages+1):
        pdata = getKennaAssetGroups(kenna_token,p)
        for pag in pdata.json()["asset_groups"]:
            kenna_asset_groups.append(pag)

print("Kenna ID , Asset Group Name , Query String , Created")
for x in kenna_asset_groups:
    print("{} , {} , {} , {}".format(x["id"], x["name"], unquote(x["querystring"]), x["created_at"]))


