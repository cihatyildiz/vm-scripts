import React from 'react';
import Tab from '@material-ui/core/Tab';

const MaterialTab = props => {
  function _renderMaterialTab(): React.Node {
    return <Tab {...props} />;
  }

  return _renderMaterialTab();
};

MaterialTab.displayName = 'MaterialTab';

export default MaterialTab;
