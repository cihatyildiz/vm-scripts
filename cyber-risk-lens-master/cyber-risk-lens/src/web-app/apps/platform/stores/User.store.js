import { decorate, observable, action } from "mobx";
import {graphql} from 'libs/graphql/'

class UserStore {
  constructor() {
    // cross-components
    let users = null
    // within-component-only
    let name = null
    let searchText = null
    let searchQuery = null
    let searchPageNum = null
    let searchPageItemCount = null
    let searchResultsItemCount = null
    let showSearchCardLoader = null
    let selecteduserGroupId = null
    let userName = null
    let status = null
    let viewMode = null
    this.resetFields()
  }

  resetFields() {
    this.name = null
    this.userName=null
    this.selectedItems = null
  }

  async fetchUsers() {
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
      query userBySearch($query: JSON, $limit: Int, $skip: Int ){
        userBySearch( query: $query, limit: $limit, skip: $skip){
          count
          data{
            id
            name
            username
          }
        }
      }
    `
    let variables = {
      query: searchQuery,
      limit: pageItemCount,
      skip: pageNum * pageItemCount,
    }
    let graphql_response = await graphql(query, variables)
    if (graphql_response.status === 200) {
      const response = graphql_response.data.data.userBySearch
      const data = response.data
      this.setSearchResultsItemCount(response.count)
      return this.setUsers(data)
    }
  }

  async userCreate() {
    const name = this.getName()
    const userName = this.getUserName()
    if (!(name && userName)) {
      let newStatus = {
        key: Math.random(),
        message: 'Form fileds should not be empty',
      }
      this.setStatus(newStatus)
      return
    }
    let query = `
      mutation userCreate($query:userInputType) {
	      userCreate(user:$query){
          id
          name
          username
         }
      }
    `
    let variables = {
      query: {
        name: this.getName(),
        username: this.getUserName().toLowerCase(),
      },
    }
    let graphql_response = await graphql(query, variables)
    if (graphql_response.status === 200) {
      const data = graphql_response.data.data.userCreate
      let newStatus = {
        key: Math.random(),
        message: 'success',
      }
      this.setStatus(newStatus)
      return 'success'
    } else {
      let newStatus = {
        key: Math.random(),
        message: 'failed to create a User please try again',
      }
      this.setStatus(newStatus)
    }
  }

  async userUpdate() {
    const selectedUsers = this.getSelectedUsers()
    if (!selectedUsers) {
      return
    } else {
      const userName = this.getUserName()
      const name = this.getName()
      if (!(name && userName)) {
        let newStatus = {
          key: Math.random(),
          message: 'Form fileds should not be empty',
        }
        this.setStatus(newStatus)
        return
      }

      const id = Object.keys(selectedUsers)[0]
      let query = `
        mutation userUpdate($query:userUpdateInputType) {
	        userUpdate(user:$query){
            id
            name
            username
          }
        }
      `
      let variables = {
        query: {
          id: id,
          name: name,
          username: userName,
        },
      }

      let graphql_response = await graphql(query, variables)
      if (graphql_response.status === 200) {
        const data = graphql_response.data.data.userUpdate
         let newStatus = {
           key: Math.random(),
           message: 'Success',
         }
         this.setStatus(newStatus)
         return 'success'
      }
    }
  }

  getUsers() {
    return this.users
  }

  setUsers(users) {
    this.users = users
    return this.users
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

  setShowSearchCardLoader(showSearchCardLoader) {
    this.showSearchCardLoader = showSearchCardLoader
    return this.showSearchCardLoader
  }

  getShowSearchCardLoader() {
    return this.showSearchCardLoader
  }

  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
  }

  getUserName() {
    return this.userName
  }

  setUserName(userName) {
    this.userName = userName
  }

  getSelectedUsers() {
    return this.selectedUsers
  }

  setSelectedUsers(selectedUsers) {
    this.selectedUsers = selectedUsers
  }

  getStatus() {
    return this.status
  }

  setStatus(status) {
    this.status = status
  }

  getViewMode() {
    return this.viewMode
  }

  setViewMode(viewMode) {
    this.viewMode = viewMode
    return this.viewMode
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
    await this.fetchUsers()
  }
}
decorate( UserStore, {
  users: observable,
  name:observable,
  searchText: observable,
  searchQuery: observable,
  searchPageNum: observable,
  searchPageItemCount: observable,
  searchResultsItemCount: observable,
  showSearchCardLoader: observable,
  userName: observable,
  setSelectedUsers: action,
  getSelectedUsers: action,
  status: observable,
  viewMode:observable
})

export default new UserStore();
