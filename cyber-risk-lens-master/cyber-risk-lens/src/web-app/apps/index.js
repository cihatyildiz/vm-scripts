import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Apps from './Apps.react'
import EagleEyeApp from './eagle-eye'
import PlaygroundApp from './playground'
import PlatformApp from './platform'
import FormsApp from './forms'

class AppRoutes extends Component {
  _renderAppRoutes() {
    return (
      <Router>
        <Route
          path = {'/eagle-eye'}
          component = {EagleEyeApp}
        />
        <Route
          path={ '/platform' }
          component={ PlatformApp }
        />
        <Route
          path = {'/playground'}
          component = {PlaygroundApp}
        />
        <Route
          path = {'/apps'}
          component = {Apps}
        />
        <Route exact
          path = {'/forms'}
          component = {FormsApp}
        />
        <Route exact
          path = {'/'}
          component = {Apps}
        />
      </Router>
    )
  }


  render() {
    return (
      <div>
        {this._renderAppRoutes()}
      </div>
    )
  }
}

AppRoutes.displayName = 'Apps';
export default AppRoutes;
