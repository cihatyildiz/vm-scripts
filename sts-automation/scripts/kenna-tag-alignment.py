import sys, os, requests, json, time
from requests.auth import HTTPBasicAuth
from datetime import datetime

import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()

from lib.jira import *
from lib.kenna import *
from lib.sts import *

config_file = "data/tag-alignment.json"
kenna_token = os.environ['KENNA_TOKEN'].replace('"', "")

if __name__ == "__main__":

    total_assets = 0
    with open(config_file) as config_data:
        config_json = json.load(config_data)
        
        for v in config_json["assets"]:
            asset_ids = getAssetIdsByRiskMeter(kenna_token, v["riskmeter"])
            if len(asset_ids) == 0:
                print("Desktop assets dont have #Network tag")
                sys.exit()
            print(asset_ids)
            if v["operation"] == "tag-remove":
                tag_to_remove = v["tags"]
                print(tag_to_remove)
                for asset_id in asset_ids:
                    results = removeKennaTag(kenna_token, asset_id, tag_to_remove)
                    print(results)
                total_assets += len(asset_ids)
        
        print("{} Assets has been updated in this process.".format(total_assets))
