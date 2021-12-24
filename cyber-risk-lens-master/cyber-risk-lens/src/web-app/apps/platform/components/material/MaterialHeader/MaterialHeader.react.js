import React from 'react';
import AppBar from '@material-ui/core/AppBar';

import Toolbar from '@material-ui/core/Toolbar';
import {
  MaterialPaper,
  MaterialGrid
} from 'themes/material';

import './../material.css'


const MaterialHeader = props => {
  function _renderMaterialHeader() {
    return (
      <AppBar>
        <Toolbar>
          <MaterialGrid container alignItems = 'center'>
            <MaterialGrid item md = {11} lg = {11}>
              <MaterialPaper>
                {props.primary_text} | {props.secondary_text}
              </MaterialPaper>
            </MaterialGrid>
            <MaterialGrid item md = {1} lg = {1}>
              <MaterialPaper className = 'align-right'>
              </MaterialPaper>
            </MaterialGrid>
          </MaterialGrid>
        </Toolbar>

      </AppBar>
    )
  }
  return _renderMaterialHeader();
};

MaterialHeader.displayName = 'MaterialHeader';

export default MaterialHeader;
