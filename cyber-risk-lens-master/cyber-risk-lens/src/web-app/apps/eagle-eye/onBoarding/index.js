import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { observer } from "mobx-react";
import EagleEyeOnboardingAppsPage from './EagleEyeOnboardingAppsPage.react'

class EagleEyeOnboarding extends Component {
  render() {
    return (
      <Router>
        {/* <Route
            path={ '/eagle-eye/on-boarding/apps' }
            component={ EagleEyeOnboardingAppsPage }
          /> */}
          {/* <Route
            path={ '/eagle-eye/on-boarding/users/list' }
            component={ EagleEyeOnboardingAppsPage }
          />
          <Route
            path={ '/eagle-eye/on-boarding/user-groups/list' }
            component={ EagleEyeOnboardingUserGroupsPage }
          /> */}
      </Router>
    )
  }
}

EagleEyeOnboarding.displayName='EagleEyeOnboarding';
export default observer(EagleEyeOnboarding);
