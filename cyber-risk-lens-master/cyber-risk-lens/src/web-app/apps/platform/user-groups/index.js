import React, { Component } from 'react'
import { toJS } from "mobx";
import { observer} from "mobx-react"
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
import UserGroupListCard from 'web-app/apps/platform/user-groups/components/UserGroupListCard.react'
import UserGroupOpCard from 'web-app/apps/platform/user-groups/components/UserGroupOpCard.react'
import UserStore from 'web-app/apps/platform/stores/User.store'
import UserGroupStore from '../stores/UserGroup.store'
class UserGroupsPage extends Component {
  constructor ( props ) {
    super( props )
  }


  _onClickUpdateIcon() {
    let selectedItems = UserGroupStore.getSelectedItems()
    if (!selectedItems) {
      throw 'OP_UPDATE_ONLY_ONE'
    }
    const itemIds=Object.keys(selectedItems)
    if (itemIds.length !== 1) {
      throw 'OP_UPDATE_ONLY_ONE'
    }
    const selectedItem=selectedItems[itemIds[0]]
    if (selectedItem.users) {
      let users={}
      selectedItem.users.map(
        (user)=>{
          users[user.id]=user
        }
      )
      UserGroupStore.setUsers(users)
    }
    UserGroupStore.setId(selectedItem.id)
    UserGroupStore.setName(selectedItem.name)
    UserGroupStore.setDesc(selectedItem.desc)
    UserGroupStore.setUserIds(selectedItem.userIds)
    UserGroupStore.setViewMode('UPDATE')
  }


  _renderButtons () {
    return (
      <MaterialBox style={{display: 'flex', alignItems: 'center', color: theme.primaryLight}}>
        <PlatformIconButtonCard>
          <AddIcon
            onClick={ () => {
              UserGroupStore.setViewMode('CREATE')
            } }
          />
        </PlatformIconButtonCard>
        <PlatformIconButtonCard>
        <EditIcon
            fontSize='small'
            onClick={() => {
              this._onClickUpdateIcon()
            }}
          />
        </PlatformIconButtonCard>
      </MaterialBox>
    )
  }


  _renderOpCard() {
    const viewMode=UserGroupStore.getViewMode()
    switch(viewMode) {
      case 'UPDATE':
        return <UserGroupOpCard/>
        break
      case 'CREATE':
        return <UserGroupOpCard/>
        break
      default:
        return <UserGroupListCard />
    }
  }


  render () {
    const opCard = this._renderOpCard()
    return (
      <PlatformPage topNavigationItems={ TopNavItems }>
        <MaterialBox style={ { width: '100%', maxWidth: 600 ,margin:'10px' } }>
          <PlatformPageTitleCard title='Groups' buttons={ this._renderButtons() } />
          <MaterialBox>
            {opCard}
          </MaterialBox>
        </MaterialBox>
      </PlatformPage>
    )
  }
}

UserGroupsPage.displayName = 'UserGroupsPage';
export default withRouter(observer( UserGroupsPage ));
