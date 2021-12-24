import sys
import json
import requests

usage = """
./kenna-assets.py <type> <value>

types: 
      cve     : for cve numbers 
      hostname: to get hostname information


"""

api_key = "y7AWykA6hSkcaLKvZcRRXe4Heyyss-Nb2vawq_Xnn_TNd5Dq4iDzhNgw7voAy55H"
risk_meter_id_all_assets = "138873"
kenna_asset_group_ids = {
    "critical": 157123
}

def showAssetGroupInfo(ag_id):
    print("showAssetGroupInfo")
    url="https://api.kennasecurity.com/asset_groups/{}".format(ag_id)
    print(url)
    headers = {
        'content-type': "application/json",
        'x-risk-token': api_key  
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print("Bad request")
    else:
        print(response.json())
    pass

def kennaAssets():
    print("kennaAssets")
    pass

if __name__ == "__main__":
    if len(sys.argv) == 1:
        showAssetGroupInfo("157123")
        print(usage)
    elif len(sys.argv) == 2:
        if sys.argv[1] == "help":
            print(usage)
        else:
            print(usage)
    elif len(sys.argv) >= 3:
        kennaAssets()
    else:
        print("Unexpected parameters {}".format(sys.argv))
    sys.exit(0)
