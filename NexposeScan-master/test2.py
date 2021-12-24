import json
import os
import subprocess
import requests
from requests.auth import HTTPBasicAuth

nx_username = "<username>"
nx_password = "<password>"



def getNexposeVulns(asset_id):

    url = "https://nexpose:3780/api/3/assets/" + str(asset_id) + "/vulnerabilities?page=0&size=500"

    headers = {
        'Content-Type': "application/json",
        }

    response = requests.get(url, headers=headers , auth=HTTPBasicAuth(nx_username, nx_password), verify=False)
    if response.status_code != 200:
        print("ERROR: getNexposeVulns")
        return 0

    return response.json()

vulns = getNexposeVulns(806026)

for x in vulns['resources']:
    print(x['status'])
