import React, { Component } from 'react'
import Slide from 'react-reveal/Slide'
import FlightIcon from '@material-ui/icons/Flight'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import NoEncryptionIcon from '@material-ui/icons/NoEncryption'
import MenuIcon from '@material-ui/icons/Menu';
import {config} from 'web-app/ui-configs/Retro.config'
import {
  MaterialBox,
} from 'web-app/apps/platform/components/material'
import { observer } from "mobx-react";
import EagleEyeSideMenuStore from './../stores/EagleEyeSideMenu.store.js'
import theme from 'web-app/themes/Basic.theme'

class EagleEyeSideMenu extends Component {
  // componentDidMount() {
  //   if (screen.width < 500) {
  //     EagleEyeSideMenuStore.showIconsOnly=true
  //   }
  // }


  _renderMenuItem(itemIcon, itemName, itemLink) {
    return (
      <a href={itemLink}
        style={{textDecoration: 'none', color: 'white', marginTop: 20}}
      >
        <MaterialBox style={{display: 'flex', alignItems: 'center'}}>
          <MaterialBox style={{flex: 0, textAlign: 'center'}}>
            {itemIcon}
          </MaterialBox>
          {
            EagleEyeSideMenuStore.showIconsOnly
            ? <MaterialBox style={{flex: 0}}></MaterialBox>
            : <Slide right>
                <MaterialBox
                  style={{
                    paddingLeft: 10, paddingRight: 10, fontWeight: 100, fontSize: 14,
                  }}
                >
                  {itemName}
                </MaterialBox>
              </Slide>
          }
        </MaterialBox>
      </a>
    )
  }


  render() {
    let menuWidth=180
    if (EagleEyeSideMenuStore.showIconsOnly) {
      menuWidth=40
    }
    return (
      <MaterialBox
        style={{
          width: menuWidth,
          height: '100%',
          backgroundColor: theme.primaryMain,
        }}
      >
        <MaterialBox display='flex' flexDirection='column'>
          <MaterialBox
            style={{
              display: 'flex',
              maxWidth: '100%',
              padding: 0,
              color: theme.textPrimary,
              fontSize: 15,
              alignItems: 'center',
              height: 50,
            }}
          >
            <MaterialBox
              style={{
                flex: 0,
                marginRight: 0,
                paddingTop: 4,
                paddingLeft: 10,
                cursor: 'pointer',
              }}
              onClick={() => {
                if (EagleEyeSideMenuStore.showIconsOnly === null) {
                  EagleEyeSideMenuStore.showIconsOnly = true
                } else {
                  EagleEyeSideMenuStore.showIconsOnly = !EagleEyeSideMenuStore.showIconsOnly
                }
              }}
            >
              <MenuIcon fontSize='small' />
            </MaterialBox>
            {EagleEyeSideMenuStore.showIconsOnly ? null : (
              <MaterialBox
                style={{
                  flex: 1,
                  marginBottom: 0,
                  paddingLeft: 10,
                  textAlign: 'left',
                  fontSize: 18,
                }}
              >
                Code Scope
              </MaterialBox>
            )}
          </MaterialBox>
          <MaterialBox
            display='flex'
            flexDirection='column'
            style={{paddingLeft: 10, paddingRight: 10}}
          >
            {this._renderMenuItem(
              <NoEncryptionIcon fontSize='small' />,
              'Vulns',
              '/eagle-eye/vulns'
            )}
            {/* <MaterialDivider style={{backgroundColor: 'white', marginTop: 10}}/> */}
            {this._renderMenuItem(
              <FindInPageIcon fontSize='small' />,
              'Apps',
              '/eagle-eye/apps'
            )}

            {this._renderMenuItem(
              <FlightIcon fontSize='small' />,
              'Activity Logs',
              '/eagle-eye/logs'
            )}
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }
}

EagleEyeSideMenu.displayName='EagleEyeSideMenu';
export default observer(EagleEyeSideMenu);
