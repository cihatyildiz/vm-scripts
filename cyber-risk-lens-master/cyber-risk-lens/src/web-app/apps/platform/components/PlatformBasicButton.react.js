import React, { Component } from 'react'


class PlatformBasicButton extends Component {
  render() {
    return (
      <button 
        style={{
          backgroundColor: this.props.bgColor,
          border: 0,
          borderColor: this.props.borderColor,
          borderWidth: 2, 
          borderStyle: 'solid',
          borderRadius: this.props.radius,
          color: this.props.fontColor, 
          cursor: 'pointer',
          fontSize: 14,
          paddingTop: 6,
          paddingBottom: 6, 
          paddingLeft: 15, 
          paddingRight: 15
        }}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    )
  }
}


PlatformBasicButton.displayName='PlatformBasicButton';
export default PlatformBasicButton;