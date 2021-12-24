import React from 'react';
import IconButton from '@material-ui/core/IconButton';

const MaterialIconButton = props => {
  function _renderMaterialIconButton(): React.Node {
    return <IconButton {...props} />;
  }

  return _renderMaterialIconButton();
};

MaterialIconButton.displayName = 'MaterialIconButton';

export default MaterialIconButton;
