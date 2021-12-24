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
    "test-app": {
      "contrast_name": None,
      "artifactory_path": "xray-temp/ca34991/feature-01",
      "git_repo": "https://rc-github.deltads.ent/DEVPROJECTS/amt-app.git"
    },
    "amt-web": {
      "artifactory_path": "delta-docker-local-dev/amt-app",
      "git_repo": "https://rc-github.deltads.ent/DEVPROJECTS/amt-app.git"
    },
    "test-v1-cx-enrollee-portal-web": {
      "git_repo": "https://rc-github.deltads.ent/DEVPROJECTS/dd-cx-enrollee-portal.git",
      "artifactory_path": "delta-docker-local-dev/dd-cx-enrollee-portal"
    },
    "cx-provider-directory": {
      "artifactory_path": "delta-docker-local-dev/cx-provider-directory-ee"
    },
    "field-validator": {
      "git_repo": "https://rc-github.deltads.ent/DEVPROJECTS/dd-validator.git"
    },
    "cx-shopping-web": {
      "contrast_app_id": "4b4e3b39-010c-444c-9f2f-a848a06ca6be",
      "git_repo": "https://rc-github.deltads.ent/DEVPROJECTS/dd-cx-shopping-v2.git"
    },
    "pad-web": {
      "artifactory_path": "delta-docker-local-dev/dd-pad-web",
      "git_repo": "https://rc-github.deltads.ent/DEVPROJECTS/dd-pad-web.git"
    },
    "cx-web": {
      "artifactory_path": "delta-docker-local-dev/dd-cx-web1",
      "contrast_app_id": "9830e54d-acb8-45b2-8616-86465bfd299a",
      "git_repo": "https://rc-github.deltads.ent/DEVPROJECTS/dd-cx-web.git"
    },
    "pf-claims-service": {
      "contrast_app_id": "f2bf5cf8-77eb-4ce2-b2ee-650e62c50962"
    },
    "pf-d2c-payment-service": {
      "artifactory_path": "delta-docker-virtual-dev/pf-d2c-payment-service",
      "contrast_app_id": "c200e06b-2ea6-456e-ade3-6ac7845d78b6",
      "git_repo": "https://rc-github.deltads.ent/DEVPROJECTS/pf-d2c-payment-service.git"
    },
    "pf-addresscleanse-service": {
      "artifactory_path": "delta-docker-local-dev/pf-addresscleanse-service"
    }
  }

  return jsonify(data)
