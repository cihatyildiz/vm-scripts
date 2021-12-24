import json, requests, sys
import sqlite3, re, urllib3, os
from requests.auth import HTTPBasicAuth

class Kenna():

    def __init__(self, token):
        super().__init__()
        self.token = token
    
    def getAssetInformation(self, search_pattern):
        pass

    def searchAsset(self, search_pattern):
        pass

    def updateAssetPriorities(self, asset_ids, priority):
        url = "https://api.kennasecurity.com/assets/bulk"
        payload = {
            "asset_ids": asset_ids,
            "asset":{
                "priority": priority
                },
            "realtime": True
        }
        headers = {
            'Content-Type': "application/json",
            'X-Risk-Token': self.token
        }
        try:
            response = requests.request("PUT", url, data=json.dumps(payload), headers=headers)
            if response.status_code != 200:
                print("Error: updateAssetPriorities - code: {}".format(response.status_code))
                return False
        except Exception as e:
            print("Exception - updateAssetPriorities - code: {}".format(e))
            return False
        return True

    def findAssetsByRiskMeterId(self, risk_meter_id, vulnerability_status="open", asset_status="active"):
        assets = []
        url = "https://api.kennasecurity.com/assets/search"
        querystring = {
            "status[]": asset_status,
			"vulnerability[status][]": vulnerability_status,
			"search_id": risk_meter_id
		}
        payload = ""
        headers = {
            'Content-Type': "application/json",
            'X-Risk-Token': self.token
	    }
        while True:
            try:
                response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
                if response.status_code != 200:
                    print("Error while running - findAssetsByRiskMeterId")
                    sys.exit
                page = response.json()['meta']['page']
                pages = response.json()['meta']['pages']
                for asset in response.json()['assets']:
                    assets.append(
                        {
                            "id": asset['id'],
                            "ip_address": asset['ip_address'],
                            "hostname": asset['hostname'],
                            "url": asset['url']
                        }
                    )
                if page < pages:
                    print("helelo")
                    querystring['page'] = page + 1
                else:
                    break
            except Exception as e:
                print("Exception - findAssetsByServiceTicketId {}".format(e))
                sys.exit()

        return assets

    def findAssetsByServiceTicketId(self, service_ticket_id, vulnerability_status="open", asset_status="active"):
        assets = []
        url = "https://api.kennasecurity.com/assets/search"
        jira_string = "service_ticket_id:{}".format(service_ticket_id)
        querystring = {
            "status[]": asset_status,
			"vulnerability[status][]": vulnerability_status,
			"vulnerability[q]": jira_string
		}
        payload = ""
        headers = {
            'Content-Type': "application/json",
            'X-Risk-Token': self.token
	    }
        while True:
            try:
                response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
                if response.status_code != 200:
                    print("Error while running - findAssetsByServiceTicketId")
                    sys.exit
                page = response.json()['meta']['page']
                pages = response.json()['meta']['pages']
                for asset in response.json()['assets']:
                    assets.append(
                        {
                            "id": asset['id'],
                            "ip_address": asset['ip_address'],
                            "hostname": asset['hostname'],
                            "url": asset['url']
                        }
                    )
                if page < pages:
                    print("helelo")
                    querystring['page'] = page + 1
                else:
                    break
            except Exception as e:
                print("Exception - findAssetsByServiceTicketId {}".format(e))
                sys.exit()

        return assets

    def findAssetCountByServiceTicketId(self, service_ticket_id, vulnerability_status="open", asset_status="active"):
        url = "https://api.kennasecurity.com/assets/search"
        jira_string = "service_ticket_id:{}".format(service_ticket_id)
        querystring = {
            "status[]":asset_status,
			"vulnerability[status][]":vulnerability_status,
			"vulnerability[q]": jira_string
		}
        payload = ""
        headers = {
            'Content-Type': "application/json",
            'X-Risk-Token': self.token
	    }
        try:
            response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
        except Exception as e:
            print(e)
            sys.exit()
        count = response.json()['meta']['total_count']
        return count

    def searchVulnerability(self, search_pattern):
        pass

    def searchFix(self, search_pattern):
        pass

    def getUsers(self):
        pass

