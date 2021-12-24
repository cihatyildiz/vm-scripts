import React, { Component } from 'react'
import { Slide } from 'react-reveal'
import CloseIcon from '@material-ui/icons/Close'
import {
  MaterialBox, MaterialDialog, MaterialDialogContent,
  MaterialDialogTitle,
  MaterialDivider
} from '../components/material'
class PlatformPopUpCard extends Component {
  render () {
    return (
      <MaterialDialog
        open={ this.props.isOpen ? this.props.isOpen : false }
        onClose={ this.props.onClose }
        fullScreen style={ { margin: '5%'} }

      >
        <MaterialDialogTitle>
          <MaterialBox style={ {
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', paddingTop: 5
          } }>
            <MaterialBox>
              { this.props.title }
            </MaterialBox>
            <MaterialBox style={ {
              display: 'flex', alignItems: 'center', cursor: 'pointer'
            } }>
              <CloseIcon onClick={ () => this.props.onClose() } />
            </MaterialBox>
          </MaterialBox>
        </MaterialDialogTitle>
        <MaterialDivider />
        <Slide up>
          <MaterialDialogContent style={ { padding: 0 } }>
            <MaterialBox style={ { display: 'flex' } }>
              { this.props.children }
            </MaterialBox>
          </MaterialDialogContent>
        </Slide>
      </MaterialDialog>
    )
  }
}
PlatformPopUpCard.displayName = 'PlatformPopUpCard';
export default PlatformPopUpCard;





