import json
import requests
import urllib3
import sys, time
from datetime import datetime

def getIssueReportedByKenna(jira_auth):
	issues=[]
	url = "https://<Jira-Server>/jira/rest/api/2/search"
	querystring = {
		"jql":"reporter=ENT_SVC_KENNAJIRA AND status != Done",
		"startAt": "0",
		"maxResults":"500"
		}
	payload = ""
	headers = {
	    'Content-Type': "application/json"
	    }

	response = requests.request("GET", url, data=payload, headers=headers, auth=jira_auth, params=querystring, verify=False )
	if response.status_code != 200:
		print("ERROR - getIssueReportedByKenna")
		sys.exit(1)

	for issue in response.json()['issues']:

		jira_ticket_key = issue['key']
		jira_ticket_summary = issue['fields']['summary']
		jira_ticket_priority = issue['fields']['priority']
		jira_ticket_assignee = issue['fields']['assignee']['displayName']
		jira_ticket_duedate = issue['fields']['duedate']

		print(jira_ticket_key, jira_ticket_assignee)
		time.sleep(1)	

		issues.append({
			"ticket": jira_ticket_key,
			"summary": jira_ticket_summary,
			"priority": jira_ticket_priority,
			"assignee": jira_ticket_assignee,
			"duedate": jira_ticket_duedate	
		})

	return issues


def checkJiraTicketInKenna(jira_issue, api_token):
	url = "https://api.kennasecurity.com/assets/search"

	jira_issue_id = jira_issue['ticket']
	jira_issue_title = jira_issue['summary']
	jira_issue_assignee = jira_issue['assignee']
	jira_issue_duedate = jira_issue['duedate']

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
	count = response.json()['meta']['total_count']
	status = "Open"
	if count == 0:
		status = "Ticket need to be closed"

	result = {
	    "ticket" : jira_issue_id,
	    "asset_count" : count,
	    "status" : status,
		"summary" : jira_issue_title,
		"assignee" : jira_issue_assignee,
		"duedate" : jira_issue_duedate
	    }
		
	return result
	


