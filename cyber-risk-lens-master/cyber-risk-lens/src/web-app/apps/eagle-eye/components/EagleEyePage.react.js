import React, { Component } from 'react';
import { observer } from "mobx-react";
import {
  MaterialBox, MaterialDivider
} from 'themes/material'
import PlatformFullPage from 'web-app/apps/platform/components/PlatformFullPage.react'
import EagleEyeSideMenuCard from 'web-app/apps/eagle-eye/components/EagleEyeSideMenuCard.react'
import theme from 'web-app/themes/Basic.theme'
import {config} from 'web-app/ui-configs/Retro.config';

class EagleEyePage extends Component {
  render() {
    const sideMenuCard=<EagleEyeSideMenuCard/>
    return (
      <PlatformFullPage
        sideMenu={sideMenuCard}
        highlightColor={theme.primaryLight}
        backgroundColor={this.props.backgroundColor}
      >
        {this.props.children}
      </PlatformFullPage>
    )
  }
}

EagleEyePage.displayName='EagleEyePage';
export default observer(EagleEyePage);
