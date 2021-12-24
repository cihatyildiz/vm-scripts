import React, { Component } from 'react'
import { observer } from "mobx-react"
import { Route, BrowserRouter as Router, Switch,withRouter } from 'react-router-dom'
import {
  MaterialBox, MaterialDivider
} from 'web-app/apps/platform/components/material'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import EagleEyePage from 'web-app/apps/eagle-eye/components/EagleEyePage.react'
import PlatformPageTitleCard from 'web-app/apps/platform/components/PlatformPageTitleCard.react.js'
import EagleEyeOnboardingTopNavigationItems
  from 'web-app/apps/eagle-eye/onBoarding/components/EagleEyeOnboardingTopNavigationItems.react'
import EagleEyeAppsListCard from 'web-app/apps/eagle-eye/onBoarding/components/EagleEyeAppsListCard.react'
import EagleEyeAppsOpCard from 'web-app/apps/eagle-eye/onBoarding/components/EagleEyeAppsOpCard.react'
import theme from 'web-app/themes/Basic.theme'
import PlatformIconButtonCard from 'web-app/apps/platform/components/PlatformIconButtonCard.react'


class EagleEyeOnboardingAppsPage extends Component {
  _renderButtons() {
    return (
      <MaterialBox style={{display: 'flex', alignItems: 'center', color: theme.primaryLight}}>
        <PlatformIconButtonCard>
          <AddIcon
            onClick={()=>{
              window.location.assign('/eagle-eye/on-boarding/apps/create')
            }}
          />
        </PlatformIconButtonCard>
        <PlatformIconButtonCard style={{marginLeft: 10}}>
          <EditIcon
            fontSize='small'
            onClick={()=>{
              // EatioManagerListingsStore.onClickUpdateIcon()
            }}
          />
        </PlatformIconButtonCard>
      </MaterialBox>
    )
  }


  render() {
    return (
        <MaterialBox style={{width: '100%'}}>
          <PlatformPageTitleCard title='Apps' buttons={this._renderButtons()}/>
          <MaterialBox>
            <Router>
              <Switch>
                <Route exact
                  path={ '/eagle-eye/apps' }
                  component={ EagleEyeAppsOpCard }
                />
                <Route exact
                  path={ '/eagle-eye/on-boarding/apps/update' }
                  component={ EagleEyeAppsOpCard }
                />
                <Route exact
                  path={ '/eagle-eye/on-boarding/apps/list' }
                  component={ EagleEyeAppsListCard }
                />
              </Switch>
            </Router>
          </MaterialBox>
        </MaterialBox>
    )
  }
}

EagleEyeOnboardingAppsPage.displayName='EagleEyeOnboardingAppsPage';
export default withRouter(observer(EagleEyeOnboardingAppsPage));
