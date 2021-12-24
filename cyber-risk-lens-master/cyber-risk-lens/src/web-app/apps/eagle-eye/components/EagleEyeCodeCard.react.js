import React, { Component } from 'react';
import {
  MaterialBox,
} from 'themes/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

class EagleEyeCodeCard extends Component {
  render() {
    return (
      <MaterialBox style = {{paddingLeft: 15, paddingRight: 15, backgroundColor: 'white', padding: 5, borderRadius: 5, color: 'black'}}>
        <div language = {this.props.language} style = {{padding: 10, margin: 0, background: "white"}}>
          {this.props.children}
        </div>
      </MaterialBox>
    )
  }
}

EagleEyeCodeCard.displayName = 'EagleEyeCodeCard';
export default EagleEyeCodeCard;
