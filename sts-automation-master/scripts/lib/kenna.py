import sys, os, requests, json, time
from requests.auth import HTTPBasicAuth
from datetime import datetime

def createAKennaVulnerability():
    pass

def getKennaRiskMeterInfo():
    pass

# changes/updates vulnerability scores in Kenna
def bulkVulnerabilityScoreUpdate(token, vuln_ids, override_score):
    url = "https://api.kennasecurity.com/vulnerabilities/bulk"
    payload = {
        "vulnerability_ids": vuln_ids,
        "vulnerability": {"override_score": 20}
        }
    headers = {
        "X-Risk-Token": token,
        "Content-type": "application/json"
    }

    response = requests.request("PUT", url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.status_code
    else:
        print(response.text)
        return response.status_code


# returns vulnerability ids as a list 
def getVulnerabilityIdsByRiskMeter(token, riskmeter_id):
    url = "https://api.kennasecurity.com/vulnerabilities/search"

    payload = ""
    headers = {
        "X-Risk-Token": token
        }

    vulnerability_ids = []
    page = 1
    while(True):
        querystring = {
            "search_id": riskmeter_id,
            "per_page": 100,
            "page": page
            }
        response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
        if response.status_code == 200:
            for vuln_id in response.json()["vulnerabilities"]:
                vulnerability_ids.append(vuln_id["id"])
        else:
            return []
        if response.json()["meta"]["pages"] == response.json()["meta"]["page"]:
            break
        else: 
            page += 1
    return vulnerability_ids

def getKennaUsers(token):
    url = "https://api.kennasecurity.com/users"

    headers = {
        "Content-Type": "application/json",
        "X-Risk-Token": token
    }

    try:
        response = requests.request("GET", url, headers=headers)
        if response.status_code == 200:
            return response.json()["users"]
        else:
            print("Error while running getKennaUsers")
    except Exception as e:
        print("Error while running getKennaUsers - {}".format(e))
        sys.exit()

def getAssetIdsByRiskMeter(token, riskmeter_id):
    url = "https://api.kennasecurity.com/assets/search"

    payload = ""
    headers = {
        "X-Risk-Token": token
        }

    asset_ids = []
    page = 1
    while(True):
        querystring = {
            "search_id": riskmeter_id,
            "per_page": 100,
            "page": page
            }
        response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
        if response.status_code == 200:
            for vuln_id in response.json()["assets"]:
                asset_ids.append(vuln_id["id"])
        else:
            return []
        if response.json()["meta"]["pages"] == response.json()["meta"]["page"]:
            break
        else: 
            page += 1
    return asset_ids



def getKennaAssetGroups(token, page=1):
    url = "https://api.kennasecurity.com/asset_groups"
    querystring = {
        "per_page":"100",
        "page": page
        }

    headers = {
        "Content-Type": "application/json",
        "X-Risk-Token": token
    }

    try:
        response = requests.request("GET", url, headers=headers, params=querystring)
        if response.status_code == 200:
            return response
        else:
            print("Error while running getKennaAssetGroups")
    except Exception as e:
        print("Error while running getKennaAssetGroups - {}".format(e))
        sys.exit()

def checkJiraTicketInKenna(jira_issue, api_token):
    url = "https://api.kennasecurity.com/assets/search"
    
    jira_issue_id = jira_issue['ticket']
    jira_issue_title = jira_issue['summary']
    jira_issue_assignee = jira_issue['assignee']
    jira_issue_duedate = jira_issue['duedate']
    jira_issue_priority = jira_issue['priority']
    
    jira_string = "service_ticket_id:{}".format(jira_issue_id)
    querystring = {
        "status[]":"active",
        "vulnerability[status][]":"open",
        "vulnerability[q]": jira_string
    }
    payload = ""
    headers = {
	    'Content-Type': "application/json",
	    'X-Risk-Token': api_token
	    }
    
    response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
    asset_count = response.json()['meta']['total_count']
    if asset_count == 0:
        status = "Ticket need to be closed"
    else:
        status = "Open"
    
    result = {
        "ticket" : jira_issue_id,
        "priority" : jira_issue_priority,
        "asset_count" : asset_count,
        "status" : status,
        "summary" : jira_issue_title,
        "assignee" : jira_issue_assignee,
        "duedate" : jira_issue_duedate
    }
    
    return result

# Returns True on success, False on fail
def removeKennaTag(token, asset_id, tags):
    url = "https://api.kennasecurity.com/assets/{}/tags".format(asset_id)
    print(url)

    payload = {
        "asset": {
            "tags": tags
            }
        }
    headers = {
        "X-Risk-Token": token,
        "Content-type": "application/json"
    }

    response = requests.request("DELETE", url, json=payload, headers=headers)
    if response.status_code == 204:
        print(204)
        return True
    else:
        print(False)
        return False 