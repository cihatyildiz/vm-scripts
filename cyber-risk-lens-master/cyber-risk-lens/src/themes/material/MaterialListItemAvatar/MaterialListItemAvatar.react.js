import React from 'react';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const MaterialListItemAvatar = props => {
  function _renderMaterialListItemAvatar(): React.Node {
    return <ListItemAvatar {...props} />;
  }

  return _renderMaterialListItemAvatar();
};

MaterialListItemAvatar.displayName = 'MaterialListItemAvatar';

export default MaterialListItemAvatar;
