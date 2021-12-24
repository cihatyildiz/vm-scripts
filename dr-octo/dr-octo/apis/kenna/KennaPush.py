from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import requests
import json
import os
from requests.auth import HTTPBasicAuth

kenna_push = Blueprint('kenna_push', __name__)

@kenna_push.route('/kenna/push/vulns', methods = ['POST'])
def pushToKenna():
    vulns = request.json
    access_token = os.environ['KENNA_ACCESS_TOKEN'].replace('"', '')
    for vuln in vulns:
        try:
            vuln
            res = requests.post(
                'https://api.kennasecurity.com/vulnerabilities',
                headers = {
                    'content-type': "application/json",
                    'x-risk-token': "1xHaoTyFBU6P7DjGvN1Mtrd3hWdg2DGSxYszvHooPWQautPC6r8GgT2asD6FCsNG"
                },
                data = json.dumps({
                    "vulnerability": vuln
                })
            )
            print (res.text)
        except Exception as e:
            print ('EXCEPTION')
            print (e)
            pass
    return jsonify({
        'response_message': 'vulns created in kenna',
        'response_code': 200
    })