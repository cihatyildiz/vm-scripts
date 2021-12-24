import React, { Component } from 'react';
import {
  MaterialBox
} from 'web-app/apps/platform/components/material'


class PlatformPageTitleCard extends Component {
  render() {
    return (
      <MaterialBox style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 10, marginBottom: 30
      }}>
        <MaterialBox style={{
          fontSize: 30
        }}>
          {this.props.title}
        </MaterialBox>
        <MaterialBox>
          {this.props.buttons}
        </MaterialBox>
      </MaterialBox>
    )
  }
}


PlatformPageTitleCard.displayName='PlatformPageTitleCard';
export default PlatformPageTitleCard;