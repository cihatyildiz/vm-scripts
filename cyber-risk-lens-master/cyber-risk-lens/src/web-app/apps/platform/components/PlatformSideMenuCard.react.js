import React, { Component } from 'react'
import Slide from 'react-reveal/Slide'
import FlightIcon from '@material-ui/icons/Flight'
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import MenuIcon from '@material-ui/icons/Menu';
import {config} from 'web-app/ui-configs/Retro.config'
import {
  MaterialBox,
} from 'web-app/apps/platform/components/material'
import { observer } from "mobx-react";
import PlatformSideMenuStore from './../stores/PlatformSideMenu.Store'
import theme from 'web-app/themes/Basic.theme'
import MaterialDivider from './material/MaterialDivider/MaterialDivider.react'
class PlatformSideMenu extends Component {
  // componentDidMount() {
  //   if (screen.width < 500) {
  //     PlatformSideMenuStore.showIconsOnly=true
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
            PlatformSideMenuStore.showIconsOnly
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
    if (PlatformSideMenuStore.showIconsOnly) {
      menuWidth=40
    }
    return (
      <MaterialBox
        style={{
          width: menuWidth,
          height: "100%",
          backgroundColor: theme.primaryMain,
        }}
      >
        <MaterialBox display="flex" flexDirection="column">
          <MaterialBox
            style={{
              display: "flex",
              maxWidth: "100%",
              padding: 0,
              color: theme.textPrimary,
              fontSize: 15,
              alignItems: "center",
              height: 50,
            }}
          >
            <MaterialBox
              style={{
                flex: 0,
                marginRight: 0,
                paddingTop: 4,
                paddingLeft: 10,
                cursor: "pointer",
              }}
              onClick={() => {
                if (PlatformSideMenuStore.showIconsOnly === null) {
                  PlatformSideMenuStore.showIconsOnly = true;
                } else {
                  PlatformSideMenuStore.showIconsOnly = !PlatformSideMenuStore.showIconsOnly;
                }
              }}
            >
              <MenuIcon fontSize="small" />
            </MaterialBox>
            {PlatformSideMenuStore.showIconsOnly ? null : (
              <MaterialBox
                style={{
                  flex: 1,
                  marginBottom: 0,
                  paddingLeft: 10,
                  textAlign: "left",
                  fontSize: 18,
                }}
              >
                Platform
              </MaterialBox>
            )}
          </MaterialBox>
          <MaterialBox
            display="flex"
            flexDirection="column"
            style={{paddingLeft: 10, paddingRight: 10}}
          >
            {this._renderMenuItem(
              <PersonIcon fontSize="small" />,
              "Users",
              "/platform/users"
            )}
          </MaterialBox>
          <MaterialBox
            display="flex"
            flexDirection="column"
            style={{paddingLeft: 10, paddingRight: 10}}
          >
            {this._renderMenuItem(
              <GroupIcon fontSize="small" />,
              "User Groups",
              "/platform/user-groups"
            )}
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    );
  }
}

PlatformSideMenu.displayName ='PlatformSideMenu';
export default observer( PlatformSideMenu);
