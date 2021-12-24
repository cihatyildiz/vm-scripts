import React, { Component } from 'react'
import { observer } from "mobx-react"
import { Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom'
import { MaterialBox } from 'web-app/apps/platform/components/material'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import PlatformIconButtonCard from 'web-app/apps/platform/components/PlatformIconButtonCard.react'
import PlatformPage from 'web-app/apps/platform/components/PlatformPage.react'
import TopNavItems
  from 'web-app/apps/platform/components/UserTopNavItems.react'
import PlatformPageTitleCard from 'web-app/apps/platform/components/PlatformPageTitleCard.react.js'
import PlatformSnackbar from 'web-app/apps/platform/components/PlatformSnackbar.react'
import theme from 'web-app/themes/Basic.theme'
import UsersListCard from 'web-app/apps/platform/users/components/UsersListCard.react'
import UsersOpCard from 'web-app/apps/platform/users/components/UsersOpCard.react'
import UserStore from '../stores/User.store'
class UsersPage extends Component {
  constructor(props) {
    super(props)
  }

  _onClickUpdateIcon() {
    let selectedUsers = UserStore.getSelectedUsers()

    if (selectedUsers) {
      if (Object.keys(selectedUsers).length === 1) {
        let id = Object.keys(selectedUsers)[0]
        let selctedeUser = selectedUsers[id]
        UserStore.setUserName(selctedeUser.username)
        UserStore.setName(selctedeUser.name)
        UserStore.setViewMode('UPDATE')
      } else {
        let status = {
          key: Math.random(),
          message: 'please select only one user at a time to edit',
        }
        UserStore.setStatus(status)
      }
    } else {
      let status = {
        key: Math.random(),
        message: 'please select one user to edit',
      }
      UserStore.setStatus(status)
    }
  }

  _renderButtons() {
    return (
      <MaterialBox
        style = {{
          display: 'flex',
          alignItems: 'center',
          color: theme.primaryLight,
        }}
      >
        <PlatformIconButtonCard>
          <AddIcon
            onClick = {() => {
              UserStore.setViewMode('CREATE')
              UserStore.resetFields()
            }}
          />
        </PlatformIconButtonCard>
        <EditIcon
          fontSize = 'small'
          onClick = {() => {
            this._onClickUpdateIcon()
          }}
        />
      </MaterialBox>
    )
  }


  _renderOpCard() {
    const viewMode = UserStore.getViewMode()
    switch (viewMode) {
      case 'UPDATE':
        return <UsersOpCard />
        break
      case 'CREATE':
        return <UsersOpCard />
        break
      default:
        return <UsersListCard />
    }
  }

  render() {
    const status = UserStore.getStatus()
 const opCard = this._renderOpCard()
    return (
      <PlatformPage topNavigationItems = {TopNavItems}>
        <MaterialBox style = {{width: '100%', maxWidth: 600, margin:'10px'}}>
          <PlatformPageTitleCard
            title = 'Users'
            buttons = {this._renderButtons()}
          />
          <MaterialBox>
            {opCard}
          </MaterialBox>
          {status ? (
            <PlatformSnackbar
              key = {status.key}
              message = {status.message}
            ></PlatformSnackbar>
          ) : (
            ''
          )}
        </MaterialBox>
      </PlatformPage>
    )
  }
}

UsersPage.displayName = 'UsersPage';
export default withRouter(observer( UsersPage ));
