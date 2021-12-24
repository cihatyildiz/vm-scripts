from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import requests, json, os, urllib.parse, posixpath
from requests.auth import HTTPBasicAuth
import urllib3
from libs.eagle_eye.apps import EagleEyeApps

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
artifactory_path_info = Blueprint('artifactory_path_info', __name__)


dr_octopus_api = os.environ['DR_OCTOPUS_API']
jfrog_artifactory_server = os.environ['JFROG_ARTIFACTORY_SERVER']

@artifactory_path_info.route('/artifactory/app/path_info/<app_name>', methods = ['GET'])
def ArtifactoryPathInfo(app_name):
  url = urllib.parse.urljoin(dr_octopus_api, 'app_name_mappings')
  response = requests.get(url)
  app_name_mappings = response.json()
  artifactory_path = app_name_mappings[app_name]['artifactory_path']
  artifactory_username = os.environ['XRAY_USERNAME'].replace('"', "")
  artifactory_password = os.environ['XRAY_PASSWORD'].replace('"', "")
  url = urllib.parse.urljoin(jfrog_artifactory_server, posixpath.join('/artifactory/api/storage', artifactory_path))
  response = requests.get(
    url,
    auth=HTTPBasicAuth(artifactory_username, artifactory_password),
    verify = False
  )
  if response.status_code == 200:
    print("DONE: ArtifactoryPathInfo")
    return response.json()
  return {
    'status_code': response.status_code,
    'message': 'Couldn\'t find artifact in artifactory server'
  }
