import {decorate, observable, action, toJS} from "mobx";
import {graphql} from "./../../../../libs/graphql";
const htmlToText = require('html-to-text')
class EagleEyeStore {
  constructor() {
    let user = null
    let vulns = null
    let filter = null
    let newFilter = null
    let selectedFilters = null
    let errorSnackbarStatus = null
    let errorSnackbarMessage = null
    let pageNum = null
    let countVulns = null
    let apps = null
    this.counts = null
  }


  async fetchApps() {
    let apps = null
    const myGroups = JSON.parse(localStorage.getItem('userGroups'))
    let searchQuery = {userGroupIds: {}}
    searchQuery['userGroupIds']['$in'] = myGroups
    try {
      const query = `
        query eeAppBySearch($query:JSON){
          eeAppBySearch(query:$query,limit:100,skip:0){
            count
            data{
              id
              name
              displayName
            }
          }
        }
      `
      let variables = {
        query: searchQuery
      }
      let response = await graphql(query, variables)
      if (response.status === 200 && response.data.data.eeAppBySearch) {
        apps = response.data.data.eeAppBySearch.data
        return await this.setApps(apps)
      }
    } catch (err) {
      console.log(err)
    }
  }


  async fetchVulns() {
    let apps = await this.getApps()
    let appIds = []
    if (apps) {
      apps.map((app) => {
        appIds.push(app.id)
      })
    }
    try {
      let searchQuery = toJS(this.getSearchQuery())
      if (!searchQuery) {
        searchQuery={}
      } if (!searchQuery['srcTool']) {
        searchQuery['srcTool'] = {}
        searchQuery['srcTool']['$in'] = ['contrast', 'fortify']
      }
      if (!searchQuery['appId']) {
         searchQuery['appId'] = {}
         searchQuery['appId']['$in'] = appIds
      }
      let query = `
      query ($query: JSON, $limit: Int, $skip: Int, $field:String, $query2:JSON) {
        eeVulnBySearch (query: $query, limit: $limit, skip: $skip) {
          count
          data {
            id
            title
            appId
            app {
              id
              name
              displayName
            }
            jiraTicketKey
            srcTool
            assetId
            status
            severity
            details {
              info
              recommendations
              references
            }
            tsUpdate
          }
        }
      eeVulnCountBySearch(query:$query2,field:$field){
        low
        medium
        high
        critical
        info
        }}
        `
      const variables = {
        query: searchQuery,
        query2: searchQuery,
        limit: 30,
        skip: this.pageNum ? (this.pageNum - 1) * 30 : 0,
        field: 'severity'
      }
      const graphql_response = await graphql(query, variables)
      if (graphql_response.status === 200) {
        this.setCounts(graphql_response.data.data.eeVulnCountBySearch)
        return graphql_response.data.data.eeVulnBySearch
      }
    } catch (e) {
      console.log(e)
    }
  }


  setCounts(count) {
    this.counts = count
  }


  getCounts() {
    return this.counts
  }


  toUpperCase(string) {
    return string[0].toUpperCase() + string.slice(1)
  }


  async createJiraTicket(vuln) {
    try {
      this.setShowCreateTicketLoader(true)
      const title = vuln.title
      const srcTool = this.toUpperCase(vuln.srcTool)
      const name = vuln.app.displayName
      const appDisplayName =
        '<p>Application name:' + vuln.app.displayName + '</p><Br/>'
      const ticketPriority = this.toUpperCase(vuln.severity)
      const vulnId = '<p>vuln id:' + vuln.id + '</p> <Br/>'
      const vulnDetailInfo = '<p>vuln detail:</p>' + vuln.details.info
      const recommendations =
        '<p>Recommendations:</p>' +
        (vuln.details.recommendations ? vuln.details.recommendations : 'None')
      const references =
        '<p>References:</p>' +
        (vuln.details.references ? vuln.details.references : 'None')
      const description =
        appDisplayName +
        vulnId +
        '<p>vuln Title:' +
        title +
        '</p><Br/>' +
        vulnDetailInfo +
        '<Br/><Br/>' +
        recommendations +
        '<Br/>' +
        references
      const ticketDescription = htmlToText.fromString(description)
      const ticketSummary = srcTool + '_' + title + '_' + name
      let query = `mutation eeJiraTicketCreate($query:eeJiraTicketInputType) {
	    eeJiraTicketCreate(eeJiraTicket:$query){
          id
          key
        }
      } `
      let variables = {
        query: {
          projectKey: 'ASV',
          issueType: 'Bug',
          summary: ticketSummary,
          priority: ticketPriority,
          description: ticketDescription
        }
      }
      let graphql_response = await graphql(query, variables)
      if (
        graphql_response.status === 200 &&
        graphql_response.data.data.eeJiraTicketCreate
      ) {
        let ticket = graphql_response.data.data.eeJiraTicketCreate
        let updatedVuln = vuln
        updatedVuln.jiraTicketKey = ticket.key
        return await this.updateVulnerability(updatedVuln)
      }
    } catch (e) {
      console.log(e)
      this.setShowCreateTicketLoader(false)
    }
  }


  async updateVulnerability(vuln) {
    let input = {
      id: vuln.id,
      title: vuln.title,
      severity: vuln.severity,
      status: vuln.status,
      appId: vuln.appId,
      details: vuln.details,
      jiraTicketKey: vuln.jiraTicketKey,
      srcTool: vuln.srcTool,
      srcToolId: vuln.srcToolId,
      tsCreate: vuln.tsCreate,
      tsUpdate: vuln.tsUpdate
    }
    try {
      let query = `mutation ($query: eeVulnUpdateInputType) {
        eeVulnUpdate (eeVuln: $query) {
          id
          title
          jiraTicketKey
          severity
          app{
            id
            name
            displayName
            }
          }
        }`
      let variables = {
        query: input
      }
      let graphql_response = await graphql(query, variables)
      if (graphql_response.status === 200) {
        let updatedVuln = graphql_response.data.data.eeVulnUpdate
        this.setShowCreateTicketLoader(false)
        return updatedVuln.jiraTicketKey
      }
    } catch (e) {
      console.log(e)
      this.setShowCreateTicketLoader(false)
    }
  }


  async onDeleteFilter(filterIndex) {
    let deletedFilter = toJS(this.selectedFilters[filterIndex])
    if (deletedFilter.key === 'app') {
      deletedFilter.key = 'appId'
      deletedFilter.value = this.filter.apps[deletedFilter.value]
    }
    let searchQuery = toJS(this.getSearchQuery())
    let deletedFilterIndex = searchQuery[deletedFilter.key]['$in'].indexOf(
      deletedFilter.value
    )
    searchQuery[deletedFilter.key]['$in'].splice([deletedFilterIndex], 1)
    if (searchQuery[deletedFilter.key]['$in'].length === 0) {
      delete searchQuery[deletedFilter.key]
    }
    this.selectedFilters.splice(filterIndex, 1)
    await this.setSearchQuery(searchQuery)
    await this.setVulns()
  }


  setSearchQuery (q) {
    this.searchQuery = q
  }


  getSearchQuery() {
    return this.searchQuery
  }


  setNewFilterKey(key) {
    let newFilter = this.newFilter
    if (!newFilter) {
      newFilter = {}
    }
    newFilter.key = key
    this.newFilter = newFilter
  }


  getNewFilterKey() {
    return this.newFilter.key
  }


  setNewFilterValue(value) {
    let newFilter = this.newFilter
    if (!newFilter) {
      newFilter = {}
    }
    newFilter.value = value
    this.newFilter = newFilter
  }


  getNewFilterValue() {
    return this.newFilter.value
  }


  async setVulns() {
    let vulns = await this.fetchVulns()
    if (vulns) {
      this.vulns = vulns.data
      this.countVulns = vulns.count
    }
  }


  getVulns() {
    return this.vulns
  }


  setFilterValues() {
    let filter = {
      apps: {},
      severities: {
        critical: 'Critical',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        info: 'Info'
      },
      srcTools: {contrast: 'contrast', fortify: 'fortify', xray: 'xray'}
    }
    if (this.apps) {
      this.apps.map((app) => {
        filter.apps[app.displayName] = app.id
      })
    }
    this.filter = filter
  }


  async addSearchFilter() {
    if (
      (!this.newFilter)||(!this.newFilter.key)|| (!this.newFilter.value) ) {
      this.errorSnackbarStatus = true
      this.errorSnackbarMessage =
        'Invalid search filter key or value, try again !'
      return
    }
    let searchQuery = toJS(this.getSearchQuery())
    if (!searchQuery) {
      searchQuery = {}
    }
    switch (this.newFilter.key) {
      case 'severity':
        if ('severity' in searchQuery) {
          if (
            searchQuery['severity']['$in'].indexOf(this.newFilter.value) === -1
          ) {
            searchQuery['severity']['$in'].push(this.newFilter.value)
          }
        } else {
          searchQuery['severity'] = {}
          searchQuery['severity']['$in'] = [this.newFilter.value]
        }
        break
      case 'app':
        if ('appId' in searchQuery) {
          if (
            searchQuery['appId']['$in'].indexOf(this.filter.apps[this.newFilter.value]) === -1
          ) {
            searchQuery['appId']['$in'].push(
              this.filter.apps[this.newFilter.value]
            )
          }
        } else {
          searchQuery['appId'] = {}
          searchQuery['appId']['$in'] = [this.filter.apps[this.newFilter.value]]
        }
        break
      case 'srcTool':
        if ('srcTool' in searchQuery) {
          if (
            searchQuery['srcTool']['$in'].indexOf(this.newFilter.value) === -1
          ) {
            searchQuery['srcTool']['$in'].push(this.newFilter.value)
          }
        } else {
          searchQuery['srcTool'] = {}
          searchQuery['srcTool']['$in'] = [this.newFilter.value]
        }
        break
      default:
        console.log('default')
    }
    if (!this.selectedFilters) {
      this.selectedFilters = []
    }
    if (
      !this.selectedFilters.some(
        (filter) =>
          filter.key === this.newFilter.key &&
          filter.value === this.newFilter.value
      )
    ) {
      this.selectedFilters.push({
        key: this.newFilter.key,
        value: this.newFilter.value
      })
    }
    this.newFilter = null
    await this.setSearchQuery(searchQuery)
    await this.setVulns()
  }


  async getApps() {
    if (!this.apps) {
      await this.fetchApps()
    }
    return this.apps
  }


  setApps(apps) {
    this.apps = apps
    return this.apps
  }


  getShowCreateTiketLoader() {
    return this.showCreateTicketLoader
  }


  setShowCreateTicketLoader(showCreateTicketLoader) {
    this.showCreateTicketLoader = showCreateTicketLoader
    return this.showCreateTicketLoader
  }
}


decorate(EagleEyeStore, {
  user: observable,
  searchQuery: observable,
  vulns: observable,
  countVulns: observable,
  pageNum: observable,
  filter: observable,
  newFilter: observable,
  selectedFilters: observable,
  errorSnackbarStatus: observable,
  errorSnackbarMessage: observable,
  getUser: action,
  apps: observable,
  createJiraTicket: action,
  updateVulnerability: action,
  showCreateTicketLoader: observable,
  counts: observable
});
export default new EagleEyeStore();
