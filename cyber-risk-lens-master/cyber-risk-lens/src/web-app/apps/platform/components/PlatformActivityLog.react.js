import React, { Component } from 'react';
import { observer } from "mobx-react";
import {withRouter} from 'react-router-dom'
import {
  MaterialBox
} from 'web-app/apps/platform/components/material'
import EagleEyeAppStore from 'web-app/apps/eagle-eye/stores/EagleEyeApp.store'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react.js'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react.js'
import {MaterialPaper} from 'themes/material';
import {config} from 'web-app/ui-configs/Retro.config'

class PlatformActivityLog extends Component {

  _renderLogs () {
    let list;
    let renderedList = [];
    const platformListItemStyle = {
      borderRadius: 2,
      display: "flex",
      fontSize: 14,
      padding: 8,
      paddingTop: 10.5,
      textAlign: "left",
      alignItems: "center",
      justifyContent: "space-between",
    };
    try {
      list=this.props.logs
      if (!list) {
        return;
      }
      let showLoader = EagleEyeAppStore.getShowSearchCardLoader();
      if (showLoader) {
        return (
          <MaterialBox style={{margin: 50}}>
            <PlatformLoaderCard />
          </MaterialBox>
        );
      }

    } catch (err) {
      console.log(err);
    }
    if (list) {
      list.map((item,index) => {
        renderedList.push(
          <MaterialBox key={index}>
            <MaterialBox style={{...platformListItemStyle}}>
              <MaterialPaper>
                {item}
              </MaterialPaper>
            </MaterialBox>
          </MaterialBox>
        );
        return [];
      });
    }
    return renderedList;
  }


  _renderLogsCard () {
    return (
      <MaterialBox
        style={{display: "flex", flexDirection: "column", marginTop: "10px"}}
      >
        <MaterialPaper style={{fontSize: 20}}>Activity Log</MaterialPaper>
        <MaterialBox style={{marginTop: 10}}>{this._renderLogs()}</MaterialBox>
      </MaterialBox>
    );
  }


  render() {
    return (
      <PlatformObjectCard width={600} backgroundColor={config.color_8}>
        {this._renderLogsCard()}
      </PlatformObjectCard>
    )
  }
}


PlatformActivityLog.displayName = "PlatformActivityLog";
export default withRouter(observer(PlatformActivityLog));
