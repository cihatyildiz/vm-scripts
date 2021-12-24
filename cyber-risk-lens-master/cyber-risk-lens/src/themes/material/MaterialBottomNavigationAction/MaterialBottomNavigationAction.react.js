import React from 'react';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const MaterialBottomNavigationAction = props => {
  function _renderMaterialBottomNavigationAction(): React.Node {
    return <BottomNavigationAction {...props} />;
  }

  return _renderMaterialBottomNavigationAction();
};

MaterialBottomNavigationAction.displayName = 'MaterialBottomNavigationAction';

export default MaterialBottomNavigationAction;
