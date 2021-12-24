import React, { Component } from 'react';
import { observer } from "mobx-react";
import {
  MaterialBox, MaterialDivider
} from 'themes/material'
import PlatformFullPage from '../../platform/components/PlatformFullPage.react'
import EagleEyeSideMenuCard from '../components/EagleEyeSideMenuCard.react'
import EagleEyePage from 'web-app/apps/eagle-eye/components/EagleEyePage.react'
import EagleEyeOnboardingTopNavigationItems
  from 'web-app/apps/eagle-eye/onBoarding/components/EagleEyeOnboardingTopNavigationItems.react'


class EagleEyeOnboardingUsersPage extends Component {
  render() {
    return (
      <EagleEyePage topNavigationItems={EagleEyeOnboardingTopNavigationItems}>
        Hello
      </EagleEyePage>
    )
  }
}

EagleEyeOnboardingUsersPage.displayName='EagleEyeOnboardingUsersPage';
export default observer( EagleEyeOnboardingUsersPage );


