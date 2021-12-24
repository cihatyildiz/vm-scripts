import { decorate, observable,action} from "mobx";
import {graphql} from 'libs/graphql/'

class EagleEyeAppStore {
  constructor() {
    this.resetFields()
    this.status = null
  }

  resetFields() {
    this.name = null
    this.id = null
    this.gitUrl = null
    this.contrastAppId = null
    this.selectedItems = null
    this.displayName = null
    this.userGroups = null
  }

  async fetchApps() {
    const myGroups = JSON.parse(localStorage.getItem('userGroups'))
    let pageItemCount = this.getSearchPageItemCount()
    if (!pageItemCount) {
      this.setSearchPageItemCount(50);
      pageItemCount = this.getSearchPageItemCount();
    }
    let pageNum = this.getSearchPageNum()
    if (!pageNum) {
      this.setSearchPageNum(0)
      pageNum = this.getSearchPageNum()
    }
    let searchQuery = this.getSearchQuery()
    if (!searchQuery) {
      searchQuery = {}
    }
    searchQuery['userGroupIds'] = {}
    searchQuery['userGroupIds']['$in'] = myGroups
    let query = `
      query eeAppBySearch ($query: JSON, $limit: Int, $skip: Int) {
        eeAppBySearch (query: $query, limit: $limit, skip: $skip) {
          count
          data {
            id
            name
            displayName
            userGroupIds
            config {
              contrastAppId
              fortify {
                gitUrl
                projectName
                projectId
              }
            }
            userGroups {
              id
              name
              desc
            }
          }
        }
      }
    `
    let variables = {
      query: searchQuery,
      limit: pageItemCount,
      skip: pageNum * pageItemCount,
    }
    let response = await graphql(query, variables)
    if (response.status === 200) {
      response = response.data.data.eeAppBySearch
      const data = response.data
      this.setSearchResultsItemCount(response.count)
      return this.setApps(data)
    }
  }

  async createApp() {
    try {
      this.setShowOpCardLoader(true);
      const name = this.getName();
      const displayName=this.getDisplayName()
      const contrastAppId = this.getContrastAppId();
      const gitUrl = this.getGitUrl();
      const userGroupIds = this.getUserGroupIds()
      if ((!name) || (!displayName)) {
        return
      }
      let query = `
        mutation eeAppCreate($eeApp: eeAppInputType) {
          eeAppCreate(eeApp: $eeApp) {
            id
            name
            displayName
            userGroupIds
            config {
              contrastAppId
              fortify {
                gitUrl
              }
           }
          }
        }
      `
      let variables = {
        eeApp: {
          name: name,
          displayName:displayName,
          config: {
            fortify: {
              gitUrl: gitUrl,
            },
            contrastAppId: contrastAppId,
          },
          userGroupIds: userGroupIds
        }
      }
      let response = await graphql(query, variables)
      if (response.status === 200 && response.data.data.eeAppCreate) {
        const data = response.data.data.eeAppCreate
        let newStatus = {
          key: Math.random(),
          message: 'success',
        }
        this.setStatus(newStatus)
      } else {
        let newStatus = {
          key: Math.random(),
          message: 'unable to create application Please check the fields',
        }
        this.setStatus(newStatus)
      }
    } catch (err) {
      console.log(err)
    }
    this.setShowOpCardLoader(false)
  }

  async updateApp() {
    try {
      this.setShowOpCardLoader(true);
      const id = this.getId();
      const name = this.getName();
      const displayName = this.getDisplayName();
      const contrastAppId = this.getContrastAppId();
      const gitUrl = this.getGitUrl();
      const userGroupIds = this.getUserGroupIds();
      const projectId = this.getProjectId();
      const projectName = this.getProjectName();
      if (!displayName) {
        return;
      }
      let query = `
        mutation eeAppUpdate($eeApp: eeAppUpdateInputType) {
          eeAppUpdate(eeApp: $eeApp) {
            id
            name
          }
        }
      `
      let variables = {
        eeApp: {
          id: id,
          name: name,
          displayName:displayName,
          config: {
            contrastAppId: contrastAppId,
            fortify: {
              gitUrl: gitUrl,
              projectId: projectId,
              projectName:projectName
            },
          },
          userGroupIds: userGroupIds
        }
      }
      let response = await graphql(query, variables)
      if (response.status === 200 && response.data.data.eeAppUpdate) {
        const data = response.data.data.eeAppUpdate
        let newStatus = {
          key: Math.random(),
          message: 'success'
        }
        this.setStatus(newStatus)
      }
    } catch (err) {
      console.log(err)
    }
    this.setShowOpCardLoader(false)
  }

  getApps() {
    return this.apps
  }

  setApps(apps) {
    this.apps = apps
    return this.apps
  }

  getId() {
    return this.id
  }

  setId(id) {
    this.id = id
    return this.id
  }

  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
    return this.name
  }


  getDisplayName () {
    return this.displayName
  }


  setDisplayName (displayName) {
    this.displayName = displayName
    return this.displayName
  }


  getContrastAppId() {
    return this.contrastAppId
  }


  setContrastAppId(contrastAppId) {
    this.contrastAppId = contrastAppId
    return this.contrastAppId
  }

  getGitUrl() {
    return this.gitUrl
  }

  setGitUrl(gitUrl) {
    this.gitUrl = gitUrl
    return this.gitUrl
  }

  getUserGroupIds() {
    return this.userGroupIds
  }

  setUserGroupIds(userGroupIds) {
    this.userGroupIds = userGroupIds
    return this.userGroupIds
  }


  getUserGroups() {
    return this.userGroups
  }

  setUserGroups(userGroups) {
    this.userGroups = userGroups
    return this.userGroups
  }

  getProjectName () {
    return this.projectName
  }

  setProjectName (projectName) {
    this.projectName = projectName
    return this.projectName
  }


  getProjectId () {
    return this.projectId
  }

  setProjectId (projectId) {
    this.projectId = projectId
    return this.projectName
  }

  getShowAddUserGroupsPopUpCard() {
    return this.showAddUserGroupsPopUpCard
  }

  setShowAddUserGroupsPopUpCard(showAddUserGroupsPopUpCard) {
    this.showAddUserGroupsPopUpCard = showAddUserGroupsPopUpCard
    return this.showAddUserGroupsPopUpCard
  }

  getSearchText() {
    return this.searchText
  }

  setSearchText(text) {
    if (text === '') {
      text = null
      this.searchText = text
      this.setSearchQuery({})
      return this.searchText
    }
    this.searchText = text
    let searchQuery = {}
    searchQuery['$text'] = {}
    searchQuery['$text']['$search'] = text
    this.setSearchQuery(searchQuery)
    return this.text
  }

  getSearchQuery() {
    return this.searchQuery
  }

  setSearchQuery(searchQuery) {
    this.searchQuery = searchQuery
    return this.searchQuery
  }

  getSearchPageNum() {
    return this.searchPageNum
  }

  setSearchPageNum(searchPageNum) {
    this.searchPageNum = searchPageNum
    return this.searchPageNum
  }

  getSearchPageItemCount() {
    return this.searchPageItemCount
  }

  setSearchPageItemCount(searchPageItemCount) {
    this.searchPageItemCount = searchPageItemCount
    return this.searchPageItemCount
  }

  getSearchResultsItemCount() {
    return this.searchResultsItemCount
  }

  setSearchResultsItemCount(searchResultsItemCount) {
    this.searchResultsItemCount = searchResultsItemCount
    return this.searchResultsItemCount
  }

  getSelectedUserGroupIds() {
    return this.selectedUserGroupIds
  }

  setSelectedUserIds(selectedUserGroupIds) {
    this.selectedUserGroupIds = selectedUserGroupIds
    return this.selectedUserGroupIds
  }

  getSelectedItems() {
    return this.selectedItems
  }

  setSelectedItems(selectedItems) {
    this.selectedItems = selectedItems
    return this.selectedItems
  }

  getSelectedItem() {
    return this.selectedItem
  }

  setSelectedItem(selectedItem) {
    this.selectedItem = selectedItem
    return this.selectedItem
  }

  getSelectedAppId() {
    return this.appId
  }

  setSelctedAppId(appId) {
    this.selectedAppId = appId
    return this.selectedAppId
  }

  getViewMode() {
    return this.viewMode
  }

  setViewMode(viewMode) {
    this.viewMode = viewMode
    return this.viewMode
  }

  getShowSearchCardLoader() {
    return this.showSearchCardLoader
  }

  setShowSearchCardLoader(showSearchCardLoader) {
    this.showSearchCardLoader = showSearchCardLoader
    return this.showSearchCardLoader
  }

  getShowOpCardLoader() {
    return this.showOpCardLoader
  }

  setShowOpCardLoader(showOpCardLoader) {
    this.showOpCardLoader = showOpCardLoader
    return this.showOpCardLoader
  }

  async onClickPageOp(op) {
    let pageNum = this.getSearchPageNum()
    if (op === 'PREV') {
      pageNum = pageNum - 1
      this.setSearchPageNum(pageNum)
    } else if (op === 'NEXT') {
      pageNum = pageNum + 1
      let x = this.getSearchPageItemCount()
      let y = pageNum * x
      let z = this.getSearchResultsItemCount()
      if (!(y > z)) {
        await this.setSearchPageNum(pageNum)
      } else {
        console.log('over')
      }
    }
    await this.fetchApps()
  }


  async fetchActivityLogs() {
    this.setShowSearchCardLoader(true)
    const appId = this.getId()
    let searchQuery = {
      type: {
        $regex: '^ee-scan'
      },
      'data.appId': appId
    }
    let query = `query logbySearch($query:JSON){
      logBySearch(query:$query, limit:20 , skip:0){
        count
        data{
          id
          type
          data
          tsUpdate
          tsCreate
        }
      }
    }`
    let variables = {
      query: searchQuery
    }
    let response = await graphql(query, variables)
    if (response.status === 200) {
      response = response.data.data.logBySearch
      const data = response.data
      this.setSearchResultsItemCount(response.count)
      this.setShowSearchCardLoader(false)
      return this.setActivityLogs(data)
    }
  }


  setActivityLogs(activityLogs) {
    this.activityLogs = activityLogs
    return this.activityLogs
  }


  getActivityLogs() {
    return this.activityLogs
  }


  getStatus() {
    return this.status
  }


  setStatus(status) {
    this.status = status
  }
}


decorate(EagleEyeAppStore, {
  activityLogs: observable,
  apps: observable,
  displayName:observable,
  id: observable,
  init: action,
  name: observable,
  contrastAppId: observable,
  gitUrl: observable,
  projectId: observable,
  projectName:observable,
  userGroupIds: observable,
  userGroups: observable,
  showAddUserGroupsPopUpCard: observable,
  searchText: observable,
  searchQuery: observable,
  searchPageNum: observable,
  searchPageItemCount: observable,
  searchResultsItemCount: observable,
  selectedAppId: observable,
  selectedUserIds: observable,
  selectedItems: observable,
  selectedItem: observable,
  status:observable,
  viewMode: observable,
  showSearchCardLoader: observable,
  showOpCardLoader: observable,
})

export default new EagleEyeAppStore()
