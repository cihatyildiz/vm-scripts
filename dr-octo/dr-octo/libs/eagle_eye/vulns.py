import requests
import json
from libs.graphql.graphql import GraphQL


class EagleEyeVulns:
  def getVulnIdIfExists(self, vuln):
    try:
      graphql = GraphQL()
      query = """
        query ($query: JSON) {
          eeVulnBySearch (query: $query, limit: 1, skip: 0) {
            count
            data {
              id
              title
              srcToolId
              jiraTicketKey
            }
          }
        }
      """
      variables = {
        "query": {
          "srcToolId": vuln['srcToolId']
        }
      }
      response = graphql.graphql(query = query, variables = json.dumps(variables))
      if response.status_code == 200:
        responseJSON = response.json()
        if (len(responseJSON['data']['eeVulnBySearch']['data']) > 0):
          vulnFromEagleEye = responseJSON['data']['eeVulnBySearch']['data'][0]
          if vulnFromEagleEye['srcToolId'] == vuln['srcToolId']:
            return vulnFromEagleEye
    except Exception as e:
      print (e)
    # print ('no matching vuln found !')
    return None


  def updateVuln(self, variables):
    graphql_ob = GraphQL()
    query = """
      mutation ($eeVuln: eeVulnUpdateInputType) {
        eeVulnUpdate(eeVuln: $eeVuln) {
          id
        }
      }
    """
    response = graphql_ob.graphql(query = query, variables = json.dumps(variables))
    return response


  def createVuln(self, variables):
    graphql_ob = GraphQL()
    query = """
      mutation ($eeVuln: eeVulnInputType) {
        eeVulnCreate(eeVuln: $eeVuln) {
          id
        }
      }
    """
    response = graphql_ob.graphql(query = query, variables = json.dumps(variables))
    return response


  def pushVulnV3(self, vuln):
    try:
      variables = {}
      variables['eeVuln'] = {
        "title": vuln['title'],
        "severity": vuln['severity'],
        "status": vuln['status'],
        "appId": vuln['appId'],
        "assetId":vuln['assetId'],
        "details": vuln['details'],
        "srcTool": vuln['srcTool'],
        "srcToolId": vuln['srcToolId']
      }
      vulnFromEagleEye = self.getVulnIdIfExists(vuln)
      response = None
      if vulnFromEagleEye is not None and vulnFromEagleEye['id']:
        variables['eeVuln']['id'] = vulnFromEagleEye['id']
        if vulnFromEagleEye['jiraTicketKey']:
          print('ticket',vulnFromEagleEye['jiraTicketKey'])
          variables['eeVuln']['jiraTicketKey']=vulnFromEagleEye['jiraTicketKey']
        response = self.updateVuln(variables)
      else:
        response = self.createVuln(variables)
    except Exception as e:
      print (str(e))
      print ('Exception - pushVuln32()')
