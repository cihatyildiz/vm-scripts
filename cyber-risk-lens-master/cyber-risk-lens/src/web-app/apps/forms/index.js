import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import formsStore from './stores/forms.store'
import Form from './components/Form.react'

class FormsApp extends Component {
  render() {
    
    return (
      <div>
        Hello
        <Form />
      </div>
    )
  }
}

FormsApp.displayName = 'FormsApp';
export default FormsApp;
