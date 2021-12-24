import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { toJS } from 'mobx';
import { observer } from 'mobx-react'
import theme from 'web-app/themes/Basic.theme'
import {
  MaterialBox,
  MaterialTextField, MaterialDivider
} from 'web-app/apps/platform/components/material'
import PlatformButton from 'web-app/apps/platform/components/PlatformBasicButton.react'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react.js'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react'
import PlatformPopUpCard from 'web-app/apps/platform/components/PlatformPopUpCard.react'
import UsersAddCard from 'web-app/apps/platform/users/components/UsersAddCard.react'
import UserGroupStore from 'web-app/apps/platform/stores/UserGroup.store'
import UserStore from 'web-app/apps/platform/stores/User.store'
import {config} from 'web-app/ui-configs/Retro.config'
import PlatformSnackbar from '../../components/PlatformSnackbar.react';


class UserGroupOpCard extends Component {
  componentDidMount() {
    UserStore.fetchUsers()
  }


  _renderAddUsersPopUpCard() {
    let isOpen = UserGroupStore.getShowAddUsersPopUpCard()
    const onClose = function () {
      UserGroupStore.setSearchText(null)
      UserGroupStore.setShowAddUsersPopUpCard(false)
    }
    let itemIds = UserGroupStore.getUserIds()
    // let items=UserStore.getUsers()
    return (
      <PlatformPopUpCard
        isOpen = {isOpen}
        onClose = {onClose}
        title='Users: ADD'>
        <MaterialBox style = {{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
        >
          <MaterialBox style = {{width: 600}}>
            <UsersAddCard
              itemIds = {itemIds}
              // items={items}
              onClose = {onClose}
              onClickAddIcon = {(item)=>{
                let selectedItemIds = UserGroupStore.getUserIds()
                if (!selectedItemIds) {
                  selectedItemIds = []
                }
                let selectedItems = UserGroupStore.getUsers()

                if (selectedItemIds.includes(item.id)) {
                  const index = itemIds.indexOf(item.id)
                  if (index > -1) {
                    itemIds.splice(index, 1);
                  }
                  delete selectedItems[item.id]
                } else {
                  selectedItemIds.push(item.id)

                  if (!selectedItems) {
                    selectedItems = {}
                  }
                  selectedItems[item.id] = item
                }
                UserGroupStore.setUserIds(selectedItemIds)
                UserGroupStore.setUsers(selectedItems)
              }}
            />
          </MaterialBox>
        </MaterialBox>
      </PlatformPopUpCard>
    )
  }


  _renderCreateObjectButton() {
    return (
      <PlatformButton
        radius = {10}
        bgColor = {theme.primaryDark}
        borderColor = {theme.primaryDark}
        fontColor = {theme.textPrimary}
        onClick = {async () => {
          await UserGroupStore.createItem()
        }}
      >
        Create
      </PlatformButton>
    )
  }


  _renderUpdateObjectButton() {
    return (
      <PlatformButton
        radius = {10}
        bgColor = {theme.primaryDark}
        borderColor = {theme.primaryDark}
        fontColor = {theme.textPrimary}
        onClick = {async () => {
          await UserGroupStore.updateItem()
        }}
      >
        Update
      </PlatformButton>
    )
  }


  _renderOpButton() {
    const viewMode = UserGroupStore.getViewMode()
    switch(viewMode) {
      case 'CREATE':
        return this._renderCreateObjectButton()
      case 'UPDATE':
        return this._renderUpdateObjectButton()
      default:
        return
    }
  }


  _renderUsersCard(users) {
    const platformListItemStyle = {
      borderRadius: 2,
      display: 'flex',
      fontSize: 14,
      padding: 8,
      paddingTop: 10.5,
      textAlign: 'left',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
    let renderedList = []
    if(users) {
      for (let [k, v] of Object.entries(users)) {
        renderedList.push(
          <MaterialBox style = {{display: 'flex', flexDirection: 'column'}}>
             <MaterialBox
              style = { {...platformListItemStyle} }
            >
              <MaterialBox>
                {v.name}
              </MaterialBox>
              <MaterialBox>
                {v.username}
              </MaterialBox>
          </MaterialBox>
          <MaterialDivider style = {{}}/>
          </MaterialBox>
        )
      }

    }
    return (
      <MaterialBox>
        <MaterialBox
            style = {{fontSize: 12, textDecoration: 'underline', cursor: 'pointer'}}
            onClick = {async () => {
              UserGroupStore.setShowAddUsersPopUpCard(true)
            }}
          >
            Add/Remove
        </MaterialBox>
        <MaterialBox style = {{marginTop: 10}}>
          {renderedList}
        </MaterialBox>
      </MaterialBox>
    )
  }


  _renderOpCard() {
    console.log('_renderOpCard')
    // let showSuccess=EatioManagerItemsStore.getShowObjectCardSuccess()
    // if (showSuccess) {
    //   return (
    //     <MaterialBox style={{ margin: 50 }}>
    //       <PlatformSuccessCard
    //         iconColor={theme.color7}
    //         msgColor={theme.color4}
    //         msg='Success !'
    //       />
    //     </MaterialBox>
    //   )
    // }
    let showLoader = UserGroupStore.getShowOpCardLoader()
    if (showLoader) {
      return (
        <MaterialBox style = {{ margin: 50 }}>
          <PlatformLoaderCard />
        </MaterialBox>
      )
    }
    let name = UserGroupStore.getName()
    let desc = UserGroupStore.getDesc()
    let users = UserGroupStore.getUsers()
    return (
      <MaterialBox style = {{ width: '100%', marginTop: 50 }}>
        <MaterialBox style = {{ width: '100%' }}>
          <MaterialTextField
            fullWidth
            label = 'Name'
            variant = 'outlined'
            size = 'small'
            onChange = {(event) =>
              UserGroupStore.setName(event.target.value)
            }
            value = {name ? name : ''}
          />
        </MaterialBox>
        <MaterialBox style = {{ width: '100%', marginTop: 30 }}>
          <MaterialTextField
            fullWidth
            label = 'Description'
            variant = 'outlined'
            size = 'small'
            onChange = {(event) =>
              UserGroupStore.setDesc(event.target.value)
            }
            value = {desc ? desc : ''}
          />
        </MaterialBox>
        <MaterialBox style = {{ width: '100%', marginTop: 30 }}>
          Users
          {this._renderUsersCard(users)}
        </MaterialBox>
        <MaterialBox style = {{ display: 'flex', marginTop: 30 }}>
          <MaterialBox>{this._renderOpButton()}</MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }


  render () {
    const status = UserGroupStore.getStatus()
    return (
        <PlatformObjectCard width = {600} backgroundColor={config.color_8}>
          {this._renderOpCard()}
          {this._renderAddUsersPopUpCard()}
          {status ? (
            <PlatformSnackbar
              key = {status.key}
              message = {status.message}
            ></PlatformSnackbar>
          ) : (
            ''
          )}
        </PlatformObjectCard>
    )
  }
}


UserGroupOpCard.displayName = 'UserGroupOpCard'
export default (observer(UserGroupOpCard))
