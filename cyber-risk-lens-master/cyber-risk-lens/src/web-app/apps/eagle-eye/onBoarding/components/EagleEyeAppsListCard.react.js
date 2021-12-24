import React, { Component } from 'react';
import { observer } from "mobx-react";
import {
  MaterialBox, MaterialDivider, MaterialCheckbox,
  MaterialTextField
} from 'web-app/apps/platform/components/material'
import SearchIcon from '@material-ui/icons/Search'
import EagleEyeAppStore from 'web-app/apps/eagle-eye/stores/EagleEyeApp.store.js'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react.js'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react.js'
import theme from 'web-app/themes/Basic.theme'
import {config} from 'web-app/ui-configs/Retro.config'
class EagleEyeAppsListCard extends Component {
  async componentDidMount() {
    await EagleEyeAppsStore.fetchApps()
  }


  _renderSearchResults() {
    console.log('_renderSearchResults')
    let showLoader=EagleEyeAppsStore.getShowSearchCardLoader()
    if (showLoader) {
      return (
        <MaterialBox style={{margin: 50}}>
          <PlatformLoaderCard/>
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
    let dataList=EagleEyeAppsStore.getApps()
    console.log(dataList)
    let renderedList=[]
    if (dataList) {
      dataList.map((item)=> {
        renderedList.push(
          <MaterialBox
            key={item.id}
          >
            <MaterialBox style={platformListItemStyle}>
              <MaterialBox>
                <MaterialCheckbox
                  value={item.id}
                  style={{color: theme.primaryLight, height: 10}}
                  // onChange={(event)=>{
                  //   let id=event.target.value
                  //   let selectedItems=EatioManagerListingsStore.getSelectedItems()
                  //   if (selectedItems && Object.keys(selectedItems).length > 0){
                  //     if (id in selectedItems) {
                  //       delete selectedItems[id]
                  //     } else {
                  //       selectedItems[id]=item
                  //     }
                  //   } else {
                  //     selectedItems={}
                  //     selectedItems[id]=item
                  //   }
                  //   EatioManagerListingsStore.setSelectedItems(selectedItems)
                  // }}
                />
              </MaterialBox>
              <MaterialBox style={{flex: 4}}>
                {item.name}
              </MaterialBox>
              <MaterialBox style={{flex: 1}}>
                {item.status}
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


  _renderSearchCard() {
    let searchText=EagleEyeAppsStore.getSearchText()
    // let showPrevButton=false
    // let showNextButton=false
    // let pageNum=EatioManagerItemsStore.getSearchPageNum()
    // let pageItemCount=EatioManagerItemsStore.getSearchPageItemCount()
    // let searchResultsItemCount=EatioManagerItemsStore.getSearchResultsItemCount()
    // if (searchResultsItemCount > (pageNum*pageItemCount)){
    //   showNextButton=true
    // }
    // if (pageNum>0){
    //   showPrevButton=true
    // }
    return (
      <MaterialBox style={{display: 'flex', flexDirection: 'column'}}>
        <MaterialBox style={{display: 'flex', alignItems: 'center'}}>
          <MaterialBox style={{flex: 1}}>
            <MaterialTextField fullWidth variant='outlined' size='small'
              label='Search'
              value={searchText ? searchText : ''}
              onChange={(event)=>{
                EagleEyeAppsStore.setSearchText(event.target.value)
              }}
              onKeyDown={
                async (event)=>{
                  if (event.key==='Enter') {
                    // EatioManagerItemsStore.setShowSearchCardLoader(true)
                    EagleEyeAppsStore.setSearchPageNum(0)
                    await EagleEyeAppsStore.fetchApps()
                    // EatioManagerItemsStore.setShowSearchCardLoader(false)
                  }
                }
              }
            />
          </MaterialBox>
          <MaterialBox style={{marginLeft: 20}} >
            <SearchIcon
              style={{color: theme.color1, fontSize: 25, cursor: 'pointer'}}
              size='medium'
              // onClick={async ()=>{
              //   EatioManagerItemsStore.setShowSearchCardLoader(true)
              //   await EatioManagerItemsStore.fetchItems()
              //   EatioManagerItemsStore.setShowSearchCardLoader(false)
              // }}
            />
          </MaterialBox>
        </MaterialBox>
        <MaterialBox style={{marginTop: 30}}>
          {this._renderSearchResults()}
        </MaterialBox>
        {/* <MaterialBox style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
          <MaterialBox>
            <PlatformButton
              radius={50}
              bgColor={theme.color2}
              borderColor={showPrevButton ? theme.color1 : theme.color3}
              fontColor={showPrevButton ? theme.color1 : theme.color3}
              onClick={async ()=>{
                if (showPrevButton) {
                  await EatioManagerItemsStore.onClickPageOp('PREV')
                }
              }}
            >
              {'prev'}
            </PlatformButton>
          </MaterialBox>
          <MaterialBox style={{marginLeft: 20}}>
            <PlatformButton
              radius={50}
              bgColor={theme.color2}
              borderColor={showNextButton ? theme.color1 : theme.color3}
              fontColor={showNextButton ? theme.color1 : theme.color3}
              onClick={async ()=>{
                if (showNextButton) {
                  await EatioManagerItemsStore.onClickPageOp('NEXT')
                }

              }}
            >
              {'next'}
            </PlatformButton>
          </MaterialBox>
        </MaterialBox> */}
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

EagleEyeAppsListCard.displayName='EagleEyeAppsListCard';
export default observer(EagleEyeAppsListCard);
