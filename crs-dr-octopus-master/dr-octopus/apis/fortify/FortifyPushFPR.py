from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import requests, os
from libs.eagle_eye.apps import EagleEyeApps
from libs.eagle_eye.fortify_upload import uploadFortifyFPR


fortify_push_fpr = Blueprint('fortify_push_fpr', __name__)


def downloadGITCode(appName, gitRepo):
  gitRepo = gitRepo.replace('https://', '')
  cwd = os.getcwd()
  os.chdir('/tmp/ee-apps-src-code')
  os.system('mkdir {}'.format(appName))
  os.chdir('/tmp/ee-apps-src-code/{}'.format(appName))
  os.system('rm -rf *')
  print ('rm -rf *')
  git_download_cmd = "git clone -b develop https://{}@{}".format(os.environ['GIT_TOKEN'], gitRepo)
  os.system(git_download_cmd)
  folderName=gitRepo.split('/')[-1].replace('.git', '')
  os.system('cd '+folderName)
  os.system('find . -type d -name test -exec rm -rf {} \;')
  srcPath = '/tmp/ee-apps-src-code/{}'.format(appName)+'/'+gitRepo.split('/')[-1].replace('.git', '')
  return srcPath


def intiateFortifyScan(appName, srcPath):
  os.chdir(srcPath)
  fortify_clean_cmd = '/opt/Fortify/Fortify_SCA_and_Apps_19.2.3/bin/sourceanalyzer -b {} -clean -verbose'.format(appName)
  os.system(fortify_clean_cmd)
  fortify_create_cmd = '/opt/Fortify/Fortify_SCA_and_Apps_19.2.3/bin/sourceanalyzer -b {} -Xmx24G {} -logfile {}'.format(appName, srcPath, srcPath)
  os.system(fortify_create_cmd)
  fortify_scan_cmd = '/opt/Fortify/Fortify_SCA_and_Apps_19.2.3/bin/sourceanalyzer -b {} -Xmx24G -scan -f {}/vulns.fpr  -logfile {} -verbose'.format(appName, srcPath, appName, srcPath)
  os.system(fortify_scan_cmd)
  print (fortify_scan_cmd)


@fortify_push_fpr.route('/fortify/push-fpr/<app_id>', methods = ['GET'])
def pushFPR(app_id):
  print ('STEP1: Get project ID')
  projectId = request.args.get('projectID')
  print ('\t {}'.format(projectId))
  print('STEP2: Get git repo from app_config')
  eeAppsLib = EagleEyeApps()
  appConfig = eeAppsLib.getAppConfig(app_id)
  appName = appConfig['name']
  appGitRepo =appConfig['config']['fortify']['gitUrl']
  print ('STEP3: Download app code from git to local')
  srcPath = downloadGITCode(appName, appGitRepo)
  print ('\t local path: {}'.format(srcPath))
  print ('STEP4: Initiate foritify scan')
  intiateFortifyScan(appName, srcPath)
  print ('STEP5: Upload FPR file to SSC')
  fprPath = srcPath+'/vulns.fpr'
  print ('\t FPR path: '+ fprPath)
  response = uploadFortifyFPR(appName, projectId, fprPath)
  print (response)
  return 'hello'
