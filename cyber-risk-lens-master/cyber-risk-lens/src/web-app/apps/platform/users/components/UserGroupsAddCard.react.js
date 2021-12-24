import React, {Component} from "react";
import {observer} from "mobx-react";
import {withRouter, Redirect} from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import DoneIcon from "@material-ui/icons/Done";
import {
  MaterialBox,
  MaterialDivider,
  MaterialCheckbox,
  MaterialTextField,
} from "web-app/apps/platform/components/material";
import UserStore from "web-app/apps/platform/stores/User.store.js";
import PlatformObjectCard from "web-app/apps/platform/components/PlatformObjectCard.react.js";
import PlatformLoaderCard from "web-app/apps/platform/components/PlatformLoaderCard.react.js";
import theme from "web-app/themes/Basic.theme";
import PlatformBasicButton from "web-app/apps/platform/components/PlatformBasicButton.react";
import UserGroupStore from '../../stores/UserGroup.store';
import {config} from 'web-app/ui-configs/Retro.config'
class UserGroupsAddCard extends Component {
  async componentDidMount() {
    await UserGroupStore.fetchUserGroups();
  }

  _renderAddIcon(item) {
    return (
      <AddIcon
        style={{color: theme.color1, cursor: "pointer", marginRight: 10}}
        onClick={() => this.props.onClickAddIcon(item)}
      />
    );
  }

  _renderCheckIcon(item) {
    return (
      <DoneIcon
        style={{color: theme.color1, cursor: "pointer", marginRight: 10}}
        onClick={() => this.props.onClickAddIcon(item)}
      />
    );
  }

  _renderSearchResults() {
    let renderedSearchResults = [];
    let itemIds = this.props.itemIds;
    let items = UserGroupStore.getUserGroups();
    if (!items) {
      return (
        <MaterialBox style={{margin: 50}}>
          <PlatformLoaderCard />
        </MaterialBox>
      );
    }
    items.map((item) => {
      renderedSearchResults.push(
        <MaterialBox key={Math.random()} style={{borderRadius: 2}}>
          <MaterialBox
            style={{
              borderRadius: 2,
              display: "flex",
              fontSize: 14,
              padding: 8,
              paddingTop: 10.5,
              textAlign: "left",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MaterialBox style={{textAlign: "left", paddingTop: 3}}>
              {item.name}
            </MaterialBox>
            {itemIds && itemIds.includes(item.id)
              ? this._renderCheckIcon(item)
              : this._renderAddIcon(item)}
          </MaterialBox>
          <MaterialDivider />
        </MaterialBox>
      );
    });
    return renderedSearchResults;
  }

  _renderSearchBar() {
    let searchText = UserGroupStore.getSearchText();
    return (
      <MaterialBox
        style={{display: "flex", flexDirection: "column", width: "100%"}}
      >
        <MaterialBox style={{display: "flex", alignItems: "center"}}>
          <MaterialBox style={{flex: 1}}>
            <MaterialTextField
              fullWidth
              variant="outlined"
              size="small"
              label="Search"
              value={searchText ? searchText : ""}
              onChange={(event) => {
                UserGroupStore.setSearchText(event.target.value);
              }}
              onKeyDown={async (event) => {
                if (event.key === "Enter") {
                  UserGroupStore.setShowSearchCardLoader(true);
                  UserGroupStore.setSearchPageNum(0);
                  await UserGroupStore.fetchUserGroups();
                  UserStore.setShowSearchCardLoader(false);
                }
              }}
            />
          </MaterialBox>
          <MaterialBox style={{marginLeft: 20}}>
            <SearchIcon
              style={{color: theme.color1, fontSize: 25, cursor: "pointer"}}
              size="medium"
              onClick={async () => {
                UserGroupStore.setShowSearchCardLoader(true);
                await UserGroupStore.fetchItems();
                UserGroupStore.setShowSearchCardLoader(false);
              }}
            />
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    );
  }

  _renderAddCard() {
    return (
      <MaterialBox
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginTop: 50,
        }}
      >
        <MaterialBox
          style={{display: "flex", alignItems: "center", width: "85%"}}
        >
          {this._renderSearchBar()}
        </MaterialBox>
        <MaterialBox
          style={{
            width: "85%",
            maxHeight: 300,
            marginTop: 30,
            overflow: "hidden",
          }}
        >
          {this._renderSearchResults()}
        </MaterialBox>
        <MaterialBox style={{width: "85%", display: "flex", marginTop: 30}}>
          <MaterialBox style={{display: "flex"}}>
            <MaterialBox>
              {/* <PlatformButton
              radius={10}
              bgColor={theme.color1}
              borderColor={theme.color1}
              fontColor={theme.color2}
              onClick={async ()=>{
                this.props.onClose()
              }}
            >
              Back
            </PlatformButton> */}
            </MaterialBox>
            <MaterialBox style={{marginLeft: 20}}>
              {/* <PlatformButton
              radius={10}
              bgColor={theme.color2}
              borderColor={theme.color1}
              fontColor={theme.color1}
              onClick={async ()=>{
                EatioManagerItemsStore.setShowObjectViewMode('CREATE')
              }}
            >
              New
            </PlatformButton> */}
            </MaterialBox>
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    );
  }

  render() {
    return (
      <PlatformObjectCard width={600} backgroundColor={config.color_8}>
        User Groups
        {this._renderAddCard()}
      </PlatformObjectCard>
    );
  }
}

UserGroupsAddCard.displayName = "UserGroupsAddCard";
export default withRouter(observer(UserGroupsAddCard));
