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



# # Use at end of script to delete token
# def del_token(tkn_id):
#     headers = {
#         'Accept': "application/json",
#         'Content-Type': "application/json",
#         'Authorization': "Basic " + b64auth
#     }
#     conn.request("DELETE", ssc_cntx + "api/v1/tokens/" + tkn_id, headers=headers)
#     res = conn.getresponse()
#     data = res.read()
#     parsed_data = json.loads(data.decode("utf-8"))
#     response_code = parsed_data["responseCode"]
#     if response_code == 200:
#         print("Token deleted successfully")
#     else:
#         print("Failed to delete token")


# #Download the source code for Fotify Scan
# def download_code():
#     print("Downloading the code for Fortify scan \n")
#     app_name="hellogitworld"
#     os.system("rm -rf /opt/Fortify/source_code/hellogitworld")
#     cmd="git clone https://github.com/githubtraining/hellogitworld.git ./source_code/"+app_name
#     print(cmd)
#     os.system(cmd)
#     return(app_name)

# def get_token():
#     payload = "{\"type\": \"UnifiedLoginToken\",\"description\":\"REST API token for testing\"}"
#     headers = {
#         'Accept': "application/json",
#         'Content-Type': "application/json",
#         'Authorization': "Basic " + b64auth
#     }
#     conn.request("POST", ssc_cntx + "api/v1/tokens", payload, headers)
#     res = conn.getresponse()
#     data = res.read()
#     parsed_data = json.loads(data.decode("utf-8"))
#     return {"id": parsed_data["data"]["id"], "token": parsed_data["data"]["token"]}

