import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import UserGroupsPage from './user-groups'
import UsersPage from './users/index'


class PlatformApp extends Component {
  _renderPlatformAppRoutes() {
    return (
      <Router>
        <div>
          <Route
            path={ '/platform/users' }
            component={ UsersPage }
          />
          <Route
            path={ '/platform/user-groups' }
            component={ UserGroupsPage }
          />
        </div>
      </Router>
    )
  }


  render() {
    return (
      <div>
        {this._renderPlatformAppRoutes()}
      </div>
    )
  }
}

PlatformApp.displayName = 'PlatformApp';
export default PlatformApp;
