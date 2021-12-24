import React, { Component } from 'react';
import {
  MaterialBox, MaterialCircularProgress
} from 'web-app/apps/platform/components/material'


class PlatformLoaderCard extends Component {
  render() {
    return (
      <MaterialBox style={{flex: 1, textAlign: 'center'}}>
        <MaterialCircularProgress />
      </MaterialBox>
    )
  }
}


PlatformLoaderCard.displayName='PlatformLoaderCard';
export default PlatformLoaderCard