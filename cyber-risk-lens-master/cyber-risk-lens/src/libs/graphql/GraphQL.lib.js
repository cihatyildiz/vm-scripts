import axios from 'axios';

async function graphql(query, variables = {}) {
  let headers = {
    'accesstoken':  'a769ab58405942d1b57365a1f0f48ea4',
  }
  let graphql_url = 'https://rc-lx3163:8081/graphql'
  return await axios.post(
    graphql_url,
    {
      query,
      variables,
    },
    {
      headers:headers
    }
  );
}

export default graphql;
