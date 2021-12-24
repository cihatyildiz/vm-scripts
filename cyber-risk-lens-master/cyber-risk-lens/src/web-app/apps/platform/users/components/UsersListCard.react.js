import React, { Component } from 'react';
import { observer } from "mobx-react";
import {withRouter,Redirect } from 'react-router-dom'
import {
  MaterialBox, MaterialDivider, MaterialCheckbox,
  MaterialTextField
} from 'web-app/apps/platform/components/material'
import SearchIcon from '@material-ui/icons/Search'
import UserStore from 'web-app/apps/platform/stores/User.store.js'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react.js'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react.js'
import theme from 'web-app/themes/Basic.theme'
import PlatformBasicButton from 'web-app/apps/platform/components/PlatformBasicButton.react'
import {config} from 'web-app/ui-configs/Retro.config'
class UsersListCard extends Component {
  async componentDidMount () {
    await UserStore.fetchUsers()
  }


  _renderSearchResults () {
    console.log( '_renderSearchResults' )
    let userList=UserStore.getUsers()
    let showLoader = UserStore.getShowSearchCardLoader()
    if ( showLoader ) {
      return (
        <MaterialBox style={ { margin: 50 } }>
          <PlatformLoaderCard />
        </MaterialBox>
      )
    }
    const platformListItemStyle = {
      borderRadius: 2,
      display: 'flex',
      fontSize: 14,
      padding: 8,
      paddingTop: 10.5,
      textAlign: 'left',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
    let dataList =userList
    console.log( dataList )
    let renderedList = []
    if ( dataList ) {
      dataList.map( ( item ) => {
        renderedList.push(
          <MaterialBox
            key={ item.id }
          >
            <MaterialBox style={ {...platformListItemStyle} }>
              <MaterialBox>
                <MaterialCheckbox
                  value={ item.id }
                  style={ { color: theme.primaryLight, height: 10 } }
                  onChange={(event)=>{
                    let id=event.target.value
                    let selectedUsers=UserStore.getSelectedUsers()
                    if ( selectedUsers && Object.keys( selectedUsers).length > 0){
                      if ( id in selectedUsers) {
                        delete selectedUsers[id]
                      } else {
                        selectedUsers[id]=item
                      }
                    } else {
                      selectedUsers={}
                      selectedUsers[id]=item
                    }
                    UserStore.setSelectedUsers( selectedUsers)
                  }}
                />
              </MaterialBox>
              <MaterialBox style={ { flex: 2 } }>
                { item.username }
              </MaterialBox>
              <MaterialBox style={{ flex: 1 }}>
                {item.name}
              </MaterialBox>
            </MaterialBox>
            <MaterialDivider />
          </MaterialBox>
        )
        return null
      } )
    }
    return renderedList
  }


  _renderSearchCard () {
    let searchText = UserStore.getSearchText()
    let showPrevButton=false
    let showNextButton=false
    let pageNum = UserStore.getSearchPageNum()
    let pageItemCount = UserStore.getSearchPageItemCount()
    let searchResultsItemCount = UserStore.getSearchResultsItemCount()
    if ( searchResultsItemCount > ( pageNum * pageItemCount ) ) {
      showNextButton = true
    }
    if ( pageNum > 0 ) {
      showPrevButton=true
    }
    return (
      <MaterialBox style={ { display: 'flex', flexDirection: 'column' } }>
        <MaterialBox style={ { display: 'flex', alignItems: 'center' } }>
          <MaterialBox style={ { flex: 1 } }>
            <MaterialTextField fullWidth variant='outlined' size='small'
              label='Search'
              value={ searchText ? searchText : '' }
              onChange={ ( event ) => {
                UserStore.setSearchText( event.target.value )
              } }
              onKeyDown={
                async ( event ) => {
                  if ( event.key === 'Enter' ) {
                    UserStore.setSearchPageNum( 0 )
                    await UserStore.fetchUsers()
                  }
                }
              }
            />
          </MaterialBox>
          <MaterialBox style={ { marginLeft: 20 } } >
            <SearchIcon
              style={ { color: theme.color1, fontSize: 25, cursor: 'pointer' } }
              size='medium'
              onClick={async ()=>{
                UserStore.setSearchPageNum( 0 )
                await UserStore.fetchUsers()
            }}
            />
          </MaterialBox>
        </MaterialBox>
        <MaterialBox style={ { marginTop: 30 } }>
          { this._renderSearchResults() }
        </MaterialBox>
        <MaterialBox style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
          <MaterialBox>
            <PlatformBasicButton
              radius={50}
              bgColor={theme.primaryDark}
              borderColor={showPrevButton ? theme.primaryDark : theme.primaryLight}
              fontColor={showPrevButton ? theme.textPrimary : theme.textSeondary}
              onClick={async ()=>{
                if (showPrevButton) {
                  await UserStore.onClickPageOp( 'PREV' )
                }
              }}
            >
              {'prev'}
            </PlatformBasicButton>
          </MaterialBox>
          <MaterialBox style={{marginLeft: 20}}>
            <PlatformBasicButton
              radius={50}
              bgColor={theme.primaryDark}
              borderColor={showNextButton ? theme.primaryDark : theme.primaryLight}
              fontColor={showNextButton ? theme.textPrimary : theme.textSeondary}
              onClick={async ()=>{
                if (showNextButton) {
                  UserStore.onClickPageOp( 'NEXT' )
                }

              }}
            >
              {'next'}
            </PlatformBasicButton>
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }


  render () {
    if ( UserStore.getSelectedUsers()) {
      return <Redirect to={ '/platform/users/update' } />
    }
    return (
      <PlatformObjectCard width={ 600 } backgroundColor={config.color_8}>
        { this._renderSearchCard() }
      </PlatformObjectCard>
    )
  }
}

UsersListCard.displayName = 'UsersListCard';
export default withRouter(observer( UsersListCard ));
