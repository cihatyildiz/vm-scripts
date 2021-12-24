import React, { Component } from 'react';
import {
  MaterialGrid,
  MaterialPaper,
  MaterialButton,
  MaterialDivider
} from 'themes/material';
import CyberRiskLensHeader from 'web-app/components/CyberRiskLensHeader.react'
import {config} from 'web-app/ui-configs/Retro.config'
import {observer} from "mobx-react";
import {withRouter, Redirect} from "react-router-dom";
import Authstore from 'web-app/apps/user/stores/auth.store'
class Apps extends Component {
  state = {
    show_content: true
  }

  async componentDidMount() {
    console.log(config)
    console.log(config.color_1)
 let x=await Authstore.isAuthenticated()
    console.log('auth', x)
    let y = await Authstore.getUserGroups()
    console.log('y',y)
  }

  render() {
    return (
      <MaterialGrid
        container
        direction = 'row'
        justify = 'center'
        style = {{
          position: 'absolute',
          backgroundColor: config.color_1,
          minHeight: '100%'
        }}
      >
        <MaterialGrid
          item md = {12}
          style = {{padding: 15, height: '10%'}}
        >
          <CyberRiskLensHeader title = 'Cyber Risk' user_name = 'NA'/>
        </MaterialGrid>
        <MaterialGrid item md = {4} style = {{height: '90%', paddingBottom: 150}}>
          <MaterialPaper style = {{
            color: 'lightgrey',
            borderStyle: 'solid',
            borderWidth: '0.5px',
            borderRadius: 10
          }}>
            <MaterialPaper style={{ padding: 15, textAlign: 'left' }}>
              <h3>
                  Apps
              </h3>

            </MaterialPaper>
            <MaterialDivider />
            <MaterialPaper
              style = {{padding: 15 , textAlign: 'left', cursor: 'pointer'}}
              onClick = {() => window.location.assign('/eagle-eye/vulns')}
            >
              Code Scope
            </MaterialPaper>
            <MaterialDivider />
          </MaterialPaper>
        </MaterialGrid>
      </MaterialGrid>
    )
  }
}
Apps.displayName = 'Apps';
export default withRouter(observer(Apps));
