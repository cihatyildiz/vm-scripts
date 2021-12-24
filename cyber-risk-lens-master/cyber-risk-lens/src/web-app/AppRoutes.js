import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Cookies from 'universal-cookie';
// import {
//   MaterialCard
// } from './../themes/material'
import Apps from './apps'
import EagleEyeApp from './apps/eagle-eye'
import UserApp from './apps/user'
import graphql from '../libs/graphql/GraphQL.lib';

class AppRoutes extends Component {

  async componentDidMount () {
    let whitelist = [
      '/user'
    ]
    if ( whitelist.includes( window.location.pathname ) ) {
      return
    }
    let cookies = new Cookies()
    const sessionId = cookies.get( 'sessionId' )
    if ( sessionId ) {
      const query = `
        query {
          userSessionById(id: "${sessionId }") {
            id
            userId
            status
          }
        }
      `
      let response = await graphql( query )
      if ( response.status === 200 ) {
        if ( !response.data.data.userSessionById ) {
          window.location.assign( '/user' )
        }
        if ( response.data.data.userSessionById.status !== 'ACTIVE' ) {
          window.location.assign( '/user' )
        }
        cookies.set( 'userId', response.data.data.userSessionById.userId )
      }
    } else {
      window.location.assign( '/user' )
    }
  }

  render() {
    return (
      <div>
        <Router>
        <Switch>
          <Route
            path = { '/apps' }
            component = { Apps }
          />
          <Route
            path = { '/eagle-eye' }
            component = { EagleEyeApp }
          />
          <Route
            path = { '/user' }
            component = { UserApp }
          />
          <Route
            path = { '/' }
            component = { Apps }
          />
        </Switch>
      </Router>
    </div>
    );
  }
}

AppRoutes.displayName = 'AppRoutes';
export default AppRoutes;
