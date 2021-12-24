import json, os
from libs.kenna import Kenna

# settings
kenna_api_token = os.environ['KENNA_TOKEN'].replace('"', "")
myKenna = Kenna(kenna_api_token)

# read config file
with open("configs/asset-priorities.json", "r") as configfile:
    config = json.load(configfile)
    for ag in config['asset_groups']:
        #print(ag)
        asset_ids = []
        assets = myKenna.findAssetsByRiskMeterId(ag['id'])
        for a in assets:
            asset_ids.append(a['id'])
        #print(asset_ids)
        result = myKenna.updateAssetPriorities(asset_ids, ag['priority'])
        print("Priority update for {}: {}".format(ag['name'], str(result)))

