import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const MaterialSwipeableDrawer = props => {
  function _renderMaterialSwipeableDrawer(): React.Node {
    return <SwipeableDrawer {...props} />;
  }

  return _renderMaterialSwipeableDrawer();
};

MaterialSwipeableDrawer.displayName = 'MaterialSwipeableDrawer';

export default MaterialSwipeableDrawer;
