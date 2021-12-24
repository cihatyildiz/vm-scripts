from flask import jsonify, Blueprint
import requests, os, json, posixpath, urllib.parse
import datetime, time, math
from requests.auth import HTTPBasicAuth
from libs.eagle_eye.apps import EagleEyeApps
from libs.eagle_eye.vulns import EagleEyeVulns


jfrog_artifactory_server = os.environ['JFROG_ARTIFACTORY_SERVER']
jfrog_xray_server = os.environ['JFROG_XRAY_SERVER']
jfrog_artifactory_bin_id = os.environ['JFROG_ARTIFACTORY_BIN_ID']
xray_username = os.environ['XRAY_USERNAME'].replace('"', "")
xray_password = os.environ['XRAY_PASSWORD'].replace('"', "")
drOctopusApi = os.environ['DR_OCTOPUS_API']


xrayScan = Blueprint('xrayScan', __name__)


def isAppUpdatedAfterLastScan(appId):
  art_last_update_time = getArtifactoryAppLastUpdateTime(appId).split('.')[0]
  art_last_update_time =float(datetime.datetime.strptime(art_last_update_time, "%Y-%m-%dT%H:%M:%S").timestamp())
  print("art",art_last_update_time)
  xray_last_update_time =float(getXRayLastScanTime(appId))
  print('xray',xray_last_update_time)
  if xray_last_update_time < art_last_update_time:
    return True
  else:
    return False


def getArtifactoryAppLastUpdateTime(appId):
  appsLib = EagleEyeApps()
  try:
    appConfig = appsLib.getAppConfig(appId)
    artifactory_path = appConfig['config']['artifactoryPath']
    artifactory_username = os.environ['XRAY_USERNAME'].replace('"', "")
    artifactory_password = os.environ['XRAY_PASSWORD'].replace('"', "")
    url = urllib.parse.urljoin(jfrog_artifactory_server, posixpath.join('/artifactory/api/storage', artifactory_path))
    response = requests.get(
    url,
    auth = HTTPBasicAuth(artifactory_username, artifactory_password),
    verify = False
    )
    if response.status_code == 200:
      last_update_time = response.json()['lastUpdated']
      return last_update_time
    return {
      'status_code': response.status_code,
      'message': 'Couldn\'t find artifact in artifactory server'
    }
  except Exception as e:
    print (e)
  return None


def getXRayLastScanTime(appId):
  appsLib = EagleEyeApps()
  logs = appsLib.getLogs(appId,'xray')
  if logs and logs['data'] and logs['data'][0]['data']['latestScanTime']:
    xray_last_scan_time = logs['data'][0]['data']['latestScanTime']
  else:
    xray_last_scan_time = float(0.0)
  return xray_last_scan_time


def getArtifactoryPathLastUpdateTime(path):
  url = urllib.parse.urljoin(jfrog_artifactory_server, posixpath.join('artifactory/api/storage', path))
  headers = {'content-type': 'application/json' }
  try:
    response = requests.get(url, headers, auth = HTTPBasicAuth(xray_username, xray_password), verify = False)
  except Exception as e:
    raise(e)
  last_update_time = response.json()['lastUpdated']
  return last_update_time


def ArtifactoryPathInfo(artifactoryPath):
  artifactory_username = os.environ['XRAY_USERNAME'].replace('"', "")
  artifactory_password = os.environ['XRAY_PASSWORD'].replace('"', "")
  url = urllib.parse.urljoin(jfrog_artifactory_server, posixpath.join('/artifactory/api/storage', artifactoryPath))
  response = requests.get(
    url,
    auth=HTTPBasicAuth(artifactory_username, artifactory_password),
    verify = False
  )
  if response.status_code == 200:
    return response.json()
  return {
    'status_code': response.status_code,
    'message': 'Couldn\'t find artifact in artifactory server'
  }


def getLatestVersion(artifactoryPath):
  try:
    pathInfo = ArtifactoryPathInfo(artifactoryPath)
    path = pathInfo['repo']+pathInfo['path']
    app_versions = {}
    latest_timestamp = datetime.datetime(2001, 1, 1).timestamp()
    for app_version in pathInfo['children']:
      version_path = ''
      version_path = path + '/' + app_version['uri'].replace('/', '')
      version_update_ts = getArtifactoryPathLastUpdateTime(version_path).split('.')[0]
      version_update_ts = datetime.datetime.strptime(version_update_ts, "%Y-%m-%dT%H:%M:%S").timestamp()
      app_versions[version_update_ts] = version_path
      if version_update_ts-latest_timestamp > 0:
        latest_timestamp = version_update_ts
    return app_versions[latest_timestamp]
  except Exception as e:
    print(e)
    raise(e)


def createInfoHTML(violation):
  infoHtml = """
    <p><b>Vuln Summary: </b>{}</p>
    <p><b>Impacted Artifacts: </b>{}</p>
    <p><b>CVE: </b>{}</p>
    <p><b>Infected Package: </b>{}</p>
    <p><b>Infected Versions: </b>{}</p>
  """.format(
    violation['detail']['description'],
    violation['detail']['impacted_artifacts'][0],
    violation['detail']['properties'][0]['cve'],
    violation['detail']['infected_components'][0],
    violation['detail']['infected_versions'][0]
  )
  return infoHtml


def updateXRayWatch(watch_name, appPath, artifactoryPath):
  app_art_repo_name = artifactoryPath.split('/', 1)[0]
  app_art_repo_path = '/'.join(appPath.split('/')[1:])
  payload = {
    "general_data": {
      "name": watch_name,
      "description": watch_name,
      "active": True
    },
    "project_resources": {
      "resources": [{
        "type": "repository",
        "bin_mgr_id": jfrog_artifactory_bin_id,
        "name": app_art_repo_name,
        "filters": [{
          "type": "path-regex",
          "value": app_art_repo_path
        }]
      }]
    },
    "assigned_policies": [
      {
        "name": "critical-severity",
        "type": "security"
      },
      {
          "name": "high-severity",
          "type": "security"
      },
      {
          "name": "medium-severity",
          "type": "security"
      },
      {
          "name": "low-severity",
          "type": "security"
      }
    ]
  }
  url = urllib.parse.urljoin(jfrog_xray_server, '/api/v2/watches/' + watch_name)
  headers = {
    'Content-Type': "application/json",
    'Accept': "*/*",
    'Cache-Control': "no-cache",
    'Connection': "keep-alive"
  }
  try:
    response = requests.put(url, headers=headers , auth=HTTPBasicAuth(xray_username, xray_password), data = json.dumps(payload), verify = False)
    if response.status_code != 200:
      raise('CANNOT_UPDATE_XRAY_WATCH ' + str(response.status_code))
  except Exception as e:
    print (e)
    raise('CANNOT_UPDATE_XRAY_WATCH')
  return None


def createXRayWatch(appId,appName, appPath,artifactoryPath):
  watch_name = 'ee-' + appName
  does_watch_exists = False
  try:
    watch_info = None
    url = urllib.parse.urljoin(jfrog_xray_server, posixpath.join('api/v2/watches', watch_name))
    response = requests.get(url, auth=HTTPBasicAuth(xray_username, xray_password), verify = False )

    if response.status_code == 200:
      watch_info = response
      print('watch exists')
      does_watch_exists = True
    else:
      print('watch does not exist')
      does_watch_exists = False
  except Exception as e:
    print (e)

  app_art_repo_name = artifactoryPath.split('/', 1)[0]
  app_art_repo_path = '/'.join(appPath.split('/')[1:])
  payload = {
    "general_data": {
      "name": watch_name,
      "description": watch_name,
      "active": True
    },
    "project_resources": {
      "resources": [{
        "type": "repository",
        "bin_mgr_id": jfrog_artifactory_bin_id,
        "name": app_art_repo_name,
        "filters": [{
          "type": "path-regex",
          "value": app_art_repo_path
        }]
      }]
    },
    "assigned_policies": [
      {
        "name": "critical-severity",
        "type": "security"
      },
      {
          "name": "high-severity",
          "type": "security"
      },
      {
          "name": "medium-severity",
          "type": "security"
      },
      {
          "name": "low-severity",
          "type": "security"
      }
    ]
  }
  url = urllib.parse.urljoin(jfrog_xray_server, '/api/v2/watches')
  headers = {
    'Content-Type': "application/json",
    'Accept': "*/*",
    'Cache-Control': "no-cache",
    'Connection': "keep-alive"
  }
  try:
    if does_watch_exists is not True:
      response = requests.post(url, headers=headers , auth=HTTPBasicAuth(xray_username, xray_password), data=json.dumps(payload), verify=False)
      if response.status_code == 200 or response.status_code == 201:
        print("watch created")
        initiateHistoryScan(watch_name, appPath)
    else:
      artifactory_timestamp = getLatestVersionTimestamp(artifactoryPath)
      last_scan_timestamp = getXRayLastScanTime(appId)
      if last_scan_timestamp > artifactory_timestamp:
        pass
      else:
        updateXRayWatch(watch_name, appPath, artifactoryPath)
        print("watch updated")
        time.sleep(10)
        initiateHistoryScan(watch_name, appPath)
      url = urllib.parse.urljoin(jfrog_xray_server, '/api/v2/watches')
      response = requests.post(url, headers = headers , auth=HTTPBasicAuth(xray_username, xray_password), data=json.dumps(payload), verify=False)
    return watch_name
  except Exception as e:
    print (e)
    raise('CANNOT_CREATE_XRAY_WATCH')
  return None


def initiateHistoryScan(watch_name, path):
  print("initiate history scan")
  repo_name = path.split('/', 1)[0]
  app_path = path.split('/', 1)[1]
  payload = {
    "time_range": "90d",
    "watch_name": watch_name,
    "selected_resources": [
      {
        "type": "repository",
        "name": repo_name,
        "bin_mgr_id": jfrog_artifactory_bin_id,
        "filters": [
          {
              "type": "path-regex",
              "value": app_path
          }
        ],
        "repo_type": "local",
        "permissions": {
            "manageable": True
        }
      }
    ]
  }
  url = urllib.parse.urljoin(jfrog_xray_server, '/ui/historyScan')
  headers = {
    'content-type': "application/json"
  }
  try:
    response = requests.post(url, headers = headers , auth = HTTPBasicAuth(xray_username, xray_password), data = json.dumps(payload), verify = False)
    if response.status_code != 200 and response.status_code != 201:
      raise('XRAY_UNABLE_TO_INTIATE_SCAN')
  except Exception as e:
      raise('XRAY_UNABLE_TO_INTIATE_SCAN')


def doXRayScan(appId,appPath):
  try:
    appsLib = EagleEyeApps()
    appConfig = appsLib.getAppConfig(appId)
    artifactoryPath = appConfig['config']['artifactoryPath']
    appName = appConfig['name']
    watch_name = createXRayWatch(appId, appName, appPath, artifactoryPath)
    time.sleep(10)
    offset = 1
    params = {
      "limit": 1,
      "offset":offset
    }
    url = urllib.parse.urljoin(drOctopusApi, posixpath.join('/xray/pull', watch_name))
    headers = {'content-type': 'application/json' }
    response = requests.get(url, headers = headers, params=params)
    print("pull response",response.json())
    violations_count = response.json()["violation_count"]
    print("violation count",violations_count)
    if violations_count > 0:
      count=math.ceil(violations_count/25)
      print('count',count)
      while offset <= count:
        print("offset", offset)
        params={
          "limit": 25,
          "offset": offset
        }
        response = requests.get(url, headers=headers, params=params)
        violations = response.json()["violations"]
        for violation in violations:
          try:
            eeVulns = EagleEyeVulns()
            vulnDetails = {
              "info": createInfoHTML(violation),
              "recommendations": "recommendation",
              "references": "references from api"
            }
            vuln = {
              'title': violation['detail']['summary'],
              'severity': violation['detail']['severity'],
              'status': 'open',
              'appId': appConfig['id'],
              'assetId':'',
              'details': vulnDetails,
              'srcTool': 'xray',
              'srcToolId': violation['detail']['issue_id']
            }
            eeVulns.pushVulnV3(vuln)
            time.sleep(1)
          except Exception as e:
            print(e)
        offset=offset+1
    return violations_count
  except Exception as e:
    print (e)


def getLatestVersionTimestamp(artifactoryPath):
  print('get Latest version time stamp')
  try:
    pathInfo = ArtifactoryPathInfo(artifactoryPath)
    path = pathInfo['repo']+pathInfo['path']
    app_versions = {}
    latest_timestamp = datetime.datetime(2001, 1, 1).timestamp()
    for app_version in pathInfo['children']:
      version_path = ''
      version_path = path + '/' + app_version['uri'].replace('/', '')
      version_update_ts = getArtifactoryPathLastUpdateTime(version_path).split('.')[0]
      version_update_ts = datetime.datetime.strptime(version_update_ts, "%Y-%m-%dT%H:%M:%S").timestamp()
      app_versions[version_update_ts] = version_path
      if version_update_ts-latest_timestamp > 0:
        latest_timestamp = version_update_ts
    return latest_timestamp
  except Exception as e:
    print(e)
    raise(e)


@xrayScan.route('/xray/scan/<appId>', methods = ['GET'])
def scan(appId):
  appsLib = EagleEyeApps()
  try:
    appConfig = appsLib.getAppConfig(appId)
    artifactoryPath = appConfig['config']['artifactoryPath']
    appName = appConfig['name']
    print ('STEP 1: Check if app is updated')
    if isAppUpdatedAfterLastScan(appId):
      print ('\t App is updated after last scan')
      print ('STEP 2: Get path of last updated artifact')
      appPath = getLatestVersion(artifactoryPath)
      print ('STEP 3: Intiate xray scan')
      violations = doXRayScan(appId,appPath)
      print ('STEP 4: Log the timestamp')
      if violations > 0:
        print("violations available")
        log = appsLib.updateLogs(appId,'xray','success')
        print ('\t XRay scan completed')
      return jsonify(violations)
    else:
      print('\t App is not updated after last succcesfull scan')
      print('scan unsuccesful')
      log=appsLib.updateLogs(appId,'xray','failed')
      return 'unsuccessful scan'
  except Exception as e:
    print(e)
    log = appsLib.updateLogs(appId,'xray','crahsed')
  return (appId)
