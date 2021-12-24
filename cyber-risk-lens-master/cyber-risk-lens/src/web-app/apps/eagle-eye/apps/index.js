import React, { Component } from 'react';
import { observer } from "mobx-react";
import EagleEyeAppsPage from './EagleEyeAppsPage.react'

class EagleEyeApps extends Component {
  render() {
    return (
      <EagleEyeAppsPage />
    )
  }
}

EagleEyeApps.displayName='EagleEyeApps';
export default observer(EagleEyeApps);
