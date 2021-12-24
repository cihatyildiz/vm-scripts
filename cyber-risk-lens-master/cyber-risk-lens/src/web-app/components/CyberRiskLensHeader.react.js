import React, { Component } from 'react';
import Cookies from 'universal-cookie';

import {
  MaterialPaper,
  MaterialGrid,
  MaterialDivider,
  MaterialBox
} from 'themes/material'
import {config} from 'web-app/ui-configs/Retro.config'


class CyberRiskLensHeader extends Component {
  _renderUserProfileCard(username) {
    return (
      <MaterialGrid
        container
        alignItems="center"
        justify="flex-end"
        style={{textAlign: "right"}}
      >
        <MaterialGrid
          md={11}
          item
          style={{color: config.color_8, cursor: "pointer"}}
        >
          {username}
          <span
            onClick={() => {
              let cookies = new Cookies();
              cookies.remove("sessionID");
              cookies.remove("username");
              localStorage.removeItem("userGroups")
              window.location.assign("/user");
            }}
          >
            <img
              alt="logout"
              style={{paddingLeft: 10}}
              width="20px"
              src="https://rc-github.deltads.ent/ca34991/cyber-risk-static-assets/blob/master/signout.png?raw=true"
            />
          </span>
        </MaterialGrid>
      </MaterialGrid>
    );
  }
  render() {
    let cookies = new Cookies()
    let username = cookies.get('username')
    console.log('username'.username)
    console.log('usergroups',localStorage.getItem('userGroups'))
    return (
      <MaterialPaper>
        <MaterialGrid container alignItems = 'center' style = {{color: config.color_8, paddingBottom: 10}}>
          <MaterialGrid item md = {2}>
            <MaterialPaper style = {{textAlign: 'left', color: config.color_8 }}>
              {this.props.title}
            </MaterialPaper>
          </MaterialGrid>
          <MaterialGrid item md = {10} sm = {10}>
            {username ? this._renderUserProfileCard(username): null}
          </MaterialGrid>
        </MaterialGrid>
        <MaterialDivider style = {{backgroundColor: config.color_3}}/>
      </MaterialPaper>
    )
  }
}


CyberRiskLensHeader.displayName = 'CyberRiskLensHeader';
export default CyberRiskLensHeader;
