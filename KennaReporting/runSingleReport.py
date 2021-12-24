#!/usr/bin/python3

import sys
import os.path
from os import path
import json
import requests
from jinja2 import FileSystemLoader, Environment
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.MIMEImage import MIMEImage
from email.MIMEBase import MIMEBase
from email.encoders import encode_base64


def DEBUG_Print(message):
    if debug_mode == True: 
        print(message)

# get asset group information
def getKennaAssetGroupInformation(risk_meter_id):

    url = "https://api.kennasecurity.com/asset_groups/" + risk_meter_id
    headers = {
        "X-Risk-Token": kenna_api_key
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception("bad reques - getAssetGroupInformation - code {}".format(response.status_code))
    
    return response.json()

def getKennaAssetGroupTopFixes(risk_meter_id):

    top_fixes = []

    url = "https://api.kennasecurity.com/asset_groups/" + risk_meter_id + "/top_fixes"
    headers = {
        "X-Risk-Token": kenna_api_key
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception("bad reques - getKennaAssetGroupTopFixes - code {}".format(response.status_code))

    data = response.json()

    for topfix in data['asset_group']['top_fixes']:
        for fixx in topfix['fixes']:
            print(fixx['title'])
            top_fixes.append(fixx['title'])
    
    return top_fixes


def getKennaAssetGroupTopVulnerableAssets(search_param):

    top_vuln_assets = []

    url = "https://api.kennasecurity.com/assets/search?" + search_param
    headers = {
        "X-Risk-Token": kenna_api_key
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception("bad reques - getKennaAssetGroupTopVulnerableAssets - code {}".format(response.status_code))
    
    data = response.json()
    for topasset in data['assets']:
        ta = [topasset['hostname'], topasset['ip_address'], topasset['risk_meter_score']]
        top_vuln_assets.append(ta)

    print(top_vuln_assets)
    
    return top_vuln_assets


# generate CSV file for vulnerailities
def generateCsvReport(riskmeter_id):
    url = "https://api.kennasecurity.com/vulnerabilities/search?search_id[]=" + risk_meter_id
    headers = {
        "X-Risk-Token": kenna_api_key
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception("bad reques - getAssetGroupInformation - code {}".format(response.status_code))
    return

def createHtmlReport(ag_data):
    # create Html file
    return

config_file = "configs/config.json"
debug_mode = False
#report_name = "windows_server"
report_name = "unix"

# check config file exist
if not os.path.exists(config_file):
    raise Exception("The file {} doesn't exist".format(config_file))

raw_config = open(config_file, "r")
json_config = json.load(raw_config)

# set global properties
debug_mode = json_config['settings']['debug_mode']
kenna_api_key = json_config['settings']['kenna_api_key']

env = Environment(
    loader=FileSystemLoader(searchpath="templates")
)
template = env.get_template("template.html")

# -----------------------------------------------------------------------------
# GO GO GO ----->
# -----------------------------------------------------------------------------

# print(ag_config)
ag_config = json_config['reports'][report_name]
kenna_ag_information = getKennaAssetGroupInformation(ag_config['kenna_risk_meter_id'])
kenna_ag_topfixes = getKennaAssetGroupTopFixes(ag_config['kenna_risk_meter_id'])
kenna_top_vulnerable_assets = getKennaAssetGroupTopVulnerableAssets(ag_config['top_vuln_assets'])

html_data = template.render(
    ag_title=ag_config['report_title'],
    ag_risk_meter_score=kenna_ag_information['asset_group']['risk_meter_score'],
    ag_asset_count=kenna_ag_information['asset_group']['asset_count'],
    ag_vulnerability_count=kenna_ag_information['asset_group']['vulnerability_count'],
    ag_fix_count=kenna_ag_information['asset_group']['fix_count'],
    ag_vulnerability_density=kenna_ag_information['asset_group']['vulnerability_density'],
    ag_popular_targets_count=kenna_ag_information['asset_group']['popular_targets_count'],
    ag_malware_exploitable_count=kenna_ag_information['asset_group']['malware_exploitable_count'],
    ag_predicted_exploitable_count=kenna_ag_information['asset_group']['predicted_exploitable_count'],
    ag_top_fixes=kenna_ag_topfixes,
    ag_top_vuln_assets = kenna_top_vulnerable_assets,
    report_page="https://delta.kennasecurity.com/dashboard/risk_meter/" + ag_config['kenna_risk_meter_id'],
    top_fix_page="https://delta.kennasecurity.com/dashboard/risk_meter/" + ag_config['kenna_risk_meter_id'] + "/fixes"
    )

with open("outputs/report.html", "w") as f:
    f.write(html_data)

# -------------------------------------------------------------------
# create the email message
# -------------------------------------------------------------------



# prepare the header
msg = MIMEMultipart('alternative')
msg['Subject'] = "STR Asset Group Report"
msg['From'] = "crs-fe@delta.org"
msg['To'] = ",".join(item for item in ag_config['recepients'])

html_msg = MIMEText(html_data, 'html')
msg.attach(html_msg)

#load image file
with open('outputs/ddlogo1.png', 'rb') as f:
    # set attachment mime and file name, the image type is png
    mime = MIMEBase('image', 'png', filename='ddlogo1.png')
    # add required header data:
    mime.add_header('Content-Disposition', 'attachment', filename='ddlogo1.png')
    mime.add_header('X-Attachment-Id', '0')
    mime.add_header('Content-ID', '<0>')
    # read attachment file content into the MIMEBase object
    mime.set_payload(f.read())
    # encode with base64
    encode_base64(mime)
    # add MIMEBase object to MIMEMultipart object
    msg.attach(mime)

rcpts = ag_config['recepients']

# Send image 
s = smtplib.SMTP('localhost')
for rcpt in rcpts:
    s.sendmail("crs-fe@delta.org", rcpt , msg.as_string())
    print("Sending email to " + rcpt)
s.quit()
