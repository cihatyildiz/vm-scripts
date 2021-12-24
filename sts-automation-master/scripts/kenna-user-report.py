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

html_template = "kennausers.html"
kenna_api_token = os.environ['KENNA_TOKEN'].replace('"', "")

def createHTMLReport(data, template_filename):
    for x in data:
        print(x)
    with app.app_context():
        rendered = render_template(template_filename, users = data)
        return rendered

# => Run
if __name__ == "__main__":
    kenna_users = getKennaUsers(kenna_api_token)
    html_report = createHTMLReport(kenna_users, html_template)
    sendReport("Kenna User Reports", html_report, "crs-fe@delta.org", "crs-fe@delta.org")
    #print(html_report)
