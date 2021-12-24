import {decorate, observable, action, toJS} from 'mobx'
import {graphql} from './../../../../libs/graphql'
import eagleEyeAppStore from 'web-app/apps/eagle-eye/stores/EagleEyeApp.store'
import toDate from 'libs/date/date.lib'
class EagleEyeLogStore {
  constructor () {
    this.eagleEyeAppStore = eagleEyeAppStore
    this.pageNum = 0;
    this.rowsPerPage = 10;
  }


  async fetchLogs() {
    let apps = await this.eagleEyeAppStore.fetchApps()
    let appIds = []
    apps.map((app) => {
      appIds.push(app.id)
    })
    let query = `
      query logBySearch($query: JSON, $limit: Int, $skip: Int) {
        logBySearch (query: $query, limit: $limit, skip: $skip) {
          count
          data {
            id
           type
           data
           tsCreate
           tsUpdate
        }
      }
    }
    `
    let searchQuery = this.getSearchQuery()
    if (searchQuery === {}) {
      searchQuery['srcTool'] = {}
      searchQuery['srcTool']['$in'] = ['contrast', 'fortify']
      searchQuery['appId'] = {}
      searchQuery['appId']['$in'] = appIds
    }
    console.log(toJS(searchQuery))
    let variables = {
      query: searchQuery,
      limit: this.rowsPerPage,
      skip: this.pageNum ? (this.pageNum) * 10   : 0,
    }
    let graphql_response = await graphql(query, variables)
    if (graphql_response.status === 200) {
      return graphql_response.data.data.logBySearch
    }
  }


  async onDeleteFilter (filterIndex) {
    let deletedFilter = toJS(this.selectedFilters[filterIndex])
    this.selectedFilters.splice(filterIndex, 1)
    try {
      switch (deletedFilter.key) {
        case 'apps':
          deletedFilter.key = 'data.appId'
          deletedFilter.value = this.filter.apps[deletedFilter.value]
          break
        case 'status':
          deletedFilter.key = 'data.status'
          break
        case 'srcTools':
          deletedFilter.key = 'data.srcTool'
          break
        case 'types':
          deletedFilter.key = 'type'
          break
        default:
          console.log('default')
      }
      let searchQuery = this.searchQuery
      let deletedFilterIndex = searchQuery[deletedFilter.key]['$in'].indexOf(
        deletedFilter.value
      )
      searchQuery[deletedFilter.key]['$in'].splice([deletedFilterIndex], 1)
      if (searchQuery[deletedFilter.key]['$in'].length === 0) {
        delete searchQuery[deletedFilter.key]
      }
      this.searchQuery = searchQuery
      await this.setLogs()
    } catch (e) {
      console.log(e)
    }
  }



  async setSearchQuery(searchQuery) {
    this.searchQuery = searchQuery
  }


  getSearchQuery() {
    let searchQuery = this.searchQuery
    if (!searchQuery) {
      searchQuery = {}
    }
    return searchQuery
  }


  setNewFilterKey (key) {
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


  async setLogs() {
    let logs = await this.fetchLogs()
    const data = logs.data.map((log) => {
      if (log.data.scanStartTime) {
      log.data.scanStartTime = toDate(log.data.scanStartTime*1000)
      }
      if (log.data.scanFinishTime) {
        log.data.scanFinishTime=toDate(log.data.scanFinishTime*1000)
      }
      return log;
    })
    this.logs = data
    this.countLogs = logs.count
  }


  getLogs() {
    return this.logs
  }


  async setFilterValues() {
    if (!this.apps) {
      await this.getApps()
    }
    let filter = {
      apps: {},
      status: {
        completed: 'COMPLETED',
        inProgress: 'IN_PROGRESS',
        failed: 'FAILED',
        unupdated: 'NO_UPDATES',
      },
      srcTools: {contrast: 'contrast', fortify: 'fortify'},
      types: {
        fortifyscan: 'ee-scan-fortify',
        contrastScan: 'ee-scan-contrast',
        userSignIn: 'user-sign-in',
        appDecision: 'ee-app-decision'
      }
    }
    this.apps.map((app) => {
      filter.apps[app.name] = app.id
    })
    this.filter = filter
  }


  async addSearchFilter() {
    if (!this.newFilter || !this.newFilter.key || !this.newFilter.value) {
      this.errorSnackbarStatus = true
      this.errorSnackbarMessage =
        'Invalid search filter key or value, try again !'
      return
    }
    let searchQuery = this.getSearchQuery()
    switch (this.newFilter.key) {
      case 'status':
        if ('data.status' in searchQuery) {
          searchQuery['data.status']['$in'].push(this.newFilter.value)
        } else {
          searchQuery['data.status'] = {}
          searchQuery['data.status']['$in'] = [this.newFilter.value]
        }
        break
      case 'apps':
        if ('data.appId' in searchQuery) {
          searchQuery['data.appId']['$in'].push(
            this.filter.apps[this.newFilter.value]
          )
        } else {
          searchQuery['data.appId'] = {}
          searchQuery['data.appId']['$in'] = [
            this.filter.apps[this.newFilter.value],
          ]
        }
        break
      case 'srcTools':
        if ('data.srcTool' in searchQuery) {
          searchQuery['data.srcTool']['$in'].push(this.newFilter.value)
        } else {
          searchQuery['data.srcTool'] = {}
          searchQuery['data.srcTool']['$in'] = [this.newFilter.value]
        }
        break
      case 'types':
        if ('type' in searchQuery) {
          searchQuery['type']['$in'].push(this.newFilter.value)
        } else {
          searchQuery['type'] = {}
          searchQuery['type']['$in'] = [this.newFilter.value]
        }
        break
      default:
        console.log('default')
    }
    this.setSearchQuery(searchQuery)
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
        value: this.newFilter.value,
      })
    }
    await this.setLogs()
  }


  async getApps() {
    let apps = this.apps
    if (!this.apps) {
      apps = await this.eagleEyeAppStore.fetchApps()
        this.apps = apps
    }
    return this.apps
  }


  setApps(apps) {
    this.apps = apps
    return this.apps
  }
}


decorate(EagleEyeLogStore, {
  user: observable,
  searchQuery: observable,
  logs: observable,
  countLogs: observable,
  pageNum: observable,
  rowsPerPage:observable,
  filter: observable,
  newFilter: observable,
  selectedFilters: observable,
  errorSnackbarStatus: observable,
  errorSnackbarMessage: observable,
  getUser: action,
  addSearchFilter: action,
  setFilterValues: action,
  apps: observable,
})

export default new EagleEyeLogStore()
