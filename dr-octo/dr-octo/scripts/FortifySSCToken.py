import os, json
import urllib.parse, posixpath
import requests
from requests.auth import HTTPBasicAuth

fortify_ssc_api = os.environ['FORTIFY_SSC_API']
fortify_ssc_username = os.environ['FORTIFY_SSC_USERNAME']
fortify_ssc_password = os.environ['FORTIFY_SSC_PASSWORD']

def getForitfySSCToken():
  url = urllib.parse.urljoin(fortify_ssc_api, 'ssc/api/v1/tokens')
  headers = {'content-type': 'application/json'}
  payload = {"type": "UnifiedLoginToken","description": "REST API token for testing"}
  response = requests.post(url, headers=headers, auth=HTTPBasicAuth(fortify_ssc_username, fortify_ssc_password), data=json.dumps(payload))
  token = response.json()['data']['token']
  return token


if __name__ == '__main__':
  print ('get foritfy token')
  token = getForitfySSCToken()
  del os.environ['FORTIFY_SSC_UNIFIED_LOGIN_TOKEN']
  os.environ['FORTIFY_SSC_UNIFIED_LOGIN_TOKEN'] = 'token'
  
