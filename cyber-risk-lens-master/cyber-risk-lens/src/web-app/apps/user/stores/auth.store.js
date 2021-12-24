import {decorate, observable, action} from "mobx";
import {graphql} from "libs/graphql/"
import {toJS} from "mobx";
import Cookies from 'universal-cookie'
class AuthStore {
  constructor() {
    // cross-components
    let users = null;
    // within-component-only
    this.userGroups=null
    this.authenticated=false
  }

  async fetchUserGroups(id) {
    let searchQuery = {userIds: {$in: [id]}};
    let query = `
      query userGroupBySearch ($query: JSON, $limit: Int, $skip: Int) {
        userGroupBySearch (query: $query, limit: $limit, skip: $skip) {
          count
          data {
            id
            name
          }
        }
      }
    `;
    let variables = {
      query: searchQuery,
      limit: 20,
      skip: 0,
    };
    let graphql_response = await graphql(query, variables);
    if (graphql_response.status === 200) {
      const response = graphql_response.data.data.userGroupBySearch;
      const data = response.data;
      this.setUserGroups(data);
      return this.userGroups
    }
  }

  setUserGroups(userGroups) {
    this.userGroups = toJS(userGroups);
    let Groups = toJS(userGroups)
    let x=[]
    Groups.map((group) => {
      x.push(group.id)
    })
    localStorage.setItem('userGroups', JSON.stringify(x))
    return this.userGroups;
  }

  getUserGroups() {
    return this.userGroups;
  }

 async setIsAuthenticated (status) {
    this.authenticated = status;
    return this.authenticated;
  }

  isAuthenticated () {
    return this.authenticated
  }

 async signOut () {
  let cookies = new Cookies()
  cookies.remove('sessionID')
  await cookies.remove('username')
  localStorage.removeItem('userGroups')
  window.location.assign('/user')
  }

}
decorate(AuthStore, {
  userId: observable,
  password: observable,
  userGroups: observable,
  apps: observable,
  authenticated: observable,
  signOut:action
});

export default new AuthStore();
