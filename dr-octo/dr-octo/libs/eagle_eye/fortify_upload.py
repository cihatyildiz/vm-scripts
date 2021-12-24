import requests, os, json
from requests.auth import HTTPBasicAuth

def getUploadToken():
  print ('getUploadToken')
  url = 'http://<fortify-server>/ssc/api/v1/fileTokens'
  headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  }
  payload={
    "fileTokenType": "UPLOAD"
  }
  response = requests.post(url, headers=headers, auth=HTTPBasicAuth(
      os.environ['SSC_USERNAME'], os.environ['SSC_PASSWORD']), data=json.dumps(payload))
  response_json = response.json()
  token = response_json['data']['token']
  print('token', token)
  return token


def uploadFprToSSC(app_name, project_id, fpr_path, upload_token):
  print('in upload fpr to ssc')
  curl_cmd = 'curl -X "POST" "http://<fortify-server>/ssc/upload/resultFileUpload.html?mat={}" -F "entityId={}" -F "file=@{}"'.format(upload_token, project_id, fpr_path)
  os.system(curl_cmd)


def uploadFortifyFPR(app_name, project_id, fpr_path):
  upload_token = getUploadToken()
  uploadFprToSSC(app_name, project_id, fpr_path, upload_token)
