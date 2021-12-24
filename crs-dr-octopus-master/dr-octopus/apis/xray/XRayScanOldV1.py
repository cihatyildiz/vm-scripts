from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import requests, os, json, posixpath, urllib.parse
from requests.auth import HTTPBasicAuth
from time import sleep
import datetime, time
from libs.eagle_eye.vulns import EagleEyeVulns

xray_scan = Blueprint('xray_scan', __name__)

xray_username = os.environ['XRAY_USERNAME'].replace('"', "")
xray_password = os.environ['XRAY_PASSWORD'].replace('"', "")
dr_octopus_api = os.environ['DR_OCTOPUS_API']
jfrog_artifactory_server = os.environ['JFROG_ARTIFACTORY_SERVER']
jfrog_xray_server = os.environ['JFROG_XRAY_SERVER']
jfrog_artifactory_bin_id = os.environ['JFROG_ARTIFACTORY_BIN_ID']

def getAppConfig(app_name):
  url = urllib.parse.urljoin(dr_octopus_api, 'app_name_mappings')
  headers = {'content-type': 'application/json'}
  try:
    response = requests.get(url, headers)
  except Exception as e:
    print (e)
  response_json = response.json()
  app_config = None
  if app_name in response_json:
    app_config = response_json[app_name]
  return app_config


def getLatestVersion(app_name):
  url = urllib.parse.urljoin(dr_octopus_api, posixpath.join('/artifactory/app/path_info', app_name))
  headers = {'content-type': 'application/json' }
  print (url)
  try:
    response = requests.get(url)
    path = response.json()['repo']+response.json()['path']
    app_versions = {}
    latest_timestamp = datetime.datetime(2001, 1, 1).timestamp()
    for app_version in response.json()['children']:
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


def getLatestVersionTimestamp(app_name):
  url = urllib.parse.urljoin(dr_octopus_api, posixpath.join('/artifactory/app/path_info', app_name))
  headers = {'content-type': 'application/json' }
  try:
    response = requests.get(url)
    path = response.json()['repo']+response.json()['path']
    app_versions = {}
    latest_timestamp = datetime.datetime(2001, 1, 1).timestamp()
    for app_version in response.json()['children']:
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


def getArtifactoryPathLastUpdateTime(path):
  url = urllib.parse.urljoin(jfrog_artifactory_server, posixpath.join('artifactory/api/storage', path))
  headers = {'content-type': 'application/json' }
  try:
    response = requests.get(url, headers, auth=HTTPBasicAuth(xray_username, xray_password), verify = False)
  except Exception as e:
    raise(e)
  last_update_time = response.json()['lastUpdated']
  return last_update_time


def getArtifactoryAppLastUpdateTime(app_name):
  url = urllib.parse.urljoin(dr_octopus_api, posixpath.join('/artifactory/app/path_info', app_name))
  headers = {'content-type': 'application/json' }
  try:
    response = requests.get(url, headers)
  except Exception as e:
    raise(e)
    print (e)
  last_update_time = response.json()['lastUpdated']
  return last_update_time


def getXRayLastScanTime(app_name):
  ts_json_file = open('/crs/dr-octopus/dr-octopus/apis/xray/xray_scan.ts.json', 'r')
  ts_json = json.load(ts_json_file)
  return ts_json[app_name]


def isAppUpdatedAfterLastScan(app_name):
  art_last_update_time = getArtifactoryAppLastUpdateTime(app_name)
  xray_last_update_time = getXRayLastScanTime(app_name)
  if xray_last_update_time is not art_last_update_time:
    return True
  else:
    return False


def createXRayWatch(app_name, app_path, app_config):
  watch_name = 'ee-' + app_name
  does_watch_exists = False
  try:
    watch_info = None
    url = urllib.parse.urljoin(jfrog_xray_server, posixpath.join('api/v2/watches', watch_name))
    response = requests.get(url, auth=HTTPBasicAuth(xray_username, xray_password), verify=False )
    print ('This is response')
    if response.status_code == 200:
      watch_info = response
      does_watch_exists = True
    else:
      does_watch_exists = False
  except Exception as e:
    print (e)
  app_art_repo_name = app_config['artifactory_path'].split('/', 1)[0]
  app_art_repo_path = '/'.join(app_path.split('/')[1:])
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
        initiateHistoryScan(watch_name, app_path)
    else:
      artifactory_timestamp = getLatestVersionTimestamp(app_name)
      last_scan_timestamp = getXRayLastScanTime(app_name)
      if last_scan_timestamp > artifactory_timestamp:
        pass
      else:
        updateXRayWatch(watch_name, app_path, app_config)
        time.sleep(10)
        initiateHistoryScan(watch_name, app_path)
      url = urllib.parse.urljoin(jfrog_xray_server, '/api/v2/watches')
      response = requests.post(url, headers=headers , auth=HTTPBasicAuth(xray_username, xray_password), data=json.dumps(payload), verify=False)
    return watch_name
  except Exception as e:
    print (e)
    raise('CANNOT_CREATE_XRAY_WATCH')
  return None


def updateXRayWatch(watch_name, app_path, app_config):
  app_art_repo_name = app_config['artifactory_path'].split('/', 1)[0]
  app_art_repo_path = '/'.join(app_path.split('/')[1:])
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
    response = requests.put(url, headers=headers , auth=HTTPBasicAuth(xray_username, xray_password), data=json.dumps(payload), verify=False)
    if response.status_code !=200:
      raise('CANNOT_UPDATE_XRAY_WATCH ' + str(response.status_code))
  except Exception as e:
    print (e)
    raise('CANNOT_UPDATE_XRAY_WATCH')
  return None


def initiateHistoryScan(watch_name, path):
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
    response = requests.post(url, headers=headers , auth=HTTPBasicAuth(xray_username, xray_password), data=json.dumps(payload), verify=False)
    if response.status_code != 200 and response.status_code != 201:
      raise('XRAY_UNABLE_TO_INTIATE_SCAN')
  except Exception as e:
      raise('XRAY_UNABLE_TO_INTIATE_SCAN')


def createInfoHTML(violation):
  info_html = """
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
  return info_html


def doXRayScan(app_name, app_path):
  print ('doXRayScan')
  try:
    app_config = getAppConfig(app_name)
    watch_name = createXRayWatch(app_name, app_path, app_config)
    time.sleep(10)
    url = urllib.parse.urljoin(dr_octopus_api, posixpath.join('/xray/pull', watch_name))
    headers = {'content-type': 'application/json' }
    response = requests.get(url, headers = headers)
    violations = response.json()
    for violation in violations:
      try:
        eagle_eye_vulns = EagleEyeVulns()
        vuln_details = {
          "info": createInfoHTML(violation),
          "recommendations": "recommendation",
          "references": "references from api"
        }
        vuln = {
          'title': violation['detail']['summary'],
          'severity': violation['detail']['severity'],
          'status': 'open',
          'app': app_name,
          'details': vuln_details,
          'src_tool': 'xray',
          'src_tool_id': violation['detail']['issue_id']
        }
        response = eagle_eye_vulns.pushVulnV2(vuln)
        time.sleep(1)
      except Exception as e:
        print (e)
    return violations
  except Exception as e:
    print (e)


def updateLastScanTimestamp(app_name):
  ts_json_file = open('/crs/dr-octopus/dr-octopus/apis/xray/xray_scan.ts.json', 'r')
  ts_json = json.load(ts_json_file)
  ts_json[app_name] = time.time()
  ts_json_file.close()
  with open('/crs/dr-octopus/dr-octopus/apis/xray/xray_scan.ts.json', 'w') as ts_json_file:
    json.dump(ts_json, ts_json_file)
  ts_json_file.close()


@xray_scan.route('/xray/scan/<app_name>', methods = ['GET'])
def scan(app_name):
  print ('/xray/scan')
  try:
    print ('STEP 1: Check if app is updated')
    if isAppUpdatedAfterLastScan(app_name):
      print ('\t App is updated after last scan')
      print ('STEP 2: Get path of last updated artifact')
      app_path = getLatestVersion(app_name)
      print ('STEP 3: Intiate xray scan')
      violations = doXRayScan(app_name, app_path)
      print ('STEP 4: Log the timestamp')
      if len(violations) > 0:
        updateLastScanTimestamp(app_name)
      print ('\t XRay scan completed')
      return jsonify(violations)
  except Exception as e:
    print (e)
  return (app_name)
