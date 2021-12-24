import React, { Component } from 'react';
import {
  MaterialBox
} from 'web-app/apps/platform/components/material'


class PlatformIconButtonCard extends Component {
  render() {
    return (
      <MaterialBox style={{cursor: 'pointer', margin: 5}}>
        {this.props.children}
      </MaterialBox>
    )
  }
}


PlatformIconButtonCard.displayName='PlatformIconButtonCard';
export default PlatformIconButtonCard