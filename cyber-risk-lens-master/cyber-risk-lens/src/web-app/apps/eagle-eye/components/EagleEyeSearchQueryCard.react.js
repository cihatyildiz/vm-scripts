import React, { Component } from 'react';
import {
  MaterialPaper, 
} from 'themes/material';
import {config} from 'web-app/ui-configs/Retro.config'


class EagleEyeSearchQueryCard extends Component {
  render() {
    return (
      <MaterialPaper style = {{backgroundColor: 'yellow'}}>
      </MaterialPaper>
    )
  }
}

EagleEyeSearchQueryCard.displayName = 'EagleEyeSearchQueryCard';
export default EagleEyeSearchQueryCard;
