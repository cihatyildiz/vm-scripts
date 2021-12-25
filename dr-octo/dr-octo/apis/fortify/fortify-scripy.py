import http.client
#import httplib
import base64
import json
import os
import calendar;
import time;
import requests
import urllib3
#from flask import Flask, request, jsonify, Blueprint, abort
#from flask_api import status
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from requests.auth import HTTPBasicAuth
# SSC Settings
ssc_host = "server:8080"  # SSC hostname:port
ssc_cntx = "/ssc"  # SSC root context
#ssc_user="<user-id>"
#ssc_pass=""
ssc_user = os.environ['SSC_USERNAME'].replace('"', "")  # SSC username
ssc_pass = os.environ['SSC_PASSWORD'].replace('"', "") # SSC password
secure = False  # Use HTTPS?
#pvid = "6"  # Project version ID

# base64-encoded string of "username:password" for Basic auth
b64auth = base64.b64encode(bytes(ssc_user + ":" + ssc_pass, encoding='utf-8')).decode("utf-8")

# Check if secure connection (HTTPS) is to be used
if secure:
    conn = http.client.HTTPSConnection(ssc_host)
    sscurl = "https://" + ssc_host + ssc_cntx
else:
    conn = http.client.HTTPConnection(ssc_host)
    sscurl = "http://" + ssc_host + ssc_cntx

# Check if root context ends with "/"
if not ssc_cntx.endswith("/"):
    ssc_cntx = ssc_cntx + "/"


# Get token of type UnifiedLoginToken
def get_token():
    payload = "{\"type\": \"UnifiedLoginToken\",\"description\":\"REST API token for testing\"}"
    headers = {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Basic " + b64auth
    }
    conn.request("POST", ssc_cntx + "api/v1/tokens", payload, headers)
    res = conn.getresponse()
    data = res.read()
    parsed_data = json.loads(data.decode("utf-8"))
    return {"id": parsed_data["data"]["id"], "token": parsed_data["data"]["token"]}


# Use at end of script to delete token
def del_token(tkn_id):
    headers = {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Basic " + b64auth
    }
    conn.request("DELETE", ssc_cntx + "api/v1/tokens/" + tkn_id, headers=headers)
    res = conn.getresponse()
    data = res.read()
    parsed_data = json.loads(data.decode("utf-8"))
    response_code = parsed_data["responseCode"]
    if response_code == 200:
        print("Token deleted successfully")
    else:
        print("Failed to delete token")


#Download the source code for Fotify Scan
def download_code():
    print("Downloading the code for Fortify scan \n")
    app_name="hellogitworld"
    os.system("rm -rf /opt/Fortify/source_code/hellogitworld")
    cmd="git clone https://github.com/githubtraining/hellogitworld.git ./source_code/"+app_name
    print(cmd)
    os.system(cmd)
    return(app_name)


# Create a project version
def create_pv(project, version, tkn):
    headers = {
        'Authorization': "FortifyToken " + tkn,
        'Accept': "application/json",
        'Content-type': 'application/json'
    }
    pvbody = {
        "name": str(version),
        "description": "",
        "active": True,
        "committed": False,
        "project": {
            "name": project,
            "description": "",
            "issueTemplateId": "Prioritized-HighRisk-Project-Template"
        },
        "issueTemplateId": "Prioritized-HighRisk-Project-Template"
    }
    conn.request("POST", ssc_cntx + "api/v1/projectVersions", json.dumps(pvbody), headers)
    res = conn.getresponse()
    data = res.read()

    parsed_data = json.loads(data.decode("utf-8"))
    print("PArsed Data is :\n")
    print(parsed_data)
    print("\nPArsed Data over")
    newpvid = parsed_data["data"]["id"]
    bulkbody = {
        "requests": [
            {
                "uri": sscurl + "api/v1/projectVersions/" + str(newpvid) + "/attributes",
                "httpVerb": "PUT",
                "postData": [
                    {
                        "attributeDefinitionId": 5,
                        "values": [
                            {
                                "guid": "Maintenance"
                            }
                        ],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 6,
                        "values": [
                            {
                                "guid": "OS"
                            }
                        ],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 7,
                        "values": [
                            {
                                "guid": "internalnetwork"
                            }
                        ],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 10,
                        "values": [],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 11,
                        "values": [],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 12,
                        "values": [],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 1,
                        "values": [
                            {
                                "guid": "High"
                            }
                        ],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 2,
                        "values": [],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 3,
                        "values": [],
                        "value": "null"
                    },
                    {
                        "attributeDefinitionId": 4,
                        "values": [],
                        "value": "null"
                    }
                ]
            },
            {
                "uri": sscurl + "api/v1/projectVersions/" + str(newpvid) + "/responsibilities",
                "httpVerb": "PUT",
                "postData": [
                    {
                        "responsibilityGuid": "projectmanager",
                        "userId": "null"
                    },
                    {
                        "responsibilityGuid": "securitychampion",
                        "userId": "null"
                    },
                    {
                        "responsibilityGuid": "developmentmanager",
                        "userId": "null"
                    }
                ]
            },
            {
                "uri": sscurl + "api/v1/projectVersions/" + str(newpvid) + "/action",
                "httpVerb": "POST",
                "postData": [
                    {
                        "type": "COPY_FROM_PARTIAL",
                        "values": {
                            "projectVersionId": newpvid,
                            "previousProjectVersionId": -1,
                            "copyAnalysisProcessingRules": True,
                            "copyBugTrackerConfiguration": True,
                            "copyCurrentStateFpr": False,
                            "copyCustomTags": True
                        }
                    }
                ]
            },
            {
                "uri": sscurl + "api/v1/projectVersions/" + str(newpvid) + "?hideProgress=true",
                "httpVerb": "PUT",
                "postData": {
                    "committed": True
                }
            },
            {
                "uri": sscurl + "api/v1/projectVersions/" + str(newpvid) + "/action",
                "httpVerb": "POST",
                "postData": [
                    {
                        "type": "COPY_CURRENT_STATE",
                        "values": {
                            "projectVersionId": newpvid,
                            "previousProjectVersionId": "-1",
                            "copyCurrentStateFpr": False
                        }
                    }
                ]
            }
        ]
    }
    conn.request("POST", ssc_cntx + "api/v1/bulk", json.dumps(bulkbody), headers)
    res = conn.getresponse()
    data = res.read()
    parsed_data = json.loads(data.decode("utf-8"))
    print (parsed_data)
# return parsed_data["responseCode"]
    return newpvid

# Get list of issues for project version with id "pvid"
def get_issues(tkn,pvid):
    headers = {
        'Authorization': "FortifyToken " + tkn,
        'Accept': "application/json"
    }
    conn.request("GET", ssc_cntx + "api/v1/projectVersions/" + pvid + "/issues", headers=headers)
    res = conn.getresponse()
    data = res.read()
    parsed_data = json.loads(data.decode("utf-8"))
    # print(parsed_data)
    return parsed_data

#Get the details of an issue
def get_issuedetails(issue_id,tkn):
    headers = {
        'Authorization': "FortifyToken " + tkn,
        'Accept': "application/json"
    }
    conn.request("GET", ssc_cntx + "api/v1/issueDetails/" + issue_id, headers=headers)
    res = conn.getresponse()
    data = res.read()
    parsed_data = json.loads(data.decode("utf-8"))
    return parsed_data


#initiate the Fortify Scan
def run_fortify_scan(app_name):
    path="/opt/Fortify/source_code"  #This is the workspace where the code gets downloaded(sourcecode folder)
    dir_name='hellogitworld'
    build_id=app_name
    final_path= path + "/" + dir_name   #Path of the code to be scanned
    #final_path= path + "/*"
    print (final_path)
    cmd_buildclean = "/opt/Fortify/Fortify_SCA_and_Apps_19.1.0/bin/sourceanalyzer -b "+ build_id + " -clean -verbose"
    print(cmd_buildclean)
    cmd_buildcreate="/opt/Fortify/Fortify_SCA_and_Apps_19.1.0/bin/sourceanalyzer -b " +build_id + " -Xmx24G " + final_path + " -logfile " + path
    print(cmd_buildcreate)
    cmd_buildscan="/opt/Fortify/Fortify_SCA_and_Apps_19.1.0/bin/sourceanalyzer -b " +build_id + " -Xmx24G -scan -f " + path +"/" + build_id+".fpr  -logfile "+path+" -verbose"
    print(cmd_buildscan)
    #os.system("ls -lrt")
    os.system(cmd_buildclean)
    os.system(cmd_buildcreate)
    os.system(cmd_buildscan)
    os.system("chmod 755 "+ path +"/" + build_id+".fpr")


#Push the Issue details in Kenna
def push_to_kenna(cwe_id,recommendation,issueName,fullFileName):
    #data ="'cve_id':'"+cwe_id+"','primary_locator':'"+fullFileName+"','hostname':'"+issueName+"','notes':'"+recommendation+"'"
    url = "https://xxxx.kennasecurity.com/vulnerabilities"
    payload = "{\n\t\"vulnerability\": {\n\t\t\"wasc_id\": \"WASC-42\",\n\t\t\"primary_locator\": \"hostname\",\n\t\t\"url\": \"http://server:8080/ssc/api/v1/issueDetails/4102\"\n\t}\n}"
    print(payload)
    headers = {
    'content-type': "application/json",
    'x-risk-token': "fKiiH4YHzxLkNzeayy2BgrpmPsFFRpyDZVs68_K8QG5b8p2p_cPSM51zp3zttWpR"
    }
    response = requests.request("POST", url, data=payload, headers=headers)
    return (response.status)
    print (response)



app_name=download_code() #Initiate Download

version= calendar.timegm(time.gmtime()) #Taking the current timestamp as a version in order to obtain a unique version
version=str(version)
version=version+".0"
print(version)
app_name=app_name+str(version)

run_fortify_scan(app_name) #Initiate the scan

token_response = get_token() # Get token in order to access SSC REST API

token_id = str(token_response["id"])  # Required for deleting token

token = token_response["token"]  # Token of type UnifiedLoginToken

#token="ZDUwNmZhY2YtNjkxOS00NzlhLWE0NGUtMDdkZGNjNTM1MTJh"
pvid = create_pv(app_name, str(version), token)  #Create Project in SSC and get pvid
#pvid = create_pv("XYZ1234", "2.0", token)  #Create Project in SSC and get pvid
print("New project version ID: " + str(pvid))

#Upload the fpr to the pvid
#authtoken="NWQ5YmVkMTAtYjhlMC00NTk1LWFmMjUtMjIyOTUzYzhiNDJh"
authtoken="f2c34249-0816-4815-8b00-ccb43e4a5e93"
path="/opt/Fortify/source_code"
#cmd_uploadfpr=("/opt/Fortify/Fortify_SCA_and_Apps_19.1.0/bin/fortifyclient -url http://server:8080/ssc -authtoken " +str(authtoken)+ " uploadFPR -file " + str(path) +"/"+ str(app_name)+".fpr -applicationVersionID "+str(pvid))
cmd_uploadfpr="fortifyclient -url "+sscurl+" -authtoken "+str(authtoken)+" uploadFPR -file "+str(path) + "/"+str(app_name)+".fpr -applicationVersionID "+str(pvid)
print(cmd_uploadfpr)
cmd_uploadfpr=str(cmd_uploadfpr)
os.system(cmd_uploadfpr)

# Get issues
issues = get_issues(token,pvid)
print (issues)
issues_count = issues["count"]

for i in range(0, issues_count):
    #print("IID: " + issues["data"][i]["issueInstanceId"])
    issue_id = str(issues["data"][i]["id"])
    #print("ID: " +issue_id)
    issue_details = get_issuedetails(issue_id,tkn)
   # print("Issue DETAILS: "+ str(issue_details))
    references= str(issue_details["data"]["references"])
    a,b=references.split("CWE ID ",1)
    cwe_id,c=b.split("\n",1)
    recommendation= str(issue_details["data"]["recommendation"])
    issueName=(issue_details["data"]["issueName"])
    fullFileName=(issue_details["data"]["fullFileName"])
    status=push_to_kenna(cwe_id,recommendation,issue_id,fullFileName)


# Delete token
del_token(token_id)