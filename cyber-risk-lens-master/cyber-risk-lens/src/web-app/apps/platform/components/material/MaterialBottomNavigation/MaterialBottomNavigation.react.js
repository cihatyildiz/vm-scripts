import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';

const MaterialBottomNavigation = props => {
  function _renderMaterialBottomNavigation(): React.Node {
    return <BottomNavigation {...props} />;
  }

  return _renderMaterialBottomNavigation();
};

MaterialBottomNavigation.displayName = 'MaterialBottomNavigation';

export default MaterialBottomNavigation;
