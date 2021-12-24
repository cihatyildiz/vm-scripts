import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { toJS } from 'mobx';
import {withRouter} from 'react-router-dom';
import { observer } from 'mobx-react'
import theme from 'web-app/themes/Basic.theme'
import {
  MaterialBox,
  MaterialTextField, MaterialDivider,
  MaterialCheckbox
} from 'web-app/apps/platform/components/material'
import PlatformButton from 'web-app/apps/platform/components/PlatformBasicButton.react'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react.js'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react'
import PlatformPopUpCard from 'web-app/apps/platform/components/PlatformPopUpCard.react'
import UserGroupsAddCard from 'web-app/apps/platform/users/components/UserGroupsAddCard.react';
import PlatformSnackbar from 'web-app/apps/platform/components/PlatformSnackbar.react'
import EagleEyeAppStore from 'web-app/apps/eagle-eye/stores/EagleEyeApp.store'
import UserGroupStore from 'web-app/apps/platform/stores/UserGroup.store'
import PlatformActivityLog from 'web-app/apps/platform/components/PlatformActivityLog.react';
import {MaterialPaper} from 'themes/material';
import date from 'libs/date/date.lib'
import {config} from 'web-app/ui-configs/Retro.config';

class EagleEyeAppOpCard extends Component {
  componentDidMount() {
    UserGroupStore.fetchUserGroups();
    EagleEyeAppStore.fetchActivityLogs();
  }

  _toDate(value) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const newDate = new Date(value).toLocaleDateString('en-US', options);
    const newTime = new Date(value).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateString = newDate + ' ' + newTime;
    return dateString;
  }


  _renderAddUserGroupsPopUpCard() {
    let isOpen = EagleEyeAppStore.getShowAddUserGroupsPopUpCard();
    const onClose = function () {
      EagleEyeAppStore.setSearchText(null);
      EagleEyeAppStore.setShowAddUserGroupsPopUpCard(false);
    };
    let itemIds = EagleEyeAppStore.getUserGroupIds();
    return (
      <PlatformPopUpCard
        isOpen={isOpen}
        onClose={onClose}
        title='User Groups: ADD'
      >
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <MaterialBox style={{width: 600}}>
            <UserGroupsAddCard
              itemIds={itemIds}
              onClose={onClose}
              onClickAddIcon={(item) => {
                let selectedItemIds = EagleEyeAppStore.getUserGroupIds();
                if (!selectedItemIds) {
                  selectedItemIds = [];
                }
                let selectedItems = EagleEyeAppStore.getUserGroups();

                if (selectedItemIds.includes(item.id)) {
                  const index = itemIds.indexOf(item.id);
                  if (index > -1) {
                    itemIds.splice(index, 1);
                  }
                  delete selectedItems[item.id];
                } else {
                  selectedItemIds.push(item.id);

                  if (!selectedItems) {
                    selectedItems = {};
                  }
                  selectedItems[item.id] = item;
                }
                EagleEyeAppStore.setUserGroupIds(selectedItemIds);
                EagleEyeAppStore.setUserGroups(selectedItems);
              }}
            />
          </MaterialBox>
        </MaterialBox>
      </PlatformPopUpCard>
    );
  }

  _renderCreateObjectButton() {
    return (
      <PlatformButton
        radius = {10}
        bgColor = {theme.primaryDark}
        borderColor = {theme.primaryDark}
        fontColor = {theme.textPrimary}
        onClick = {async () => {
          await EagleEyeAppStore.createApp();
        }}
      >
        Create
      </PlatformButton>
    );
  }

  _renderUpdateObjectButton() {
    return (
      <PlatformButton
        radius = {10}
        bgColor = {theme.primaryDark}
        borderColor = {theme.primaryDark}
        fontColor = {theme.textPrimary}
        onClick = {async () => {
          await EagleEyeAppStore.updateApp();
        }}
      >
        Update
      </PlatformButton>
    );
  }

  _renderOpButton() {
    const viewMode = EagleEyeAppStore.getViewMode();
    switch (viewMode) {
      case 'CREATE':
        return this._renderCreateObjectButton();
        break;
      case 'UPDATE':
        return this._renderUpdateObjectButton();
        break;
      default:
        return;
    }
  }

  _renderUserGroupsCard(userGroups) {
    const platformListItemStyle = {
      borderRadius: 2,
      display: 'flex',
      fontSize: 14,
      padding: 8,
      paddingTop: 10.5,
      textAlign: 'left',
      alignItems: 'center',
      justifyContent: 'space-between',
    };
    let renderedList = [];
    if (userGroups) {
      for (let [k, v] of Object.entries(userGroups)) {
        renderedList.push(
          <MaterialBox key={k} style={{display: 'flex', flexDirection: 'column'}}>
            <MaterialBox style={{...platformListItemStyle}}>
              <MaterialBox>{v.name}</MaterialBox>
              <MaterialBox>{v.description}</MaterialBox>
            </MaterialBox>
            <MaterialDivider style = {{}} />
          </MaterialBox>
        );
      }
    }
    return (
      <MaterialBox>
        <MaterialBox
          style = {{fontSize: 12, textDecoration: 'underline', cursor: 'pointer'}}
          onClick = {async () => {
            EagleEyeAppStore.setShowAddUserGroupsPopUpCard(true);
          }}
        >
          Add/Remove
        </MaterialBox>
        <MaterialBox style={{marginTop: 10}}>{renderedList}</MaterialBox>
      </MaterialBox>
    );
  }

  _renderOpCard() {
    let showLoader = EagleEyeAppStore.getShowOpCardLoader();
    let viewMode = EagleEyeAppStore.getViewMode()
    let isDisabled=false
    if (viewMode == 'UPDATE') {
      isDisabled=true
    }
    if (showLoader) {
      return (
        <MaterialBox style = {{margin: 50}}>
          <PlatformLoaderCard />
        </MaterialBox>
      );
    }
    let name = EagleEyeAppStore.getName();
    let displayName=EagleEyeAppStore.getDisplayName()
    let contrastAppId = EagleEyeAppStore.getContrastAppId();
    let gitUrl = EagleEyeAppStore.getGitUrl();
    let userGroups = EagleEyeAppStore.getUserGroups();
    return (
      <MaterialBox style={{width: '100%', marginTop: 50}}>
        <MaterialBox style={{width: '100%'}}>
          <MaterialTextField
            disabled={isDisabled}
            fullWidth
            label='Name'
            variant='outlined'
            size='small'
            onChange={(event) => EagleEyeAppStore.setName(event.target.value)}
            value={name ? name : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <MaterialTextField
            fullWidth
            label='Display Name'
            variant='outlined'
            size='small'
            onChange={(event) =>
              EagleEyeAppStore.setDisplayName(event.target.value)
            }
            value={displayName ? displayName : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <MaterialTextField
            fullWidth
            label='Contrast App Id'
            variant='outlined'
            size='small'
            onChange={(event) =>
              EagleEyeAppStore.setContrastAppId(event.target.value)
            }
            value={contrastAppId ? contrastAppId : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <MaterialTextField
            fullWidth
            label='Git Url'
            variant='outlined'
            size='small'
            onChange={(event) => EagleEyeAppStore.setGitUrl(event.target.value)}
            value={gitUrl ? gitUrl : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          User Groups
          {this._renderUserGroupsCard(userGroups)}
        </MaterialBox>
        <MaterialBox style={{display: 'flex', marginTop: 30}}>
          <MaterialBox>{this._renderOpButton()}</MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }

  _renderActivityLogsCard() {
    let logs = EagleEyeAppStore.getActivityLogs();
    let appName = EagleEyeAppStore.getName();
    let list = [];
    if (!logs) {
      return;
    }
    logs.map((item) => {
      list.push(
        <MaterialPaper>
          {date(item.tsUpdate)} : &nbsp;{appName} &nbsp; | &nbsp; Tool:{" "}
          {item.data.srcTool} &nbsp; | &nbsp; scan: {item.data.status} &nbsp;
          {item.data.srcTool === 'fortify' ? (
            <span>|&nbsp;commit id: {item.data.commitId}</span>
          ) : null}
        </MaterialPaper>
      );
    });
    return <PlatformActivityLog logs={list} />;
  }

  render() {
    let appId = EagleEyeAppStore.getId();
    const status = EagleEyeAppStore.getStatus()
    return (
      <MaterialBox>
        <PlatformObjectCard
          width={600}
          backgroundColor={config.color_8}        >
          {this._renderOpCard()}
          {this._renderAddUserGroupsPopUpCard()}
        </PlatformObjectCard>
        <MaterialBox style = {{marginTop: '10px'}}>
          {appId ? this._renderActivityLogsCard() : null}
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
    )
  }
}


EagleEyeAppOpCard.displayName = 'EagleEyeAppOpCard';
export default withRouter(observer(EagleEyeAppOpCard));
