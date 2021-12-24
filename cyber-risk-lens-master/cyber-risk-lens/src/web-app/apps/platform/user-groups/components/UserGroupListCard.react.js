import React, { Component } from 'react';
import { observer } from "mobx-react";
import {withRouter} from 'react-router-dom'
import {
  MaterialBox, MaterialDivider, MaterialCheckbox,
  MaterialTextField
} from 'web-app/apps/platform/components/material'
import SearchIcon from '@material-ui/icons/Search'
import UserGroupStore from 'web-app/apps/platform/stores/UserGroup.store.js'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react.js'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react.js'
import theme from 'web-app/themes/Basic.theme'
import PlatformBasicButton from 'web-app/apps/platform/components/PlatformBasicButton.react'
import {config} from 'web-app/ui-configs/Retro.config';


class UserGroupsListCard extends Component {
  async componentDidMount () {
    await UserGroupStore.fetchUserGroups()
  }


  _renderSearchResults () {
    let list
    let renderedList=[]
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
    try {
      list=UserGroupStore.getUserGroups()
      if (!list) {
        return
      }
      let showLoader = UserGroupStore.getShowSearchCardLoader()
      if ( showLoader ) {
        return (
          <MaterialBox style={ { margin: 50 } }>
            <PlatformLoaderCard />
          </MaterialBox>
        )
      }
      let dataList=list
      let renderedList = []
    } catch (err) {
      console.log(err)
    }
    if ( list ) {
      list.map( ( item ) => {
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
                    let selectedItems=UserGroupStore.getSelectedItems()
                    if ( selectedItems && Object.keys( selectedItems).length > 0){
                      if ( id in selectedItems) {
                        delete selectedItems[id]
                      } else {
                        selectedItems[id]=item
                      }
                    } else {
                      selectedItems={}
                      selectedItems[id]=item
                    }
                    UserGroupStore.setSelectedItems(selectedItems)
                  }}
                />
              </MaterialBox>
              <MaterialBox style={ { flex: 2 } }>
                { item.name }
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
    let searchText = UserGroupStore.getSearchText()
    let showPrevButton=false
    let showNextButton=false
    let pageNum = UserGroupStore.getSearchPageNum()
    let pageItemCount = UserGroupStore.getSearchPageItemCount()
    let searchResultsItemCount = UserGroupStore.getSearchResultsItemCount()
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
                UserGroupStore.setSearchText( event.target.value )
              } }
              onKeyDown={
                async ( event ) => {
                  if ( event.key === 'Enter' ) {
                    UserGroupStore.setSearchPageNum( 0 )
                    await UserGroupStore.fetchUsers()
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
                UserGroupStore.setSearchPageNum( 0 )
                await UserGroupStore.fetchUsers()
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
                  await UserGroupStore.onClickPageOp( 'PREV' )
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
                  UserGroupStore.onClickPageOp( 'NEXT' )
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


  render() {
    return (
      <PlatformObjectCard width={ 600 } backgroundColor={config.color_8}>
        { this._renderSearchCard() }
      </PlatformObjectCard>
    )
  }
}

UserGroupsListCard.displayName = 'UserGroupsListCard';
export default withRouter(observer( UserGroupsListCard ));
