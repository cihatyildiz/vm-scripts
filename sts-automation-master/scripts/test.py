import sys, os, requests, json, time
from requests.auth import HTTPBasicAuth
from datetime import datetime, date, timedelta

import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()

from lib.jira import *
from lib.kenna import *
from lib.sts import *

url = "https://atlassian/jira/rest/api/2/issue/CRVM-1082/comment"

payload = {
    "body": "This is a comment regarding the quality of the response. \\n Cc: [~ca34995]"
    }
headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic RU5UX1NWQ19LRU5OQUpJUkE6IUAjSW5lZWR0b3dyaXRleW91dXA="
}

response = requests.request("POST", url, data=payload, headers=headers, verify=False)

print(response.text)