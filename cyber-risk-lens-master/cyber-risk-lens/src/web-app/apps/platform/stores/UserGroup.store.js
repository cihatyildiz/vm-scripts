import { decorate, observable, action, toJS } from "mobx";
import {graphql} from 'libs/graphql/'

class UserGroupStore {
  constructor() {
    let id = null
    let name = null
    let desc = null
    let userIds = null
    let users = null
    let userGroups = null
    let searchText = null
    let searchQuery = null
    let searchPageNum = null
    let searchPageItemCount = null
    let searchResultsItemCount = null
    let selectedUserIds = null
    let selectedItems = null
    let selectedItem = null
    let viewMode = null
    let showSearchCardLoader = null
    let showOpCardLoader = null
    let showAddUsersPopUpCard = null
    this.status = null
  }

  async fetchUserGroups() {
    let pageItemCount = this.getSearchPageItemCount()
    if (!pageItemCount) {
      this.setSearchPageItemCount(10)
      pageItemCount = this.getSearchPageItemCount()
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
    let query = `
      query userGroupBySearch ($query: JSON, $limit: Int, $skip: Int) {
        userGroupBySearch (query: $query, limit: $limit, skip: $skip) {
          count
          data {
            id
            name
            desc
            userIds
            users {
              id
              name
              username
            }
          }
        }
      }
    `
    let variables = {
      query: searchQuery,
      limit: pageItemCount,
      skip: pageNum * pageItemCount
    }
    let graphql_response = await graphql(query, variables)
    if (graphql_response.status === 200) {
      const response = graphql_response.data.data.userGroupBySearch
      const data = response.data
      this.setSearchResultsItemCount(response.count)
      return this.setUserGroups(data)
    }
  }

  async createItem() {
    try {
      this.setShowOpCardLoader(true)
      const name = this.getName()
      const desc = this.getDesc()
      const userIds = this.getUserIds()
      if (!name) {
        return
      }
      let query = `
        mutation userGroupCreate($userGroup: userGroupInputType) {
          userGroupCreate(userGroup: $userGroup) {
            id
            name
            desc
          }
        }
      `
      let variables = {
        userGroup: {
          name: name,
          desc: desc,
          userIds:userIds
        },
      }
      let response = await graphql(query, variables)
      if (response.status === 200 && response.data.data.userGroupCreate) {
        const data = response.data.data.userGroupCreate
        let newStatus = {
          key: Math.random(),
          message: 'success',
        }
        this.setStatus(newStatus)
      }
    } catch (err) {
      console.log(err)
    }
    this.setShowOpCardLoader(false)
  }

  async updateItem() {
    try {
      this.setShowOpCardLoader(true)
      const id = this.getId()
      const name = this.getName()
      const desc = this.getDesc()
      const userIds = this.getUserIds()
      if (!name) {
        return
      }
      let query = `
        mutation userGroupUpdate($userGroup: userGroupUpdateInputType) {
          userGroupUpdate(userGroup: $userGroup) {
            id
            name
            desc
          }
        }
      `
      let variables = {
        userGroup: {
          id: id,
          name: name,
          desc: desc,
          userIds: userIds,
        },
      }
      let response = await graphql(query, variables)
      if (response.status === 200 && response.data.data.userGroupUpdate) {
        const data = response.data.data.userGroupUpdate
        let newStatus = {
          key: Math.random(),
          message: 'success',
        }
        this.setStatus(newStatus)
      }
    } catch (err) {
      console.log(err)
    }
    this.setShowOpCardLoader(false)
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


  getDesc() {
    return this.desc
  }


  setDesc(desc) {
    this.desc = desc
    return this.desc
  }


  getUserIds() {
    return this.userIds
  }


  setUserIds(userIds) {
    this.userIds = userIds
    return this.userIds
  }


  getUsers() {
    return this.users
  }


  setUsers(users) {
    this.users = users
    return this.users
  }


  getUserGroups() {
    return this.userGroups
  }


  setUserGroups(userGroups) {
    this.userGroups = userGroups
    return this.userGroups
  }


  getSelectedUserGroupId() {
    return this.selectedUserGroupId
  }


  setSelectedUserGroupId(selectedUserGroupId) {
    this.selectedUserGroupId = selectedUserGroupId
    return this.selectedUserGroupId
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
    let searchQuery = {$text: {$search: text}}
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


  getSelectedUserIds() {
    return this.selectedUserIds
  }


  setSelectedUserIds(selectedUserIds) {
    this.selectedUserIds = selectedUserIds
    return this.selectedUserIds
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


  getShowAddUsersPopUpCard() {
    return this.showAddUsersPopUpCard
  }


  setShowAddUsersPopUpCard(showAddUsersPopUpCard) {
    this.showAddUsersPopUpCard = showAddUsersPopUpCard
    return this.showAddUsersPopUpCard
  }


  getStatus() {
    return this.status
  }


  setStatus(status) {
    this.status = status
  }


  async onClickPageOp(op) {
    let pageNum = this.getSearchPageNum()
    if (op === 'PREV') {
      pageNum = pageNum - 1
      this.setSearchPageNum(pageNum)
    } else if (op == 'NEXT') {
      pageNum = pageNum + 1
      console.log(pageNum)
      let x = this.getSearchPageItemCount()
      let y = pageNum * x
      console.log(y)
      let z = this.getSearchResultsItemCount()
      if (!(y > z)) {
        await this.setSearchPageNum(pageNum)
      } else {
        console.log('over')
      }
    }
    await this.fetchUserGroups()
  }
}


decorate( UserGroupStore, {
  name: observable,
  desc: observable,
  userIds: observable,
  users: observable,
  userGroups: observable,
  searchText: observable,
  searchQuery: observable,
  searchPageNum: observable,
  searchPageItemCount: observable,
  searchResultsItemCount: observable,
  selectedUserIds: observable,
  selectedItems: observable,
  selectedItem: observable,
  viewMode: observable,
  showSearchCardLoader: observable,
  showOpCardLoader: observable,
  showAddUsersPopUpCard: observable,
  status:observable
})

export default new UserGroupStore()
