from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import requests
import json
from requests.auth import HTTPBasicAuth

app_name_mappings = Blueprint('app_name_mappings', __name__)

@app_name_mappings.route('/app_name_mappings', methods = ['GET'])
def appNameMappings():
  data = { 
    "explore-app": {
      "contrast_name": {
        "parent_name": "",
        "children_names": []
      },
      "artifactory_path": "xray-temp"
    },
    "xxx-app": {
      "contrast_name": None,
      "artifactory_path": "xray-temp/<username>/feature-01",
      "git_repo": "https://<git-server>/DEVPROJECTS/xxx-app.git"
    },
    "xxx-web": {
      "artifactory_path": "docker-local-dev/xxx-app",
      "git_repo": "https://<git-server>/DEVPROJECTS/xxx-app.git"
    }
  }
  return jsonify(data)