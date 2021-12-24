from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import requests, json, os, sys, time, subprocess
from requests.auth import HTTPBasicAuth

from libs.eagle_eye.vulns import EagleEyeVulns
from libs.eagle_eye.apps import EagleEyeApps
from libs.eagle_eye.assets import EagleEyeAssets

nexpose_scan = Blueprint('nexpose_scan', __name__)

nexpose_username = os.environ['NEXPOSE_USERNAME'].replace('"', "")
nexpose_password = os.environ['NEXPOSE_PASSWORD'].replace('"', "")
nexpose_api_token = os.environ['NEXPOSE_APITOKEN'].replace('"', "")

nexpose_asset_group_id = 332
nexpose_db_scan_type = "nexpose"


def updateAssetStatus(assetId, status):
    eagle_eye_assets = EagleEyeAssets()
    asset_logs = eagle_eye_assets.getLogs(assetId, nexpose_db_scan_type)
    print(asset_logs)
    logId = asset_logs['data'][0]['id']
    scans = asset_logs['data'][0]['data']['scans']
    result = eagle_eye_assets.updateLog(logId, assetId, nexpose_db_scan_type, status, scans)
    if result == "update success":
        asset_logs = eagle_eye_assets.getLogs(assetId, nexpose_db_scan_type)
        print(asset_logs)
        return(asset_logs['data'][0]['data']['srcStatus'])
    return "Error"


def getAssetStatus(assetId):
    eagle_eye_assets = EagleEyeAssets()
    asset_logs = eagle_eye_assets.getLogs(assetId, nexpose_db_scan_type)
    asset_status = "idle"
    if asset_logs['count'] == 0:
        eagle_eye_assets.createLog(assetId,nexpose_db_scan_type,asset_status)
        asset_logs = eagle_eye_assets.getLogs(assetId, nexpose_db_scan_type)
    return(asset_logs['data'][0]['data']['srcStatus'])


def getDbAssetIDIfExist(ipAddress):
    eagle_eye_assets = EagleEyeAssets()
    asset_id = eagle_eye_assets.getAssetIdIfExists(ipAddress)
    if asset_id == None:
        return eagle_eye_assets.assetCreate(ipAddress)
    return asset_id


@nexpose_scan.route('/nexpose/scan/', methods = ['POST'])
def nexpoe_run_scan():
    params = request.json
    asset_ip_addresses = params['ip_address']
    if params['api_key'] != nexpose_api_token:
        return jsonify({    
            'response_messagae': 'Error: API Key is not valid',
            })
    for ip_addr in asset_ip_addresses:
        print(ip_addr)
        db_asset_id = getDbAssetIDIfExist(ip_addr)
        db_asset_status = getAssetStatus(db_asset_id)
        if db_asset_status == "idle":
            updateAssetStatus(db_asset_id, "waiting")
        else:
            print("Status for {} is {}".format(ip_addr, db_asset_status))
    
    return jsonify({
        'response_message': 'Scan process has been initiated.',
        'response_code': 200
    })


@nexpose_scan.route('/nexpose/scan/status/', methods = ['POST']) 
def nexpoe_get_scan_status():
    params = request.json
    asset_ip_address = params['ip_address']
    if params['api_key'] != nexpose_api_token:
        return jsonify({    
            'response_messagae': 'Error: API Key is not valid',
            })
    
    db_asset_id = getDbAssetIDIfExist(asset_ip_address)
    db_asset_status = getAssetStatus(db_asset_id)
    
    return jsonify({
        'asset_status': db_asset_status
    })
