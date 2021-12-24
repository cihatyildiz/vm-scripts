import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

const MaterialMenuItem = props => {
  function _renderMaterialMenuItem(): React.Node {
    return <MenuItem {...props} />;
  }

  return _renderMaterialMenuItem();
};

MaterialMenuItem.displayName = 'MaterialMenuItem';

export default MaterialMenuItem;
