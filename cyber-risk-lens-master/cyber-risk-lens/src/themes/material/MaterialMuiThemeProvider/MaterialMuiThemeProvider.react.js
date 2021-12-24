import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

const MaterialMuiThemeProvider = props => {
  function _renderMaterialMuiThemeProvider(): React.Node {
    return <MuiThemeProvider {...props} />;
  }

  return _renderMaterialMuiThemeProvider();
};

MaterialMuiThemeProvider.displayName = 'MaterialMuiThemeProvider';

export default MaterialMuiThemeProvider;
