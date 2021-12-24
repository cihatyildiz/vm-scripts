import React, { Component } from 'react';
import {config} from 'web-app/ui-configs/Retro.config'

class EagleEyeInLineCode extends Component {
  render() {
    return (
      <code style = {{
        color: config.color_2, backgroundColor: 'white',
        paddingLeft: 5, paddingRight: 5, paddingBottom: 2,
        borderRadius: 3,width:'100%'}}>
        {this.props.children}
      </code>
    )
  }
}

EagleEyeInLineCode.displayName = 'EagleEyeInLineCode';
export default EagleEyeInLineCode;
