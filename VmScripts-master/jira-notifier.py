import json, requests, sys
import sqlite3, re, urllib3, os
import flask
from flask import render_template
from requests.auth import HTTPBasicAuth

from libs.jira import Jira
from libs.smtp import Smtp

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

jira_username = os.environ['JIRA_USERNAME'].replace('"', "")
jira_password = os.environ['JIRA_PASSWORD'].replace('"', "")

app = flask.Flask("__main__", template_folder='template')
CONFIGFILE = "configs/jira-notifier.json"
JIRASERVER = "https://atlassian/jira"

MyJira = Jira(JIRASERVER, jira_username, jira_password)

def generateNotificationEmail(issue_list, configdata):
    with app.app_context():
        rendered = render_template('kennajira.html', issues = issue_list, data= configdata)
        return rendered

if __name__ == '__main__':
    with open(CONFIGFILE, "r") as configfile:
        config = json.load(configfile)
        for email_data in config['emails']:
            issue_lst = []
            print(email_data)
            jira_issues = MyJira.searchJiraTickets(email_data['jql'])
            for jira_issue in jira_issues:
                issue_lst.append(
                    {
                        "issue_key": jira_issue['ticket'],
                        "summary": jira_issue['summary'],
                        "status":jira_issue['status'],
                    }
                )
                print(jira_issue)
            html_email_content = generateNotificationEmail(issue_lst, email_data)