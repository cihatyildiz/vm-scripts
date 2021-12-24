from crontab import CronTab
from crontab import CronSlices
cron = CronTab(user='root')
import requests
import os


def graphql(query, variables = {}, headers = None):
   graphql_url = os.environ['GraphQL_URL']
   headers = {
     'accesstoken':  'a769ab58405942d1b57365a1f0f48ea4',
   }
   response = requests.post(
       url = graphql_url,
       json = {'query': query, 'variables': variables},
       headers = headers,
       verify=False
   )
   return response


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
  response = graphql(query)
  if response.status_code == 200:
    if response.json()['data']:
      return response.json()['data']['cronJobBySearch']['data']
  return None


if __name__ == '__main__':
  cronjob = getCronjobs()
  for i in range(len(cronjob)):
    flag=True
    for j in range(len(cron)):
      if (cron[j].comment == str(cronjob[i]['tsCreate'])):
        flag=False
        break
    if (flag == True):
      bool = CronSlices.is_valid(cronjob[i]['schedule'])
      if bool:
        comment=str(cronjob[i]['tsCreate'])
        x=cronjob[i]['command'] + ' > /dev/null 2>&1'
        job = cron.new(command=x, comment=comment)
        job.setall(cronjob[i]['schedule'])
        cron.write()
  for job in cron:
    print(job.command)
