import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';

const MaterialToolbar = props => {
  function _renderMaterialToolbar(): React.Node {
    return <Toolbar {...props} />;
  }

  return _renderMaterialToolbar();
};

MaterialToolbar.displayName = 'MaterialToolbar';

export default MaterialToolbar;
