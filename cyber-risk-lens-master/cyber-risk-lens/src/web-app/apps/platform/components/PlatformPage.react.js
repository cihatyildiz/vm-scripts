import React, { Component } from 'react';
import { observer } from "mobx-react";
import {
  MaterialBox, MaterialDivider
} from 'themes/material'
import PlatformFullPage from 'web-app/apps/platform/components/PlatformFullPage.react'
import PlatformSideMenuCard from 'web-app/apps/platform/components/PlatformSideMenuCard.react'
import theme from 'web-app/themes/Basic.theme'

class PlatformPage extends Component {
  render() {
    const sideMenuCard=<PlatformSideMenuCard/>
    return (
      <PlatformFullPage
        sideMenu={sideMenuCard}
        topNavigationItems={this.props.topNavigationItems}
        highlightColor = {theme.primaryLight}
      >
        {this.props.children}
      </PlatformFullPage>
    )
  }
}

PlatformPage.displayName ='PlatformPage';
export default observer( PlatformPage);
