import requests
from libs.graphql.graphql import GraphQL
import datetime, time


class EagleEyeApps:
  def getAppConfig(self, appId):
    graphql = GraphQL()
    query = f"""
      {{
        eeAppById (id: "{appId}") {{
          id
          name
          displayName
          config{{
            contrastAppId
            fortify{{
              gitUrl
              projectId
              projectName
            }}
            xray{{
              xrayWatchName
            }}
            artifactoryPath
            cronjobIds
          }}
        }}
      }}
    """
    graphql = GraphQL()
    response = graphql.graphql(query)
    if response.status_code == 200:
      if response.json()['data']:
        return response.json()['data']['eeAppById']
    return None


  def updateAppConfig(self,appConfig):
    query = f"""
      mutation eeAppUpdate($query:eeAppUpdateInputType){{
        eeAppUpdate(eeApp:$query){{
          id
          name
        }}
      }}
    """
    variables = {
      "query": appConfig
    }
    graphql = GraphQL()
    response = graphql.graphql(query,variables)
    if response.status_code == 200:
      if response.json()['data']:
        return response.json()['data']['eeAppUpdate']
    return None


  def getLogs(self,appId,toolName):
    query = f"""
       query ($query: JSON,) {{
        logBySearch(query:$query, limit:1,skip:0){{
          data{{
            id
            type
            data
          }}
        }}
      }}
      """
    variables = {
      "query" : {
        "data.appId": appId,
        "data.srcTool": toolName
		  }
    }
    graphql = GraphQL()
    response = graphql.graphql(query,variables)
    if response.status_code == 200:
      if response.json()['data']:
        return response.json()['data']['logBySearch']
    return None

  def createLog(self,appId,srcTool,status,appName,displayName):
    graphql = GraphQL()
    scanTime = datetime.datetime.now().timestamp()
    try:
      query = f"""
        mutation ($query: logInputType) {{
          logCreate (log: $query) {{
            id
            type
            data
          }}
        }}
      """
      variables = {
        "query": {
          "type": "ee-scan-"+srcTool,
          "data": {
            "appId": appId,
            "srcTool": srcTool,
            "scanStartTime": scanTime,
            "status":status,
            "appName":appName,
            "displayName":displayName
          }
        }
      }
      graphql = GraphQL()
      response = graphql.graphql(query,variables)
      if response.status_code == 200:
        if response.json()['data']:
          return "create success"
    except Exception as e:
      print (e)
    return None

  def updateLogs(self,appId,srcTool,status,appName,displayName):
    try:
      logs = self.getLogs(appId,srcTool)
      if logs and logs['data'] and logs['data'][0]['data']:
        logId = logs['data'][0]['id']
        scanStartTime = logs['data'][0]['data']['scanStartTime']
        scanTime = datetime.datetime.now().timestamp()
        if status == 'COMPLETED' or status == 'FAILED':
          scanFinishTime = scanTime
        else:
          scanFinishTime =''
        try:
          query = f"""
            mutation ($query: logUpdateInputType) {{
              logUpdate (log: $query) {{
                id
                type
                data
                }}
              }}
          """
          variables = {
            "query": {
              "id": logId,
              "type": "ee-scan-"+srcTool,
              "data": {
                "appId": appId,
                "srcTool": srcTool,
                "scanStartTime": scanStartTime,
                "scanFinishTime": scanFinishTime,
                "status":status,
                "appName":appName,
                "displayName":displayName
              }
            }
          }
          graphql = GraphQL()
          response = graphql.graphql(query,variables)
          if response.status_code == 200:
            if response.json()['data']:
              return 'update success'
        except Exception as e:
          print(e)
    except Exception as e:
      print(e)
    return None


  def updateFortifyLogs(self,appId,toolName,status,appName,displayName):
    try:
      logs = self.getLogs(appId,toolName)
      if logs and logs['data'] and logs['data'][0]['data']['commitId']:
        logId = logs['data'][0]['id']
        scanTime = datetime.datetime.now().timestamp()
        scanStartTime = logs['data'][0]['data']['scanStartTime']
        scanFinishTime =''
        if status == 'COMPLETED':
          scanFinishTime = scanTime
        latestCommit = logs['data'][0]['data']['commitId']
        query = f"""
          mutation ($query: logUpdateInputType) {{
            logUpdate (log: $query) {{
              id
              type
              data
              }}
            }}
          """
        variables = {
          "query": {
            "id": logId,
            "type": "ee-scan-" + toolName,
            "data": {
              "appId": appId,
              "srcTool": toolName,
              "commitId": latestCommit,
              "scanStartTime": scanStartTime,
              "scanFinishTime": scanFinishTime,
              "status": status,
              "appName":appName,
              "displayName":displayName
            }
          }
        }
        graphql = GraphQL()
        response = graphql.graphql(query,variables)
        if response.status_code == 200:
          if response.json()['data']:
            return 'update success'
    except Exception as e:
      print(e)
    return None

  def createFortifyLog(self,appId,srcTool,status,latestCommit,appName,displayName):
    graphql = GraphQL()
    scanTime = datetime.datetime.now().timestamp()
    scanFinishTime = ''
    if status == 'NO_UPDATES':
      scanFinishTime = scanTime
    try:
      query = f"""
        mutation ($query: logInputType) {{
          logCreate (log: $query) {{
            id
            type
            data
          }}
        }}
      """
      variables = {
        "query": {
          "type": "ee-scan-" + srcTool,
          "data": {
            "appId": appId,
            "srcTool": srcTool,
            "commitId": latestCommit,
            'scanStartTime': scanTime,
            'scanFinishTime': scanFinishTime,
            'status': status,
            'appName':appName,
            'displayName':displayName
          }
        }
      }
      graphql = GraphQL()
      response = graphql.graphql(query,variables)
      if response.status_code == 200:
        if response.json()['data']:
          return "create success"
    except Exception as e:
      print (e)
    return None

# with xray logs
#  def updateLogs(self,appId,toolName,status):
#     try:
#       logs = self.getLogs(appId,toolName)
#       if logs and logs['data'] and logs['data'][0]['data']:
#         logId = logs['data'][0]['id']
#         scans = logs['data'][0]['data']['scans']
#         latestScanTime = logs['data'][0]['data']['latestScanTime']
#         response = self.updateLog(logId,appId,toolName,status,scans,latestScanTime)
#         return response
#       else:
#         response = self.createLog(appId,toolName,status)
#         return response
#     except Exception as e:
#       print(e)
#     return None

# def updateLog(self,logId,appId,srcTool,status,scans,latestScanTime):
#     scanTime = datetime.datetime.now().timestamp()
#     if status == 'success':
#       latestScanTime = scanTime
#     else:
#       latestScanTime = latestScanTime
#     scans.append({
#       'scanTime':scanTime,
#       'status':status
#     })
#     try:
#       query = f"""
#         mutation ($query: logUpdateInputType) {{
#           logUpdate (log: $query) {{
#                    id
#                    type
#                    data
#                  }}
#                }}
#         """
#       variables = {
#         "query": {
#           "id": logId,
#           "type": "ee"+srcTool+"scan",
#           "data": {
#             "appId": appId,
#             "srcTool": srcTool,
#             "latestScanTime": latestScanTime,
#             "scans": scans
#           }
#         }
#       }
#       graphql = GraphQL()
#       response = graphql.graphql(query,variables)
#       if response.status_code == 200:
#         if response.json()['data']:
#           return 'update success'
#     except Exception as e:
#       print (e)
#     return None
