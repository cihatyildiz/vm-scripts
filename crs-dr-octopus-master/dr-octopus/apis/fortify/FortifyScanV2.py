# from flask import Flask, request, jsonify, Blueprint, abort
# from flask_api import status
# import os, requests, random, json, time, posixpath, urllib.parse
# from libs.eagle_eye.vulns import EagleEyeVulns
# from libs.fortify.ssc_token import FortifySSCToken

# fortify_scan = Blueprint('fortify_scan', __name__)

# fortify_username = os.environ['XRAY_USERNAME'].replace('"', "")
# fortify_password = os.environ['XRAY_PASSWORD'].replace('"', "")
# dr_octopus_api = os.environ['DR_OCTOPUS_API']
# dr_octopus_sca_api = os.environ['DR_OCTOPUS_SCA_API']
# fortify_ssc_api = os.environ['FORTIFY_SSC_API']
# fortify_sca_api = os.environ['FORTIFY_SCA_API']
# fortify_ssc_unified_login_token = FortifySSCToken().getNewToken()


# def getAppConfig(app_name):
#   url = urllib.parse.urljoin(dr_octopus_api, '/app_name_mappings')
#   headers = {'content-type': 'application/json'}
#   app_config = None
#   try:
#     response = requests.get(url)
#     response_json = response.json()
#     app_config = 'None'
#     if app_name in response_json:
#       app_config = response_json[app_name]
#   except Exception as e:
#     print (e)
#   return app_config


# def createProjectVersion(app_name, version):
#   try:
#     print ('\t APP NAME: {}'.format(app_name))
#     url = urllib.parse.urljoin(fortify_ssc_api, '/ssc/api/v1/projectVersions')
#     headers = {
#       "Content-Type": "application/json",
#       "Accept": "application/json",
#       "Authorization": "FortifyToken {}".format(fortify_ssc_unified_login_token)
#     }
#     payload = {
#       "name": version,
#       "description": app_name,
#       "active": True,
#       "committed": False,
#       "project": {
#         "name": app_name,
#         "description": "",
#         "issueTemplateId": "Prioritized-HighRisk-Project-Template"
#       },
#       "issueTemplateId": "Prioritized-HighRisk-Project-Template",
#       "status": "ACTIVE"
#     }
#     response = requests.post(url, headers=headers, data=json.dumps(payload))
#     print (response)
#     project_id = response.json()['data']['id']
#     url = urllib.parse.urljoin(fortify_ssc_api, '/ssc/api/v1/bulk')
#     payload = {
#       "requests": [
#         {
#           "uri": urllib.parse.urljoin(fortify_ssc_api, posixpath.join('/ssc/api/v1/projectVersions', str(project_id), 'attributes')),
#           "httpVerb": "PUT",
#           "postData": [
#             {
#               "attributeDefinitionId": 5,
#               "values": [
#                 {
#                   "guid": "Maintenance"
#                 }
#               ],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 6,
#               "values": [
#                 {
#                   "guid": "Internal"
#                 }
#               ],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 7,
#               "values": [
#                 {
#                   "guid": "externalpublicnetwork"
#                 }
#               ],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 10,
#               "values": [],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 11,
#               "values": [],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 12,
#               "values": [],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 1,
#               "values": [
#                 {
#                   "guid": "High"
#                 }
#               ],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 2,
#               "values": [],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 3,
#               "values": [],
#               "value": None
#             },
#             {
#               "attributeDefinitionId": 4,
#               "values": [],
#               "value": None
#             }
#           ]
#         },
#         {
#           "uri": urllib.parse.urljoin(fortify_ssc_api, posixpath.join('/ssc/api/v1/projectVersions', str(project_id), 'responsibilities')),
#           "httpVerb": "PUT",
#           "postData": [
#             {
#               "responsibilityGuid": "projectmanager",
#               "userId": None
#             },
#             {
#               "responsibilityGuid": "securitychampion",
#               "userId": None
#             },
#             {
#               "responsibilityGuid": "developmentmanager",
#               "userId": None
#             }
#           ]
#         },
#         {
#           "uri": urllib.parse.urljoin(fortify_ssc_api, posixpath.join('/ssc/api/v1/projectVersions', str(project_id), 'action')),
#           "httpVerb": "POST",
#           "postData": [
#             {
#               "type": "COPY_FROM_PARTIAL",
#               "values": {
#                 "projectVersionId": int(project_id),
#                 "previousProjectVersionId": -1,
#                 "copyAnalysisProcessingRules": True,
#                 "copyBugTrackerConfiguration": True,
#                 "copyCurrentStateFpr": False,
#                 "copyCustomTags": True
#               }
#             }
#           ]
#         },
#         {
#           "uri": urllib.parse.urljoin(fortify_ssc_api, posixpath.join('/ssc/api/v1/projectVersions', str(project_id), '?hideProgress=True')),
#           "httpVerb": "PUT",
#           "postData": {
#             "committed": True
#           }
#         },
#         {
#           "uri": urllib.parse.urljoin(fortify_ssc_api, posixpath.join('/ssc/api/v1/projectVersions', str(project_id), 'action')),
#           "httpVerb": "POST",
#           "postData": [
#             {
#               "type": "COPY_CURRENT_STATE",
#               "values": {
#                 "projectVersionId": int(project_id),
#                 "previousProjectVersionId": "-1",
#                 "copyCurrentStateFpr": False
#               }
#             }
#           ]
#         }
#       ]
#     }
#     response = requests.post(url, headers=headers, data=json.dumps(payload))
#     return project_id
#   except Exception as e:
#     print (e)
#   return


# def getVulnsFromSSC(project_id):
#   headers = {
#     "Content-Type": "application/json",
#     "Accept": "application/json",
#     "Authorization": "FortifyToken {}".format(fortify_ssc_unified_login_token)
#   }
#   url = urllib.parse.urljoin(fortify_ssc_api, posixpath.join('/ssc/api/v1/projectVersions', str(project_id), 'issues'))
#   response = requests.get(url, headers=headers)
#   vulns = response.json()
#   return vulns


# def runScanOnSCA(app_name, project_id):
#   url = urllib.parse.urljoin(dr_octopus_sca_api, posixpath.join('fortify', 'push-fpr', '{}?projectID={}'.format(app_name, project_id)))
#   response = requests.get(url)
#   print (response)


# def getIssueDetails(app_name, item):
#   url = urllib.parse.urljoin(fortify_ssc_api, posixpath.join('/ssc/api/v1/issueDetails', str(item['id'])))
#   print (url)
#   headers = {
#     "Content-Type": "application/json",
#     "Accept": "application/json",
#     "Authorization": "FortifyToken {}".format(fortify_ssc_unified_login_token)
#   }
#   response = requests.get(url, headers=headers)
#   vuln_details = response.json()['data']
#   vuln_details_info = """
#     File Path: {}
#     <br/>
#     Line Number: {}
#     <br/><br/>
#     {}
#   """.format(
#     vuln_details['fullFileName'],
#     vuln_details['lineNumber'],
#     vuln_details['detail'].replace('\n', '<br/>')
#   )
#   print (vuln_details)
#   vuln = {
#     'title': item['issueName'],
#     'severity': item['friority'].lower(),
#     'status': 'open',
#     'app': app_name,
#     'src_tool': 'fortify',
#     'src_tool_id': str(item['id']),
#     'details': {
#       'info': vuln_details_info,
#       'recommendations': vuln_details['recommendation'].replace('\n', '<br/>'),
#       'references': vuln_details['references'].replace('\n', '<br/>')
#     }
#   }
#   return vuln


# @fortify_scan.route('/fortify/scan/<app_name>', methods = ['GET'])
# def scan(app_name):
#   print ('STEP: Get SSC token: ')
#   print ('\t'+fortify_ssc_unified_login_token)
#   # FortifySSCToken().deleteToken(fortify_ssc_unified_login_token)

#   #print ('STEP: Create project version in SSC')
#   # project_id = createProjectVersion(
#   #   app_name+'-'+str(random.randint(11, 99)),
#   #   # app_name,
#   #   random.randint(10, 1000)
#   # )
#   # print ('\tSSC PROJECT ID: {}'.format(project_id))
#   # print ('STEP: Get app config')
#   # app_config = getAppConfig(app_name)
#   # print ('\t Successfully got the app config')
#   # print ('STEP 3: Run scan on SCA server -> rc-lx2589')
#   # runScanOnSCA(app_name, project_id)
#   # print ('\t Scan successfully completed and fpr pushed to SSC')
#   # print ('STEP 4: Sleep for 10s')
#   # time.sleep(10)
#   # print ('\t Sleep time completed, moving on..')
#   # print ('STEP 5: Getting vulns from SSC')
#   project_id = 165
#   vulns = getVulnsFromSSC(project_id)
#   # FortifySSCToken().deleteToken()
#   print ('\t Got vulns from SSC')
#   print ('STEP 6: Push vulns to mongodb')
#   for item in vulns['data']:
#     vuln = getIssueDetails(app_name, item)
#     eagle_eye_vulns = EagleEyeVulns()
#     eagle_eye_vulns.pushVulnV2(vuln)
#     time.sleep(1)
#   print ('Foritfy Scan Complete !!')
#   return (json.dumps(vulns))
