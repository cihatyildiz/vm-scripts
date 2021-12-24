import React, { Component } from 'react';
import {
  MaterialBox
} from 'web-app/apps/platform/components/material'
import { observer } from "mobx-react";
import Cookies from 'universal-cookie';
import AuthStore from 'web-app/apps/user/stores/auth.store'

class PlatformHeaderCard extends Component {
  _renderTopNavigationCard(items) {
    let renderedItems=[]
    for (let item in items) {
      let isActive=false
      const navItem=items[item]
      if (window.location.pathname.includes(navItem.link)) {
        isActive=true
      }

      renderedItems.push(
        <MaterialBox
          key={Math.random()}
          style={{
            marginRight: 10,
            color: isActive ? this.props.highlightColor : '#34434D',
            cursor: 'pointer',
            fontSize: 16, fontWeight: isActive ? 600 : 100,
          }}
          onClick={()=>window.location.assign(navItem.link)}
        >
          {navItem.name}
        </MaterialBox>
      )
    }
    return (
      <MaterialBox style={{display: 'flex', overflow: 'auto'}}>{renderedItems}</MaterialBox>
    )
  }

  _renderUserProfileCard(username) {
    return (
      <MaterialBox
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <MaterialBox
          style={{
            color: 'white',
            fontWeight: 500,
            cursor: 'pointer',
            color: this.props.highlightColor,
            padding: 5,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 5,
            marginBottom: 5,
          }}
        >
          {username}
        </MaterialBox>
        <MaterialBox>
          <span
            onClick={() => {
              AuthStore.signOut()
            }}
          >
            <img
              alt='logout'
              style={{paddingLeft: 10}}
              width='20px'
              src='https://rc-github.deltads.ent/ca34991/cyber-risk-static-assets/blob/master/signout.png?raw=true'
            />
          </span>
        </MaterialBox>
      </MaterialBox>
    )

  }

  render() {
    let cookies = new Cookies()
    let username = cookies.get('username')
    return (
      <MaterialBox boxShadow={3} style={{
        flex: 1, display: 'flex', height: 50, maxWidth: '100%',
        alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'white'
      }}>
        <MaterialBox style={{
          marginLeft: 10, marginRight: 10, overflow: 'auto'
        }}>
          {this._renderTopNavigationCard(this.props.topNavigationItems)}
        </MaterialBox>
        <MaterialBox style={{display: 'flex', alignItems: 'center'}}>
          <MaterialBox style={{
            marginRight: 15, paddingLeft: 15, paddingRight: 15,
            paddingTop: 5, paddingBottom: 5,
            fontSize: 14, color: 'white',
            borderRadius: 5
          }}>
            {/* {user.defaultOrg.name} */}
            {/* Pankaj */}
            {this._renderUserProfileCard(username)}
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }
}


PlatformHeaderCard.displayName='PlatformHeaderCard';
export default observer(PlatformHeaderCard);
