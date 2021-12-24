import React, { Component } from 'react';
import { observer} from "mobx-react";
import {withRouter} from 'react-router-dom'
import {
  MaterialBox, MaterialDivider, MaterialCheckbox,
  MaterialTextField
} from 'web-app/apps/platform/components/material'
import SearchIcon from '@material-ui/icons/Search'
import EagleEyeAppStore from 'web-app/apps/eagle-eye/stores/EagleEyeApp.store'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react.js'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react.js'
import theme from 'web-app/themes/Basic.theme'
import PlatformBasicButton from 'web-app/apps/platform/components/PlatformBasicButton.react'
import {config} from 'web-app/ui-configs/Retro.config'
class EagleEyeAppsListCard extends Component {
  async componentDidMount () {
let x=localStorage.getItem("userGroups");
    console.log(x);
    await EagleEyeAppStore.fetchApps()
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
      list=EagleEyeAppStore.getApps()
      if (!list) {
        return
      }
      let showLoader = EagleEyeAppStore.getShowSearchCardLoader()
      if (showLoader) {
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
    if (list) {
      list.map((item) => {
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
                    let selectedItems=EagleEyeAppStore.getSelectedItems()
                    if (selectedItems && Object.keys(selectedItems).length > 0){
                      if (id in selectedItems) {
                        delete selectedItems[id]
                      } else {
                        selectedItems[id]=item
                      }
                    } else {
                      selectedItems={}
                      selectedItems[id]=item
                    }
                    EagleEyeAppStore.setSelectedItems(selectedItems)
                  }}
                />
              </MaterialBox>
              <MaterialBox style={ { flex: 2 } }>
                { item.displayName }
              </MaterialBox>
            </MaterialBox>
            <MaterialDivider />
          </MaterialBox>
       )
        return null
      })
    }
    return renderedList
  }


  _renderSearchCard () {
    let searchText = EagleEyeAppStore.getSearchText()
    let showPrevButton=false
    let showNextButton=false
    let pageNum = EagleEyeAppStore.getSearchPageNum()
    let pageItemCount = EagleEyeAppStore.getSearchPageItemCount()
    let searchResultsItemCount = EagleEyeAppStore.getSearchResultsItemCount()
    if (searchResultsItemCount > (pageNum * pageItemCount)) {
      showNextButton = true
    }
    if (pageNum > 0) {
      showPrevButton=true
    }
    return (
      <MaterialBox style={ { display: 'flex', flexDirection: 'column' } }>
        <MaterialBox style={ { display: 'flex', alignItems: 'center' } }>
          <MaterialBox style={ { flex: 1 } }>
            <MaterialTextField fullWidth variant='outlined' size='small'
              label='Search'
              value={ searchText ? searchText : '' }
              onChange={ (event) => {
                EagleEyeAppStore.setSearchText(event.target.value)
              } }
              onKeyDown={
                async (event) => {
                  if (event.key === 'Enter') {
                    EagleEyeAppStore.setSearchPageNum(0)
                    await EagleEyeAppStore.fetchApps()
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
                EagleEyeAppStore.setSearchPageNum(0)
                await EagleEyeAppStore.fetchApps()
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
                  await EagleEyeAppStore.onClickPageOp('PREV')
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
                  EagleEyeAppStore.onClickPageOp('NEXT')
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
      <PlatformObjectCard width={600} backgroundColor={config.color_8}>
        {this._renderSearchCard()}
      </PlatformObjectCard>
    )
  }
}

EagleEyeAppsListCard.displayName = 'EagleEyeAppsListCard';

  export default withRouter(observer(EagleEyeAppsListCard));
