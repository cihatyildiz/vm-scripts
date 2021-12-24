from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import os, requests, random, json, time, posixpath, urllib.parse
from time import gmtime, strftime, sleep
import datetime, time
from libs.eagle_eye.apps import EagleEyeApps
from libs.eagle_eye.vulns import EagleEyeVulns
from libs.fortify.ssc_token import FortifySSCToken
import subprocess


fortify_scan = Blueprint('fortify_scan', __name__)
fortifyScaApi = os.environ['FORTIFY_SCA_API']
fortifySscApi = os.environ['FORTIFY_SSC_API']
fortifySscUnifiedLoginToken = os.environ['FORTIFY_SSC_UNIFIED_LOGIN_TOKEN']
gitToken = os.environ['GIT_TOKEN']


def createProjectVersion(versionDescription, version,eeAppConfig):
  try:
    appConfig = eeAppConfig
    appName = appConfig['config']['fortify']['projectName']
    projectId = appConfig['config']['fortify']['projectId']
    url = urllib.parse.urljoin(fortifySscApi, '/ssc/api/v1/projectVersions')
    headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "FortifyToken {}".format(fortifySscUnifiedLoginToken)
    }
    if appName is None or projectId is None:
      appName = 'ee-'+appConfig['name']
      payload = {
        "name": version,
        "description": versionDescription,
        "active": True,
        "committed": False,
        "project": {
          "name": appName,
          "description": "",
          "issueTemplateId": "Prioritized-HighRisk-Project-Template",
        },
        "issueTemplateId": "Prioritized-HighRisk-Project-Template",
        "status": "ACTIVE"
      }
    else:
      payload = {
        "name": version,
        "description": versionDescription,
        "active": True,
        "committed": False,
        "project": {
          "name": appName,
          "description": "",
          "issueTemplateId": "Prioritized-HighRisk-Project-Template",
          "id":projectId
        },
        "issueTemplateId": "Prioritized-HighRisk-Project-Template",
        "status": "ACTIVE"
      }
    response = requests.post(url, headers = headers, data = json.dumps(payload))
    appConfig['config']['fortify']['projectName']=response.json()['data']['project']['name']
    appConfig['config']['fortify']['projectId']=response.json()['data']['project']['id']
    eeAppsLib = EagleEyeApps()
    updated = eeAppsLib.updateAppConfig(appConfig)
    projectId = response.json()['data']['id']
    url = urllib.parse.urljoin(fortifySscApi, '/ssc/api/v1/bulk')
    payload = {
      "requests": [
        {
          "uri": urllib.parse.urljoin(fortifySscApi, posixpath.join('/ssc/api/v1/projectVersions', str(projectId), 'attributes')),
          "httpVerb": "PUT",
          "postData": [
            {
              "attributeDefinitionId": 5,
              "values": [
                {
                  "guid": "Maintenance"
                }
              ],
              "value": None
            },
            {
              "attributeDefinitionId": 6,
              "values": [
                {
                  "guid": "Internal"
                }
              ],
              "value": None
            },
            {
              "attributeDefinitionId": 7,
              "values": [
                {
                  "guid": "externalpublicnetwork"
                }
              ],
              "value": None
            },
            {
              "attributeDefinitionId": 10,
              "values": [],
              "value": None
            },
            {
              "attributeDefinitionId": 11,
              "values": [],
              "value": None
            },
            {
              "attributeDefinitionId": 12,
              "values": [],
              "value": None
            },
            {
              "attributeDefinitionId": 1,
              "values": [
                {
                  "guid": "High"
                }
              ],
              "value": None
            },
            {
              "attributeDefinitionId": 2,
              "values": [],
              "value": None
            },
            {
              "attributeDefinitionId": 3,
              "values": [],
              "value": None
            },
            {
              "attributeDefinitionId": 4,
              "values": [],
              "value": None
            }
          ]
        },
        {
          "uri": urllib.parse.urljoin(fortifySscApi, posixpath.join('/ssc/api/v1/projectVersions', str(projectId), 'responsibilities')),
          "httpVerb": "PUT",
          "postData": [
            {
              "responsibilityGuid": "projectmanager",
              "userId": None
            },
            {
              "responsibilityGuid": "securitychampion",
              "userId": None
            },
            {
              "responsibilityGuid": "developmentmanager",
              "userId": None
            }
          ]
        },
        {
          "uri": urllib.parse.urljoin(fortifySscApi, posixpath.join('/ssc/api/v1/projectVersions', str(projectId), 'action')),
          "httpVerb": "POST",
          "postData": [
            {
              "type": "COPY_FROM_PARTIAL",
              "values": {
                "projectVersionId": int(projectId),
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
          "uri": urllib.parse.urljoin(fortifySscApi, posixpath.join('/ssc/api/v1/projectVersions', str(projectId), '?hideProgress=True')),
          "httpVerb": "PUT",
          "postData": {
            "committed": True
          }
        },
        {
          "uri": urllib.parse.urljoin(fortifySscApi, posixpath.join('/ssc/api/v1/projectVersions', str(projectId), 'action')),
          "httpVerb": "POST",
          "postData": [
            {
              "type": "COPY_CURRENT_STATE",
              "values": {
                "projectVersionId": int(projectId),
                "previousProjectVersionId": "-1",
                "copyCurrentStateFpr": False
              }
            }
          ]
        }
      ]
    }
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    return projectId
  except Exception as e:
    print('exception while creating project version')
    print (e)
  return


def getVulnsFromSSC(fortifyProjectId):
  headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "FortifyToken {}".format(fortifySscUnifiedLoginToken)
  }
  url = urllib.parse.urljoin(fortifySscApi, posixpath.join('/ssc/api/v1/projectVersions', str(fortifyProjectId), 'issues'))
  response = requests.get(url, headers=headers)
  vulns = response.json()
  return vulns


def getIssueDetails(appId, item):
  url = urllib.parse.urljoin(fortifySscApi, posixpath.join('/ssc/api/v1/issueDetails', str(item['id'])))
  headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "FortifyToken {}".format(fortifySscUnifiedLoginToken)
  }
  response = requests.get(url, headers=headers)
  vuln_details = response.json()['data']
  vuln_details_info = """
    File Path: {}
    <br/>
    Line Number: {}
    <br/><br/>
    {}
  """.format(
    vuln_details['fullFileName'],
    vuln_details['lineNumber'],
    vuln_details['detail'].replace('\n', '<br/>').replace('\t','&nbsp').replace('{', '').replace('}', '')
  )

  vuln = {
    'title': item['issueName'],
    'severity': item['friority'].lower(),
    'status': item['issueStatus'],
    'appId': appId,
    'assetId':'',
    'srcTool': 'fortify',
    'srcToolId': str(item['id']),
    'details': {
      'info': vuln_details_info,
      'recommendations': vuln_details['recommendation'].replace('\n', '<br/>').replace('\t',' ').replace('{', '').replace('}', ''),
      'references': vuln_details['references'].replace('\n', '<br/>').replace('{', '').replace('}', '')
    }
  }
  return vuln


def runScanOnSCA(appId, projectId):
  url = urllib.parse.urljoin(fortifyScaApi, posixpath.join(
      'fortify', 'push-fpr', '{}?projectID={}'.format(appId, projectId)))
  response = requests.get(url)


def checkLatestCommit(gitUrL,appId,appName,displayName):
  appsLib = EagleEyeApps()
  url = gitUrL.replace('https://', '')
  gitDownloadCmd = "git ls-remote --heads https://{}@{} refs/heads/develop".format(gitToken, url)
  latestCommit = subprocess.check_output(gitDownloadCmd, shell=True).decode('utf-8').split( )[0]
  logs = appsLib.getLogs(appId,'fortify')
  if logs and logs['data'] and logs['data'][0]['data']['commitId']:
    logLatestCommit = logs['data'][0]['data']['commitId']
    if(logLatestCommit == latestCommit):
      appsLib.createFortifyLog(appId,'fortify','NO_UPDATES',latestCommit,appName,displayName)
      return False
    else:
      appsLib.createFortifyLog(appId,'fortify','STARTED',latestCommit,appName,displayName)
      return True
  else:
    appsLib.createFortifyLog(appId,'fortify','STARTED',latestCommit,appName,displayName)
    return True
  return False


@fortify_scan.route('/fortify/scan/<appId>', methods = ['GET'])
def scan(appId):
  try:
    eeAppsLib = EagleEyeApps()
    eeAppConfig = eeAppsLib.getAppConfig(appId)
    name = 'ee-'+eeAppConfig['name']
    appName =eeAppConfig['name']
    displayName=eeAppConfig['displayName']
    print('Step0:get Latest commit from git repo')
    gitUrL = eeAppConfig['config']['fortify']['gitUrl']
    isNewCommit = checkLatestCommit(gitUrL, appId,appName,displayName)
    if(isNewCommit):
      try:
        tokenResponse = FortifySSCToken().getNewToken()
        token = tokenResponse['token']
        tokenId = tokenResponse['id']
        os.environ['FORTIFY_SSC_UNIFIED_LOGIN_TOKEN'] = token
        global fortifySscUnifiedLoginToken
        fortifySscUnifiedLoginToken=token
        print('STEP1: Create project version in SSC')
        eeAppsLib.updateFortifyLogs(appId,'fortify','IN_PROGRESS',appName,displayName)
        currentTime = strftime("%Y-%m-%d-%H-%M", gmtime())
        versionTime = int(strftime("%Y%d%H%M", gmtime()))
        projectId = createProjectVersion((name+'-'+ currentTime),versionTime,eeAppConfig)
        print('projectID: {}'.format(projectId))
        print('STEP 2: Run scan on SCA server -> rc-lx2589')
        runScanOnSCA(appId, projectId)
        print('STEP 4: Sleep for 10s')
        time.sleep(10)
        print('\t Sleep time completed, moving on..')
        print('STEP 5: Getting vulns from SSC')
        vulns = getVulnsFromSSC(projectId)
        print('\t Got vulns from SSC')
        print('STEP 6: Push vulns to mongodb')
        res = []
        if len(vulns)>0:
          for item in vulns['data']:
            vuln = getIssueDetails(appId, item)
            eagleEyeVulns = EagleEyeVulns()
            eagleEyeVulns.pushVulnV3(vuln)
            res.append(vuln)
            time.sleep(1)
        print('Foritfy Scan Complete !!')
        eeAppsLib.updateFortifyLogs(appId,'fortify','COMPLETED',appName,displayName)
        fortifySSCToken = FortifySSCToken()
        fortifySSCToken.deleteToken(tokenId)
        return (json.dumps(res))
      except Exception as e:
        print(e)
        eeAppsLib.updateFortifyLogs(appId,'fortify','FAILED',appName,displayName)
    else:
      res = {}
      res['message'] = 'No need to scan'
      return json.dumps(res)
  except Exception as e:
    print(e)
    return
  return None
