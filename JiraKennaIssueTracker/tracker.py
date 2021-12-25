#!/bin/python3

import json, requests, sys
import sqlite3, re, urllib3, os
import flask
from flask import render_template
from requests.auth import HTTPBasicAuth

from libs.jirakenna import *

import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

kenna_api_token = os.environ['KENNA_TOKEN'].replace('"', "")
jira_username = os.environ['JIRA_USERNAME'].replace('"', "")
jira_password = os.environ['JIRA_PASSWORD'].replace('"', "")

app = flask.Flask("__main__", template_folder='template')

def getJiraTicketStatus():
    jira_issues = getIssueReportedByKenna(HTTPBasicAuth(jira_username,jira_password))
    formatted_list=[]
    for jira_issue in jira_issues:
        result = checkJiraTicketInKenna(jira_issue, kenna_api_token)
        formatted_list.append(result)
    return formatted_list

def createHTMLReport(data):
    zcount = 0
    for i in data:
        if i['asset_count'] == 0:
            zcount += 1
    with app.app_context():
        rendered = render_template('kennajira.html', issues = data, novulncount=str(zcount), vulncount=str(len(data)-zcount) )
        return rendered

def sendReport(payload, sender, receiver):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "STS Vulnerablity Tracker"
    msg['From'] = sender
    msg['To'] = receiver
    msg_part = MIMEText(payload, 'html')
    msg.attach(msg_part)
    #sending...
    try:
        s = smtplib.SMTP('localhost')
        s.sendmail(sender, str(receiver), msg.as_string())
        print("Message has been sent successfully...")
    except Exception as e:
        print(e)
        print("Error while sending message...")
    finally:
        s.quit()    

if __name__ == '__main__':
    try:
        issues = getJiraTicketStatus()
        html_report = createHTMLReport(issues)
    except Exception as e:
        html_report = "Please check jira tickets have proper information - Error which getting informattion from Jira {}".format(e)
    finally:
        sendReport(html_report, "FROM:", "TO:")

        
        


