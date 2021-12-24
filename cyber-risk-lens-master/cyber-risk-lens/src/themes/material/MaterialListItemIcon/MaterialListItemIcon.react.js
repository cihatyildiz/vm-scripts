import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const MaterialListItemIcon = props => {
  function _renderMaterialListItemIcon(): React.Node {
    return <ListItemIcon {...props} />;
  }

  return _renderMaterialListItemIcon();
};

MaterialListItemIcon.displayName = 'MaterialListItemIcon';

export default MaterialListItemIcon;
