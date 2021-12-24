import React from 'react';
import Grow from '@material-ui/core/Grow';

const MaterialGrow = props => {
  function _renderMaterialGrow(): React.Node {
    return <Grow {...props} />;
  }

  return _renderMaterialGrow();
};

MaterialGrow.displayName = 'MaterialGrow';

export default MaterialGrow;
