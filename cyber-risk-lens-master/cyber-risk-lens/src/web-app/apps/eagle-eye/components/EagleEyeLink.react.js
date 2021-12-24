import React, { Component } from 'react';
import {config} from 'web-app/ui-configs/Retro.config'

class EagleEyeLink extends Component {
  render() {
    return (
      <a href={this.props.children} style = {{color: config.color_6}}>{this.props.children}</a>
    )
  }
}

EagleEyeLink.displayName = 'EagleEyeLink';
export default EagleEyeLink;
