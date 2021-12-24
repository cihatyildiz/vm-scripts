import React, { Component } from 'react';
import { Route, BrowserRouter as Router,Switch} from 'react-router-dom';
import EagleEyeVulns from './vulns/EagleEyeVulns.react'
import EagleEyeApps from './apps/index'
import EagleEyePage from 'web-app/apps/eagle-eye/components/EagleEyePage.react'
import EagleEyeLogs from 'web-app/apps/eagle-eye/eagleEyeLogs/eagleEyeLogs.react'

class EagleEyeApp extends Component {
  _renderEagleEyeAppRoutes() {
    return (
      <EagleEyePage>
        <Router>
          <Route path={'/eagle-eye/logs'} component={EagleEyeLogs} />
          <Route path={'/eagle-eye/vulns'} component={EagleEyeVulns} />
          <Route path={'/eagle-eye/apps'} component={EagleEyeApps} />
        </Router>
      </EagleEyePage>
    )
  }


  render() {
    return (
      <div>
        {this._renderEagleEyeAppRoutes()}
      </div>
    )
  }
}

EagleEyeApp.displayName = 'EagleEyeApp';
export default EagleEyeApp;
