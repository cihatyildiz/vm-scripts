# ----------------------------------------------------------------------
# Updated: 07/15/2021 by Cihat Yildiz
# ----------------------------------------------------------------------    

import sys, os, requests, json, time
from requests.auth import HTTPBasicAuth
from datetime import datetime

import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()

from lib.jira import *
from lib.kenna import *
from lib.sts import *

jira_username = os.environ['JIRA_USERNAME'].replace('"', "")
jira_password = os.environ['JIRA_PASSWORD'].replace('"', "")

if __name__ == "__main__" :

    jql = "reporter = <service-user> AND status != Done AND status != Closed AND project = \"Jira Project Name\" AND duedate < now() AND updatedDate < 2021-09-21"
    jira_issues = getJiraIssuesByJql(HTTPBasicAuth(jira_username, jira_password), jql)
