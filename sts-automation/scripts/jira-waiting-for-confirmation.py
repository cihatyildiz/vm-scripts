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
from datetime import datetime
import flask
from flask import render_template

import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()

from lib.jira import *
from lib.kenna import *
from lib.sts import *

app = flask.Flask("__main__", template_folder='template')

html_template = "jira-wfc.html"
kenna_api_token = os.environ['KENNA_TOKEN'].replace('"', "")
jira_username = os.environ['JIRA_USERNAME'].replace('"', "")
jira_password = os.environ['JIRA_PASSWORD'].replace('"', "")

def createHTMLReport(data, template_filename):
    zcount = 0
    for i in data:
        if i['asset_count'] == 0:
            zcount += 1
    with app.app_context():
        rendered = render_template(template_filename, issues = data, novulncount=str(zcount), vulncount=str(len(data)-zcount))
        return rendered

# => Run
if __name__ == "__main__":
    kenna_data = []
    jql = "reporter = ENT_SVC_KENNAJIRA AND status = \"Waiting for confirmation\""
    jira_issues = getJiraIssuesByJql(HTTPBasicAuth(jira_username, jira_password), jql) # get jira tickets
    if len(jira_issues) > 0:
        for jira_issue in jira_issues:
            kenna_result = checkJiraTicketInKenna(jira_issue, kenna_api_token)
            kenna_data.append(kenna_result)
        html_report = createHTMLReport(kenna_data, html_template)
        # TODO: generate pdf report as well
        sendReport("CRVM Tickets Wating for Confirmation", html_report, "from email", "to email")
    else:
        pass
