from flask import Flask, jsonify
import sys, logging

from apis.xray.XRayPull import xray_pull
from apis.kenna.KennaPush import kenna_push
from apis.configs.AppNameMappings import app_name_mappings
from apis.artifactory.PathInfo import artifactory_path_info
from apis.xray.XRayScan import xrayScan
from apis.playground.testEagleEyeVulnPush import test_ee_push
from apis.fortify.FortifyScan import fortify_scan
from apis.contrast.ContrastScan import contrast_scan
from apis.cronjob.cronjob import setCronJobs
#from apis.fortify.FortifyPushFPR import fortify_push_fpr
from apis.nexpose.NexposeScan import nexpose_scan

app = Flask(__name__)

app.register_blueprint(xray_pull)
app.register_blueprint(kenna_push)
app.register_blueprint(app_name_mappings)
app.register_blueprint(artifactory_path_info)
app.register_blueprint(xrayScan)
app.register_blueprint(fortify_scan)
app.register_blueprint(test_ee_push)
app.register_blueprint(contrast_scan)
app.register_blueprint(nexpose_scan)
app.register_blueprint(setCronJobs)
#app.register_blueprint(fortify_push_fpr)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

@app.route('/', methods = ['GET'])
def HelloWorld():
    return 'crs-dr-octopus api service'

@app.route('/ms_teams/webhook',  methods = ['POST'])
def msteams_webhook():
    print ('ms teams webhook')
    res = jsonify({
        "type": "message",
        "text": "This is a reply!"
    })
    return res

if __name__ == '__main__':
    app.run(debug = True, host = '0.0.0.0')
