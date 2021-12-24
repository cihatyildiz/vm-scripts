import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import {
  MaterialGrid,
  MaterialBox,
  MaterialButton,
  MaterialSnackbar,
  MaterialTextField,
} from 'themes/material';
import CyberRiskLensHeader from 'web-app/components/CyberRiskLensHeader.react'
import {config} from 'web-app/ui-configs/Retro.config'
import graphql from '../../../libs/graphql/GraphQL.lib';
import {observer} from "mobx-react";
import AuthStore from 'web-app/apps/user/stores/auth.store'
import {withRouter, Redirect} from "react-router-dom";

class User extends Component {
  constructor (props) {
  super(props)
}
  state = {
    userCreds: {
      id: null,
      password: null,
    },
    show: {},
    loading: {},
    error: {
      userSignIn: {
        status: false,
        msg: null
      }
    }
  }


  _onChangeUserID(userId) {
    let userCreds = this.state.userCreds
    userCreds.id = userId.toLowerCase()
    this.setState({userCreds: userCreds})
  }


  _onChangeUserPassword(userPassword) {
    let userCreds = this.state.userCreds
    userCreds.password = userPassword
    this.setState({userCreds: userCreds})
  }


  async _onClickSignIn () {
    if (this.state.userCreds.id && this.state.userCreds.password) {
      try {
        const query = `
        mutation {
          userAuthenticate  (username: "${this.state.userCreds.id}", password: "${this.state.userCreds.password}"){
            id
            userId
            status
          }
        }
        `;
        let response = await graphql(query)
        if ( response.status === 200 ) {
          if ( response.data && response.data.data.userAuthenticate ) {
            let sessionId = response.data.data.userAuthenticate.id
            let userId = response.data.data.userAuthenticate.userId;
            const cookies = new Cookies();
            cookies.set('sessionId', sessionId, { path: '/' });
            cookies.set('username', this.state.userCreds.id)
            await AuthStore.fetchUserGroups(userId).then(async (res) => {
              await AuthStore.setIsAuthenticated(true).then(async(res1) => {
                  await window.location.assign('/apps')
              })

            }).catch((err) => {

              console.log(err)
            })

          } else {
            let error = this.state.error
            error.userSignIn.status = true
            error.userSignIn.msg = 'Invalid Credentials. Please try again !'
            this.setState({error: error})
          }
        }
      } catch (err) {
        throw 'USER_SIGN_IN_EXCEPTION'
      }
    }

  }


  _renderUserSignInError() {
    const onSnackBarClose = () => {
      let error = this.state.error
      error.userSignIn.status = false
      error.userSignIn.msg = null
      this.setState({error: error})
    }
    return (
      <MaterialSnackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.error.userSignIn.status}
        autoHideDuration={2000}
        onClose={onSnackBarClose}
        message={<span>{this.state.error.userSignIn.msg}</span>}
      />
    )
  }


  render() {
    return (
      <MaterialGrid
        container
        direction="row"
        justify="center"
        style={{
          position: "absolute",
          backgroundColor: config.color_1,
          minHeight: "100%",
        }}
      >
        <MaterialGrid item md={12} style={{padding: 15, height: "10%"}}>
          <CyberRiskLensHeader title="Cyber Risk" />
        </MaterialGrid>
        <MaterialGrid
          item
          md={4}
          style={{height: "90%", paddingBottom: 150}}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              await this._onClickSignIn();
            }
          }}
        >
          <MaterialBox
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <MaterialBox style={{flex: 1, padding: 15, textAlign: "center"}}>
              <MaterialTextField
                variant="outlined"
                style={{
                  backgroundColor: "white",
                  width: "80%",
                  textTransformation: "none",
                  overflow: "hidden",
                  borderRadius: 5,
                }}
                placeholder="Enter your email id, ex- xxxx@delta.org"
                value={this.state.userCreds.userId}
                onChange={(event) => this._onChangeUserID(event.target.value)}
              />
            </MaterialBox>
            <MaterialBox style={{flex: 1, padding: 15, textAlign: "center"}}>
              <MaterialTextField
                variant="outlined"
                type="password"
                style={{
                  backgroundColor: "white",
                  width: "80%",
                  textTransformation: "none",
                  overflow: "hidden",
                  borderRadius: 5,
                }}
                placeholder="Enter your password"
                value={this.state.userCreds.userPassword}
                onChange={(event) =>
                  this._onChangeUserPassword(event.target.value)
                }
              />
            </MaterialBox>
          </MaterialBox>
          <MaterialBox style={{flex: 1, padding: 15, textAlign: "center"}}>
            <MaterialButton
              style={{
                backgroundColor: config.color_3,
                borderRadius: 20,
                textTransform: "capitalize",
                paddingLeft: 20,
                paddingRight: 20,
              }}
              onClick={async () => await this._onClickSignIn()}
            >
              Sign In
            </MaterialButton>
          </MaterialBox>
          {this._renderUserSignInError()}
        </MaterialGrid>
      </MaterialGrid>
    );
  }
}
User.displayName = 'User';
export default observer(User);
