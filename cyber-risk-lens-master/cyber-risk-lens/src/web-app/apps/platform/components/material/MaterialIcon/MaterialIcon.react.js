import React from 'react';
import Icon  from '@material-ui/core/Icon';

const MaterialIcon = props => {
  function _renderMaterialIcon(): React.Node {
    return <Icon {...props} />;
  }

  return _renderMaterialIcon();
};

MaterialIcon.displayName = 'MaterialIcon';

export default MaterialIcon;
