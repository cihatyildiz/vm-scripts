import React from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const MaterialSnackbarContent = props => {
  function _renderMaterialSnackbarContent(): React.Node {
    return <SnackbarContent {...props} />;
  }

  return _renderMaterialSnackbarContent();
};

MaterialSnackbarContent.displayName = 'MaterialSnackbarContent';

export default MaterialSnackbarContent;
