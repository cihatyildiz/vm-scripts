import React from 'react';
import AppBar from '@material-ui/core/AppBar';

const MaterialAppBar = props => {
  function _renderMaterialAppBar(): React.Node {
    return <AppBar {...props} />;
  }

  return _renderMaterialAppBar();
};

MaterialAppBar.displayName = 'MaterialAppBar';

export default MaterialAppBar;
