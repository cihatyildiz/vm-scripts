import sys, os, requests, json, time
from requests.auth import HTTPBasicAuth
from datetime import datetime

def getJiraIssuesByJql(jira_auth, jira_query):

	issues=[]
	url = "https://<jira-server>/jira/rest/api/2/search"
	querystring = {
		"jql": jira_query,
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

		try: 
			jira_ticket_key = issue['key']
			jira_ticket_summary = issue['fields']['summary']
			jira_ticket_priority = issue['fields']['priority']['name']
			jira_ticket_assignee = issue['fields']['assignee']['displayName']
			jira_ticket_assignee_id = issue['fields']['assignee']['key']
			jira_ticket_duedate = issue['fields']['duedate']
			jira_ticket_updated = issue['fields']['updated']

			#print(jira_ticket_key, jira_ticket_assignee)
			#time.sleep(1)	

			issues.append({
				"ticket": jira_ticket_key,
				"summary": jira_ticket_summary,
				"priority": jira_ticket_priority,
				"assignee": jira_ticket_assignee,
				"assignee_id": jira_ticket_assignee_id,
				"duedate": jira_ticket_duedate,
				"updated": jira_ticket_updated
			})
		
		except Exception as e:
			print("Error: {}".format(e))

	return issues

def createCommentOnTicket(jira_auth, ticket_id, message): 
	url = "https://<jira-server>/jira/rest/api/2/issue/{}/comment".format(ticket_id)

	payload = {
		"body": message
		}
	headers = {
		"Content-Type": "application/json",
		"Authorization": jira_auth
	}
	response = requests.request("POST", url, data=payload, headers=headers, verify=False)
	print(response.text)