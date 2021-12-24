import React from 'react';
import Tabs from '@material-ui/core/Tabs';

const MaterialTabs = props => {
  function _renderMaterialTabs(): React.Node {
    return <Tabs {...props} />;
  }

  return _renderMaterialTabs();
};

MaterialTabs.displayName = 'MaterialTabs';

export default MaterialTabs;
