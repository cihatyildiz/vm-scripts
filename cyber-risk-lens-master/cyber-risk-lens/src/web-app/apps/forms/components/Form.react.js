import React, { Component } from 'react';
import { observer } from "mobx-react";
import {withRouter,Redirect } from 'react-router-dom'
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import DoneIcon from '@material-ui/icons/Done';
import {
  MaterialBox, MaterialDivider, MaterialCheckbox,
  MaterialTextField
} from 'web-app/apps/platform/components/material'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react.js'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react.js'
import theme from 'web-app/themes/Basic.theme'
import PlatformBasicButton from 'web-app/apps/platform/components/PlatformBasicButton.react'

class Form extends Component {
  render() {
    return(
      <PlatformObjectCard width={ 600 }>
        Users
        <PlatformBasicButton>Submit</PlatformBasicButton>
      </PlatformObjectCard>
   )
  }
}

Form.displayName = 'Form';
export default withRouter(observer(Form));
