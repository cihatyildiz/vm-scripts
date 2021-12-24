import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const MaterialSnackbar = props => {
  function _renderMaterialSnackbar(): React.Node {
    return <Snackbar {...props} />;
  }

  return _renderMaterialSnackbar();
};

MaterialSnackbar.displayName = 'MaterialSnackbar';

export default MaterialSnackbar;
