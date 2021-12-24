from flask import Flask, request, jsonify, Blueprint, abort
from flask_api import status
from libs.graphql.graphql import GraphQL
import os, requests, random, json, time, posixpath, urllib.parse
from time import gmtime, strftime, sleep
import datetime, time
from libs.eagle_eye.apps import EagleEyeApps
import subprocess
from crontab import CronTab
from crontab import CronSlices
cron = CronTab(user='root')
import requests
import os


setCronJobs = Blueprint('setCronJobs', __name__)

gitToken = os.environ['GIT_TOKEN']


def getCronjobs():
  query = f"""
    {{
      cronJobBySearch (limit :100, skip : 0) {{
        count
        data {{
          id
          name
          command
          schedule
          tsCreate
        }}
      }}
    }}
  """
  graphql = GraphQL().graphql
  response = graphql(query)
  if response.status_code == 200:
    if response.json()['data']:
      print(response.json()['data'])
      return response.json()['data']['cronJobBySearch']['data']
  return None



@setCronJobs.route('/cronjobs', methods = ['GET'])
def setJobs():
  try:
    cronjob = getCronjobs()
    print(cronjob)
    for i in range(len(cronjob)):
      print('i',i)
      flag=True
      print('len',len(cron))
      for j in range(len(cron)):
        print('j',j)
        if (cron[j].comment == str(cronjob[i]['tsCreate'])):
          flag=False
          break
      if (flag == True):
        bool = CronSlices.is_valid(cronjob[i]['schedule'])
        if bool:
          print('here')
          comment=str(cronjob[i]['tsCreate'])
          x=cronjob[i]['command'] + ' > /dev/null 2>&1'
          job = cron.new(command=x, comment=comment)
          job.setall(cronjob[i]['schedule'])
          cron.write()
    for job in cron:
      print(job.command)

  except Exception as e:
    print(e)
    return
  return "hello"
