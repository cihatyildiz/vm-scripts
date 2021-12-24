import requests,os

class GraphQL:
  def graphql(self, query, variables = {}, headers = None):
    graphql_url = os.environ['GraphQL_URL']
    headers = {
      'accesstoken':  'a769ab58405942d1b57365a1f0f48ea4',
    }
    response = requests.post(
        url = graphql_url,
        json = {'query': query, 'variables': variables},
        headers = headers,
        verify = False
    )
    return response
