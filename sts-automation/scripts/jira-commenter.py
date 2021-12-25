# ----------------------------------------------------------------------
# Updated: 07/15/2021
# Author: Cihat Yildiz
#
# Description: This script check vulnerability status of jira ticket 
#       created by kenna connector. 
#       Steps: 
#         1. Get all jira ticket information
#         2. Check the status of each ticket
#         3. Send email to stakeholdersenv
# ----------------------------------------------------------------------    

import sys, os, requests, json, time
from requests.auth import HTTPBasicAuth
from datetime import datetime, date, timedelta

import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()

from lib.jira import *
from lib.kenna import *
from lib.sts import *

query = {
    "reporter" : "reporter = <ServiceUser>",
    "status" : "status != Done AND status != Closed",
    "project" : "project = \"JIra Project Name\"",
    "duedate" : "duedate < now()",
    "updated" : "", 
    "order" : "ORDER BY updated ASC"
}

jira_username = os.environ['JIRA_USERNAME'].replace('"', "")
jira_password = os.environ['JIRA_PASSWORD'].replace('"', "")

if __name__ == "__main__" :
    todays_date_raw = datetime.now()
    todays_date_f = todays_date_raw.strftime('%Y-%d-%m')
    last_update_date = todays_date_raw - timedelta(days=15)
    last_update_date_f = last_update_date.strftime('%Y-%d-%m')
    query["updated"] = "updatedDate < {}".format(last_update_date_f)
    jql = "{reporter} AND {status} AND {project} AND {duedate} AND {updated} {order}".format(**query)
    jira_issues = getJiraIssuesByJql(HTTPBasicAuth(jira_username, jira_password), jql) # get jira tickets
    for seq in range(2):
        ticket = jira_issues[seq]
        # print(ticket)
        ticket_updated = datetime.strptime(ticket['updated'], '%Y-%m-%dT%H:%M:%S.%f%z')
        ticket_assignee = ticket['assignee_id']
        message  = "[~{}] - This ticket hasn't been updated since {} \n\n".format(ticket_assignee, ticket_updated.strftime('%Y-%d-%m'))
        print(message)
        print(HTTPBasicAuth(jira_username, jira_password).text())


