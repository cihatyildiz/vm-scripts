import React, { Component } from 'react';
import DoneIcon from '@material-ui/icons/Done';
import {
  MaterialBox
} from 'web-app/apps/platform/components/material'


class PlatformSuccessCard extends Component {
  render() {
    return (
      <MaterialBox style={{flex: 1, flexDirection: 'column', textAlign: 'center'}}>
        <MaterialBox>
          <DoneIcon style={{fontSize: 100, color: this.props.iconColor}}/>
        </MaterialBox>
        <MaterialBox style={{marginTop: 20, fontWeight: 200, color: this.props.msgColor}}>
          {this.props.msg}
        </MaterialBox>
      </MaterialBox>
    )
  }
}


PlatformSuccessCard.displayName='PlatformSuccessCard';
export default PlatformSuccessCard;