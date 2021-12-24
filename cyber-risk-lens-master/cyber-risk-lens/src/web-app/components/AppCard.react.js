import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';


class AppCard extends Component {

  async componentDidMount() {
    console.log('hi')
  }


  render() {
    return (
      <div style = {{padding: 10, backgroundColor: 'red'}}>
        <p>Name: {this.props.app_name}</p>
        <p>Owner: {this.props.app_owner}</p>
      </div>
    )
  }
}

AppCard.displayName = 'AppCard';
export default AppCard;