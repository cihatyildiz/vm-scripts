import React from 'react';
import Avatar from '@material-ui/core/Avatar';

const MaterialAvatar = props => {
  function _renderMaterialAvatar(): React.Node {
    return <Avatar {...props} />;
  }

  return _renderMaterialAvatar();
};

MaterialAvatar.displayName = 'MaterialAvatar';

export default MaterialAvatar;
