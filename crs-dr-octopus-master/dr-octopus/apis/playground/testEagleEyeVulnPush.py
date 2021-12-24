from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import requests
import json
import os
from requests.auth import HTTPBasicAuth
from libs.eagle_eye.vulns import EagleEyeVulns


test_ee_push = Blueprint('test_ee_push', __name__)

@test_ee_push.route('/test_ee_push', methods = ['GET'])
def testEagleEyeVulnPush():
  eagle_eye_vulns = EagleEyeVulns()
  response = eagle_eye_vulns.pushVuln(
    'title', 'criticality', 'status', 'app', 'details'
  )
  return response.json()