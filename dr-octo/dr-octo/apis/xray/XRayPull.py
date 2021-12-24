from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import requests
import json, os, urllib.parse
import os
from requests.auth import HTTPBasicAuth

xray_pull = Blueprint('xray_pull', __name__)
jfrog_xray_server = os.environ['JFROG_XRAY_SERVER']


@xray_pull.route('/xray/pull/<watch_name>', methods = ['GET'])
def xrayPull(watch_name):
    offset = request.args.get('offset') if request.args.get('offset') else 1
    limit = request.args.get('limit') if request.args.get('limit') else 1
    xray_url = urllib.parse.urljoin(jfrog_xray_server, '/api/v1/violations')
    xray_payload = {
        "filters": {
            "watch_name": watch_name
        },
        "pagination": {
            "order_by": "updated",
            "limit": int(limit),
            "offset": int(offset)
        }
    }
    XRAY_USERNAME = os.environ['XRAY_USERNAME'].replace('"', "")
    XRAY_PASSWORD = os.environ['XRAY_PASSWORD'].replace('"', "")
    res = requests.post(
        xray_url,
        headers = {
            'content-type': 'application/json',
        },
        auth=HTTPBasicAuth(XRAY_USERNAME, XRAY_PASSWORD),
        data = json.dumps(xray_payload),
        verify = False
    )
    violation_count=res.json()['total_violations']
    violations = res.json()['violations']
    violations_with_details = getViolationsWithDetails(violations)
    violation_res={
        "violation_count":violation_count,
        "violations":violations_with_details
    }
    return jsonify(violation_res)




def getViolationsWithDetails(violations):
    violations_with_details = []
    for violation in violations:
        try:
            violation_detail = getViolationDetails(violation['violation_details_url'])
            violations_with_details.append({'violation': violation, 'detail': violation_detail})
        except Exception as e:
            print ('EXCEPTION')
            print (e)
            pass
    return violations_with_details


def getViolationDetails(detail_url):
    XRAY_USERNAME = os.environ['XRAY_USERNAME'].replace('"', "")
    XRAY_PASSWORD = os.environ['XRAY_PASSWORD'].replace('"', "")
    res = requests.get(
        detail_url,
        auth=HTTPBasicAuth(XRAY_USERNAME, XRAY_PASSWORD),
        headers = {
            'content-type': 'application/json'
        },
        verify = False
    )
    violation_detail = json.dumps(res.json()).strip().replace('\\u2264', '')
    return (json.loads(violation_detail))
