import React, { Component } from 'react';
import { observer } from "mobx-react";
import {
  MaterialBox, MaterialDivider
} from 'themes/material'
import PlatfromHeaderCard from 'web-app/apps/platform/components/PlatformHeaderCard.react.js'

class PlatformFullPage extends Component {
  render() {
   return (
      <MaterialBox
        style={{
          display: 'flex',
          position: 'absolute', minHeight: '100%', width: '100%', maxWidth: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          backgroundSize: '100% 100%', overflowX: 'hidden'
        }}
      >
        <MaterialBox style={{
          display: 'flex', flex: 1,
         minHeight: '100%', overflowX: 'hidden',
        }}>
          {this.props.sideMenu}
          <MaterialBox style={{flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden'}}>
            <MaterialBox>
              <PlatfromHeaderCard
                topNavigationItems={this.props.topNavigationItems}
                highlightColor={this.props.highlightColor}
              />
            </MaterialBox>
            <MaterialBox style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-start', alignItems: 'stretch',
              backgroundColor:this.props.backgroundColor
            }}>
              {this.props.children}
            </MaterialBox>
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }
}

PlatformFullPage.displayName='PlatformFullPage';
export default observer(PlatformFullPage);
