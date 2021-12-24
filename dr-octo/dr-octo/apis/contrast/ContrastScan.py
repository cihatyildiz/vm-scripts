from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
import os, requests, random, json, time, posixpath, urllib.parse, math
from libs.eagle_eye.vulns import EagleEyeVulns
from libs.eagle_eye.apps import EagleEyeApps


contrast_scan = Blueprint('contrast_scan', __name__)


drOctopusApi = os.environ['DR_OCTOPUS_API']
contrastApi = 'https://app.contrastsecurity.com'
authorization = os.environ['CONTRAST_AUTHORIZATION_ID']
api_key = os.environ['CONTRAST_API_KEY']


def contrastRestCall(method, url):
  try:
    headers = {
      "authorization": authorization,
      "api-key": api_key,
      "accept": "application/json"
    }
    response = requests.request(method, url, headers=headers)
    return response
  except Exception as e:
    print ('Exception in contrastRestCall')
    print (e)
    return


def getVulns(appId):
  vulns = []
  try:
    url = urllib.parse.urljoin(contrastApi, posixpath.join('/Contrast/api/ng/6baceb38-de69-4696-b97f-7e60cf196c5b/traces/', appId,'filter'))
    headers = {
      "authorization": authorization,
      "api-key": api_key,
      "accept": "application/json"
    }
    url='{}?&modules={}&applicationID={}'.format(url,appId,appId)
    response = contrastRestCall('GET', url)
    response = response.json()
    vulns = vulns + response['traces']
    numPages = math.ceil((response['count']/20.0))
    print ('#total pages: {}'.format(numPages))
    for i in range(0, numPages-1):
      print ('subsequent page: ' + str(i+1))
      if (response['links'][i]['rel'] == 'nextPage'):
        try:
          url = '{}?limit=20&offset={}'.format(url, 20*(i+1))
          response = contrastRestCall('GET', url)
          response = response.json()
          vulns = vulns + response['traces']
        except Exception as e:
          print ('Exception - getMoreVulns()')
          print (e)
          pass
  except Exception as e:
    print ('Exception - getVulns()')
    print (e)
  print ('#vulns returning: {}'.format(len(vulns)))
  return vulns


def getVulnDetails(uuid,contrastAppId):
  try:
    url = urllib.parse.urljoin(contrastApi, posixpath.join('/Contrast/api/ng/6baceb38-de69-4696-b97f-7e60cf196c5b/traces/',contrastAppId,'trace', uuid))
    response = contrastRestCall('GET', url)
    vulnDetails = response.json()['trace']
    return vulnDetails
  except Exception as e:
    print ('Exception - getVulnDetails()')
    return


def getVulnLinks(links):
  try:
    vulnLinks = {}
    for item in links:
      vulnLinks[item['rel']] = {
        'link': item['href'],
        'method': item['method']
      }
    return vulnLinks
  except Exception as e:
    print ('Exception - getVulnLinks()')
    print (e)
    return


def formatVulnSeverity(severity):
  formattedSeverity = 'info'
  if severity == 'LOW':
    formattedSeverity = 'low'
  elif severity == 'MEDIUM':
    formattedSeverity = 'medium'
  elif severity == 'HIGH':
    formattedSeverity = 'high'
  elif severity == 'CRITICAL':
    formattedSeverity = 'critical'
  return formattedSeverity


def formatVulnRecommendations(vulnLink):
  try:
    response = contrastRestCall(vulnLink['method'], vulnLink['link'])
    response = response.json()
    recommendations = response['recommendation']['formattedText']
    recommendations = recommendations.replace('{{#paragraph}}', '<p>')
    recommendations = recommendations.replace('{{/paragraph}}', '</p>')
    recommendations = recommendations.replace('\n\n\n', '<br/>')
    recommendations = recommendations.replace('\n\n', '<br/>')
    recommendations = recommendations.replace('{{#listElement}}', '<li>')
    recommendations = recommendations.replace('{{/listElement}}', '</li>')
    recommendations = recommendations.replace('{{#unorderedList}}', '<ul>')
    recommendations = recommendations.replace('{{/unorderedList}}', '</ul>')
    recommendations = recommendations.replace('{{#code}}', '<EagleEyeInLineCode>')
    recommendations = recommendations.replace('{{/code}}', '</EagleEyeInLineCode>')
    recommendations = recommendations.replace('{{#javaBlock}}', "<EagleEyeCodeCard language = 'java'>")
    recommendations = recommendations.replace('{{/javaBlock}}', '</EagleEyeCodeCard>')
    recommendations = recommendations.replace('{{#xmlBlock}}', "<EagleEyeCodeCard language = 'xml'>")
    recommendations = recommendations.replace('{{/xmlBlock}}', '</EagleEyeCodeCard>')
    recommendations = recommendations.replace('{{#javascriptBlock}}', "<EagleEyeCodeCard language = 'javascript'>")
    recommendations = recommendations.replace('{{/javascriptBlock}}', '</EagleEyeCodeCard>')
    recommendations = recommendations.replace('{{#htmlBlock}}', "<EagleEyeCodeCard language = 'html'>")
    recommendations = recommendations.replace('{{/htmlBlock}}', '</EagleEyeCodeCard>')
    recommendations = recommendations.replace('{{', '').replace('}}', '')
    recommendations = recommendations.replace('{', '\{').replace('}', '\}')
    return recommendations
  except Exception as e:
    print ('Exception: formatVulnRecommendations')
    print (e)
    return 'None'


def formatVulnInfo(vulnLink):
  try:
    response = contrastRestCall(vulnLink['method'], vulnLink['link'])
    response = response.json()
    info = ''
    for chapter in response['story']['chapters']:
      textNormal = chapter['introText']
      textHighlighted = None
      if 'body' in chapter:
        textHighlighted = chapter['body']
        infoSection = """
          <p>{}</p>
          <br/>
          <EagleEyeCodeCard>{}</EagleEyeCodeCard>
          <br/>
        """.format(chapter['introText'], textHighlighted)
      elif 'properties' in chapter:
        listProperties = ''
        for item in chapter['properties']:
          listProperties = listProperties + '<p><EagleEyeInLineCode>{}</EagleEyeInLineCode></p>'.format(chapter['properties'][item]['name'])
        infoSection = """
          <p>{}</p>
          <p>{}</p>
        """.format(chapter['introText'], listProperties)
      else:
        textHighlighted = str(chapter)
      info = info + infoSection
    risk = """
      <h3>Risk</h3>
      <p>{}</p>
    """.format(response['story']['risk']['text'].replace(
      '{{#paragraph}}', '<p>'
    ).replace('{{/paragraph}}', '</p>'))
    info = info + risk
    info=info.replace('{{#link}}', '<EagleEyeLink>')
    info=info.replace('{{/link}}','</EagleEyeLink>')
    info=info.replace('\n','')
    info=info.replace('\n\n','')
    info=info.replace('\n\n\n','')
    info=info.replace('{{nl}}','')
    info = info.replace('{', '').replace('}', '')
    info=info.replace('\\\"','')
    return info
  except Exception as e:
    print ('Exception - formatVulnInfo()')
    print (str(e))
  return


def getFormattedVuln(vuln, appId,contrastAppId):
  vulnDetails = getVulnDetails(vuln['uuid'],contrastAppId)
  formattedVuln = {}
  try:
    vulnLinks = getVulnLinks(vulnDetails['links'])
    vulnLinks['story']['link']=vulnLinks['story']['link'].replace('{traceUuid}',vuln['uuid'])
    vulnLinks['recommendation']['link']=vulnLinks['recommendation']['link'].replace('{traceUuid}',vuln['uuid'])
    formattedVuln['appId'] = appId
    formattedVuln['title'] = vuln['title']
    formattedVuln['assetId']=""
    formattedVuln['srcTool'] = 'contrast'
    formattedVuln['srcToolId'] = vuln['uuid']
    formattedVuln['status'] = vuln['status']
    formattedVuln['severity'] = formatVulnSeverity(vulnDetails['default_severity'])
    formattedVuln['details'] = {}
    formattedVuln['details']['info'] = formatVulnInfo(vulnLinks['story'])
    formattedVuln['details']['recommendations'] = formatVulnRecommendations(vulnLinks['recommendation'])
    return formattedVuln
  except Exception as e:
    print ('Exception: getFormattedVuln')
    print (e)
  return


@contrast_scan.route('/contrast/scan/<appId>', methods = ['GET'])
def scan(appId):
  appsLib = EagleEyeApps()
  appConfig = appsLib.getAppConfig(appId)
  appName=appConfig['name']
  displayName=appConfig['displayName']
  appsLib.createLog(appId,'contrast','STARTED',appName,displayName)
  vulns = []
  formattedVulns = []
  try:
    contrastAppId = appConfig['config']['contrastAppId']
    appsLib.updateLogs(appId,'contrast','IN_PROGRESS',appName,displayName)
    vulns = getVulns(contrastAppId)
    for vuln in vulns:
      formattedVuln = getFormattedVuln(vuln, appId,contrastAppId)
      formattedVulns.append(formattedVuln)
      eagleEyeVulns = EagleEyeVulns()
      response = eagleEyeVulns.pushVulnV3(
        formattedVuln
      )
  except Exception as e:
    print ('Exception in scan()')
    print (e)
    vulns = []
    appsLib.updateLogs(appId,'contrast','FAILED',appName,displayName)
  appsLib.updateLogs(appId,'contrast','COMPLETED',appName,displayName)
  if len(vulns) == 0:
    return 'No vulns returned - either no vulns identified, so some exception occured'
  return {
    'formattedVulns': formattedVulns
  }
