import React, { Component } from 'react';
import { observer } from "mobx-react";
import {
  MaterialBox, MaterialDivider, MaterialTextField
} from 'web-app/apps/platform/components/material'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react'
import PlatformBasicButton from 'web-app/apps/platform/components/PlatformBasicButton.react'
import UserStore from 'web-app/apps/platform/stores/User.store'
import theme from 'web-app/themes/Basic.theme'
import PlatformSnackbar from 'web-app/apps/platform/components/PlatformSnackbar.react'
import {config} from 'web-app/ui-configs/Retro.config';
import PlatformButton from 'web-app/apps/platform/components/PlatformBasicButton.react'


class UsersOpCard extends Component {
  _renderCreateObjectButton() {
    return (
      <PlatformButton
        radius={10}
        bgColor={theme.primaryDark}
        fontColor={theme.textPrimary}
        onClick={async () => {
          await UserStore.userCreate()
        }}
      >
        Create
      </PlatformButton>
    )
  }


  _renderUpdateObjectButton() {
    return (
      <PlatformButton
        radius={10}
        bgColor={theme.primaryDark}
        borderColor={theme.primaryDark}
        fontColor={theme.textPrimary}
        onClick={async () => {
          await UserStore.userUpdate()
        }}
      >
        Update
      </PlatformButton>
    )
  }


  _renderOpButton() {
    const viewMode = UserStore.getViewMode()
    switch (viewMode) {
      case 'CREATE':
        return this._renderCreateObjectButton()
      case 'UPDATE':
        return this._renderUpdateObjectButton()
      default:
        return
    }
  }


  _renderObjectOpCard() {
    const userName = UserStore.getUserName()
    const name = UserStore.getName()
    return (
      <MaterialBox style={{width: '100%', marginTop: 30}}>
        <MaterialBox style={{width: '100%'}}>
          <MaterialTextField
            fullWidth
            label='Name'
            variant='outlined'
            size='small'
            onChange={(event) => UserStore.setName(event.target.value)}
            value={name ? name : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <MaterialTextField
            fullWidth
            label='Email'
            variant='outlined'
            size='small'
            InputProps={{placeholder: 'Enter email ex- xxxx@delta.org'}}
            onChange={(event) => UserStore.setUserName(event.target.value)}
            value={userName ? userName : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
            {this._renderOpButton()}
        </MaterialBox>
      </MaterialBox>
    )
  }


  render () {
    const status = UserStore.getStatus()
    return (
      <PlatformObjectCard width={600} backgroundColor={config.color_8}>
        {this._renderObjectOpCard()}
        {status ? (
          <PlatformSnackbar
            key={status.key}
            message={status.message}
          ></PlatformSnackbar>
        ) : (
          ''
        )}
      </PlatformObjectCard>
    )
  }
}

UsersOpCard.displayName = 'UsersOpCard';
export default observer( UsersOpCard );
