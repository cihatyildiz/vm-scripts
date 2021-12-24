import React, { Component } from 'react';
import { observer } from "mobx-react";
import {
  MaterialBox, MaterialDivider, MaterialTextField
} from 'web-app/apps/platform/components/material'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react'
import PlatformBasicButton from 'web-app/apps/platform/components/PlatformBasicButton.react'
import EagleEyeAppsStore from 'web-app/apps/eagle-eye/stores/EagleEyeApp.store'
import theme from 'web-app/themes/Basic.theme'
import {config} from 'web-app/ui-configs/Retro.config';

class EagleEyeAppOpCard extends Component {
  _renderObjectOpCard() {
    const appName=EagleEyeAppsStore.getAppName()
    const contrastAppId=EagleEyeAppsStore.getContrastAppId()
    const fortifyAppId=EagleEyeAppsStore.getFortifyAppId()
    const xRayWatchName=EagleEyeAppsStore.getXRrayWatchName()
    const githubUrl=EagleEyeAppsStore.getGithubUrl()
    return (
      <MaterialBox style={{width: '100%', marginTop: 30}}>
        <MaterialBox style={{width: '100%'}}>
          <MaterialTextField
            fullWidth label='Name' variant='outlined' size='small'
            onChange={(event)=>EagleEyeAppsStore.setAppName(event.target.value)}
            value={appName ? appName : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <MaterialTextField
            fullWidth label='Contrast App ID' variant='outlined' size='small'
            onChange={(event)=>EagleEyeAppsStore.setContrastAppId(event.target.value)}
            value={contrastAppId ? contrastAppId : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <MaterialTextField
            fullWidth label='Fortify App ID' variant='outlined' size='small'
            onChange={(event)=>EagleEyeAppsStore.setFortifyAppId(event.target.value)}
            value={fortifyAppId ? fortifyAppId : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <MaterialTextField
            fullWidth label='XRay Watch Name' variant='outlined' size='small'
            onChange={(event)=>EagleEyeAppsStore.setXRayWatchName(event.target.value)}
            value={xRayWatchName ? xRayWatchName : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <MaterialTextField
            fullWidth label='Github Url' variant='outlined' size='small'
            onChange={(event)=>EagleEyeAppsStore.setGithubUrl(event.target.value)}
            value={githubUrl ? githubUrl : ''}
          />
        </MaterialBox>
        <MaterialBox style={{width: '100%', marginTop: 30}}>
          <PlatformBasicButton
            radius={10}
            bgColor={theme.primaryDark}
            borderColor={theme.primaryDark}
            fontColor={theme.textPrimary}
            onClick={async ()=>{
              await EagleEyeAppsStore.appCreate()
            }}
          >
            ADD
          </PlatformBasicButton>
        </MaterialBox>
      </MaterialBox>
    )
  }


  render() {
    return (
      <PlatformObjectCard width={600} backgroundColor={config.color_8}>
        {this._renderObjectOpCard()}
      </PlatformObjectCard>
    )
  }
}

EagleEyeAppOpCard.displayName='EagleEyeAppOpCard';
export default observer(EagleEyeAppOpCard);
