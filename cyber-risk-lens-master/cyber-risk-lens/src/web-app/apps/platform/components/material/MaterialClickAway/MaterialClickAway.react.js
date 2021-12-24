import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


class MaterialClickAway extends React.Component {
  render() {
    return (
      <ClickAwayListener {...this.props} />
    );
  }
}


export default MaterialClickAway;
