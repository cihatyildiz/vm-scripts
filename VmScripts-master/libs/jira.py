import requests, sys, os, urllib3
from requests.auth import HTTPBasicAuth

class Jira():

    def __init__(self, jira_server_url, username, password):
        self.token = HTTPBasicAuth(username, password)
        self.server = jira_server_url

    def searchJiraTickets(self, jql):    
        issues=[]
        if jql == "":
            print("Please specify a jira query")
            sys.exit()
        url = "{}/rest/api/2/search".format(self.server) # search url
        #print(url)
        querystring = {
            "jql": jql,
            "startAt": "0",
            "maxResults":"500"
            }
        payload = ""
        headers = {
            'Content-Type': "application/json"
            }

        response = requests.request("GET", url, data=payload, headers=headers, auth=self.token, params=querystring, verify=False )
        if response.status_code != 200:
            print("ERROR - searchJiraTickets - " + str(response.status_code))
            sys.exit(1)

        for issue in response.json()['issues']:
            #print(issue)
            data = {
                "ticket": issue['key'], # ticket_id
                "summary": issue['fields']['summary'], # ticket summary
                "assignee_email": issue['fields']['assignee']['emailAddress'], # assignee email 
                "assignee_name": issue['fields']['assignee']['displayName'], # assignee name
                "assignee_key": issue['fields']['assignee']['key'], # assignee key
                "last_updated": issue['fields']['updated'], # last updated date/time
                "reporter_name": issue['fields']['reporter']['name'], # reporter name               
                "reporter_key": issue['fields']['reporter']['key'], # reporter key               
                "status": issue['fields']['status']['name'] # status
            }

            issues.append(data)

        return issues
    
    def getTicketInformation(self, ticket_id):
        print("getTicketInformation")
        url = "{}/jira/rest/api/2/issue/{}".format(self.server, ticket_id) # issue url 
        payload = ""
        headers = {
            "Content-Type": "application/json",
        }   
        
        response = requests.request("GET", url, data=payload, headers=headers, auth=self.token, verify=False )


        issue = response.json()
        data = {
                "ticket": issue['key'], # ticket_id
                "summary": issue['fields']['summary'], # ticket summary
                "assignee_email": issue['fields']['assignee']['emailAddress'], # assignee email 
                "assignee_name": issue['fields']['assignee']['displayName'], # assignee name
                "assignee_name": issue['fields']['assignee']['key'], # assignee key
                "last_updated": issue['fields']['assignee']['key'] # assignee key
            }
        return data
        
    def createTicket(self, summary, description, assignee, reporter):
        print("createTicket")
        #TODO
        return issue 