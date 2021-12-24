import urllib.parse, posixpath
import requests, os, json
from requests.auth import HTTPBasicAuth

fortify_ssc_api = os.environ['FORTIFY_SSC_API']
fortify_ssc_username = os.environ['FORTIFY_SSC_USERNAME']
fortify_ssc_password = os.environ['FORTIFY_SSC_PASSWORD']

class FortifySSCToken:
  def getNewToken(self):
    print ('\t getting new ssc token')
    url = urllib.parse.urljoin(fortify_ssc_api, 'ssc/api/v1/tokens')
    headers = {'content-type': 'application/json'}
    payload = {"type": "UnifiedLoginToken","description": "REST API token for testing"}
    response = requests.post(url, headers=headers, auth=HTTPBasicAuth(fortify_ssc_username, fortify_ssc_password), data=json.dumps(payload))
    token = response.json()['data']
    return token

  def deleteToken(self, token):
    print ('\t deleting ssc token')
    token=str(token)
    url = urllib.parse.urljoin(fortify_ssc_api, posixpath.join('ssc/api/v1/tokens', token))
    headers = {'content-type': 'application/json'}
    response = requests.delete(url, headers=headers, auth=HTTPBasicAuth(fortify_ssc_username, fortify_ssc_password))
    print (response.text)
    return
