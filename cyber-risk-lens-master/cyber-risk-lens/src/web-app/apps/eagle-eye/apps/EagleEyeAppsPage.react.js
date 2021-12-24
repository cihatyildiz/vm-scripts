import React, { Component } from 'react'
import { toJS } from "mobx";
import { observer} from "mobx-react"
import { MaterialBox } from 'web-app/apps/platform/components/material'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import PlatformIconButtonCard from 'web-app/apps/platform/components/PlatformIconButtonCard.react'
import PlatformPageTitleCard from 'web-app/apps/platform/components/PlatformPageTitleCard.react.js'
import theme from 'web-app/themes/Basic.theme'
import EagleEyeAppsListCard from 'web-app/apps/eagle-eye/apps/components/EagleEyeAppsListCard.react'
import EagleEyeAppOpCard from 'web-app/apps/eagle-eye/apps/components/EagleEyeAppOpCard.react'
import EagleEyeAppStore from 'web-app/apps/eagle-eye/stores/EagleEyeApp.store'


class EagleEyeAppsPage extends Component {
  _onClickUpdateIcon () {
    let selectedItems = EagleEyeAppStore.getSelectedItems()
    if (!selectedItems) {
      throw 'OP_UPDATE_ONLY_ONE'
    }
    const itemIds=Object.keys(selectedItems)
    if (itemIds.length !== 1) {
      throw 'OP_UPDATE_ONLY_ONE'
    }
    const selectedItem = selectedItems[itemIds[0]]
    if (selectedItem.userGroups) {
      let userGroups={}
      selectedItem.userGroups.map(
        (userGroup)=>{
          userGroups[userGroup.id]=userGroup
        }
      )
      EagleEyeAppStore.setUserGroups(userGroups)
    }
    EagleEyeAppStore.setSelctedAppId(selectedItem.id)
    EagleEyeAppStore.setId(selectedItem.id)
    EagleEyeAppStore.setDisplayName(selectedItem.displayName)
    EagleEyeAppStore.setName(selectedItem.name)
    EagleEyeAppStore.setContrastAppId(selectedItem.config.contrastAppId)
    EagleEyeAppStore.setUserGroupIds(selectedItem.userGroupIds);
    if (selectedItem.config.fortify) {
      if (selectedItem.config.fortify.gitUrl) {
        EagleEyeAppStore.setGitUrl(selectedItem.config.fortify.gitUrl)
      }
      if (selectedItem.config.fortify.projectName) {
        EagleEyeAppStore.setProjectName(selectedItem.config.fortify.projectName)
      }
      if (selectedItem.config.fortify.projectId) {
        EagleEyeAppStore.setProjectId(selectedItem.config.fortify.projectId)
      }
    }
    EagleEyeAppStore.setViewMode('UPDATE')
  }


  _renderButtons () {
    return (
      <MaterialBox style={{display: 'flex', alignItems: 'center', color: theme.primaryLight}}>
        <PlatformIconButtonCard>
          <AddIcon
            onClick={() => {
              EagleEyeAppStore.setViewMode('CREATE')
              EagleEyeAppStore.resetFields()
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
    const viewMode=EagleEyeAppStore.getViewMode()
    switch(viewMode) {
      case 'UPDATE':
        return <EagleEyeAppOpCard />
      case 'CREATE':
        return <EagleEyeAppOpCard />
      default:
        return <EagleEyeAppsListCard />
    }
  }


  render () {
    const opCard = this._renderOpCard()
    return (
      <MaterialBox style={ { width: '100%', maxWidth: 600,margin:'10px' } }>
        <PlatformPageTitleCard
          title='Apps'
          buttons={ this._renderButtons() }
        />
        <MaterialBox>
          {opCard}
        </MaterialBox>
      </MaterialBox>
    )
  }
}

EagleEyeAppsPage.displayName = 'EagleEyeAppsPage';
export default observer(EagleEyeAppsPage)
