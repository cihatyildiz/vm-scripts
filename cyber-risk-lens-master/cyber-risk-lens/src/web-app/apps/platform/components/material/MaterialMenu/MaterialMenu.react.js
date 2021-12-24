import React from 'react';
import Menu from '@material-ui/core/Menu';

const MaterialMenu = props => {
  function _renderMaterialMenu(): React.Node {
    return <Menu {...props} />;
  }

  return _renderMaterialMenu();
};

MaterialMenu.displayName = 'MaterialMenu';

export default MaterialMenu;
