import requests, json
from libs.graphql.graphql import GraphQL
import datetime, time

class EagleEyeAssets:

    def assetCreate(self, ipAddress):
        graphql = GraphQL()
        query = """
            mutation assetCreate($query:eeAssetInputType){
            eeAssetCreate(eeAsset:$query){
                id
                name
                ipAddress
                }
            }
        """
        variables = {
            "query": {
                "name": ipAddress,
                "ipAddress": ipAddress
                }
            }
        response = graphql.graphql(query = query, variables = json.dumps(variables))
        if response.status_code == 200:
            if response.json()['data']:
                if response.json()['data']['eeAssetCreate']:
                    return response.json()['data']['eeAssetCreate']["id"]
        return None
    
    def assetUpdate(self, assetId, assetName, assetIpAddress):
        graphql = GraphQL()
        query = """
            mutation assetUpdate($query:eeAssetUpdateInputType){
            eeAssetUpdate(eeAsset:$query){
                id
                name
                ipAddress
                tsUpdate
                tsCreate
            }
            }
        """
        variables ={
            "query": {
                "id": assetId,
                "name": assetName,
                "ipAddress": assetIpAddress
            }
        }
        response = graphql.graphql(query = query, variables = json.dumps(variables))
        if response.status_code == 200:
            if response.json()['data']:
                if response.json()['data']['eeAssetCreate']:
                    return response.json()['data']['eeAssetCreate']["id"]
        return None
        pass

    def getAssetIdIfExists(self, ipAddress):
        graphql = GraphQL()
        query = """
            query eeAssetBySearch($query: JSON) {
            eeAssetBySearch(query: $query, limit: 15, skip: 0) {
                count
                data {
                id
                name
                ipAddress
                tsCreate
                }
            }
            }
        """
        variables ={
            "query": {
                "ipAddress": ipAddress
            }
        }
        response = graphql.graphql(query = query, variables = json.dumps(variables))
        if response.status_code == 200:
            if response.json()['data']:
                if response.json()['data']['eeAssetBySearch']:
                    if response.json()['data']['eeAssetBySearch']['data']:
                        if response.json()['data']['eeAssetBySearch']['data']:
                            return response.json()['data']['eeAssetBySearch']['data'][0]["id"]
        return None

    def getAssetIpAddress(self, assetId):
        graphql = GraphQL()
        query = """
            query eeAssetBySearch($query: JSON) {
            eeAssetBySearch(query: $query, limit: 15, skip: 0) {
                count
                data {
                id
                name
                ipAddress
                tsCreate
                }
            }
            }
        """
        variables ={
            "query": {
                "id": assetId
            }
        }
        response = graphql.graphql(query = query, variables = json.dumps(variables))
        if response.status_code == 200:
            if response.json()['data']:
                if response.json()['data']['eeAssetBySearch']:
                    if response.json()['data']['eeAssetBySearch']['data']:
                        if response.json()['data']['eeAssetBySearch']['data']:
                            return response.json()['data']['eeAssetBySearch']['data'][0]["ipAddress"]
        return None


    def getLogs(self,assetId,toolName):
        query = f"""
        query ($query: JSON,) {{
            logBySearch(query:$query, limit:1,skip:0){{
            count
            data{{
                id
                type
                data
                tsCreate
                tsUpdate
            }}
            }}
        }}
        """
        variables = {
        "query" : {
            "data.assetId": assetId,
            "data.srcTool": toolName
            }
        }
        graphql = GraphQL()
        response = graphql.graphql(query,variables)
        if response.status_code == 200:
            if response.json()['data']:
                print(response.json()['data']['logBySearch'])
                return response.json()['data']['logBySearch']
        return None

    def createLog(self,assetId,srcTool,status):
        print('create logs')
        graphql = GraphQL()
        scanTime = datetime.datetime.now().timestamp()
        print(scanTime)
        scans = []
        scans.append({
        'scanTime': scanTime,
        'status': status
        })
        if status == 'success':
            latestScanTime = scanTime
        else:
            latestScanTime=None
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
                "type": "ee-"+srcTool+"-scan",
                "data": {
                    "assetId": assetId,
                    "srcTool": srcTool,
                    "srcStatus": status,
                    "latestScanTime": latestScanTime,
                    "latestScanId": "",
                    'scans': scans
                }
                }
            }
            graphql = GraphQL()
            response = graphql.graphql(query,variables)
            if response.status_code == 200:
                if response.json()['data']:
                    print(response.json()['data']['logCreate'])
                    return "create success"
        except Exception as e:
            print (e)
            return None

    def updateLog(self, logId, assetId, srcTool, status, scans, scanId=None):
        scanTime = datetime.datetime.now().timestamp()
        scan_id = ""
        if scanId != None:
            scan_id = scanId
        scans.append({
            'scanTime':scanTime,
            'status':status
        })
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
                "type": "ee-"+srcTool+"-scan",
                "data": {
                    "assetId": assetId,
                    "srcTool": srcTool,
                    "srcStatus": status,
                    "latestScanTime": scanTime,
                    "latestScanId": scan_id,
                    "scans": scans
                }
                }
            }
            graphql = GraphQL()
            response = graphql.graphql(query,variables)
            if response.status_code==200:
                if response.json()['data']:
                    print(response.json()['data']['logUpdate'])
                    return 'update success'
        except Exception as e:
            print (e)
            return None

        try:
            logs = self.getLogs(appId,toolName)
            if logs and logs['data'] and logs['data'][0]['data']['latestScanTime']:
                logId = logs['data'][0]['id']
                scans = logs['data'][0]['data']['scans']
                latestScanTime = logs['data'][0]['data']['latestScanTime']
                response = self.updateLog(logId,appId,toolName,status,scans,latestScanTime)
                return response
            else:
                response = self.createLog(appId,toolName,status)
                return response
        except Exception as e:
            print(e)
            return None
        
    def getByStatus(self, status, toolName):
            query = f"""
            query ($query: JSON,) {{
                logBySearch(query:$query, limit:1000,skip:0){{
                count
                data{{
                    id
                    type
                    data
                    tsCreate
                    tsUpdate
                }}
                }}
            }}
            """
            variables = {
            "query" : {
                "data.srcTool": toolName,
                "data.srcStatus": status
                }
            }
            graphql = GraphQL()
            response = graphql.graphql(query,variables)
            print(response.status_code)
            if response.status_code == 200:
                if response.json()['data']:
                    #print(response.json()['data']['logBySearch'])
                    return response.json()['data']['logBySearch']
            return None
