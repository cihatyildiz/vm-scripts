import React, { Component } from 'react';
import { observer } from "mobx-react";
import {
  MaterialBox
} from 'web-app/apps/platform/components/material'


class PlatformObjectCard extends Component {
  render () {
    console.log(this.props.backgroundColor)
    return(
      <MaterialBox style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', width: this.props.width,
        backgroundColor:this.props.backgroundColor, borderRadius: 5,

      }}>
        <MaterialBox style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          width: '90%', marginTop: 30, marginBottom: 30,
          marginLeft: '5%', marginRight: '5%'
        }}>
          {this.props.children}
        </MaterialBox>
      </MaterialBox>
    )
  }
}

PlatformObjectCard.displayName='PlatformObjectCard';
export default observer(PlatformObjectCard);
