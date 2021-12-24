import React from 'react';
import Portal from '@material-ui/core/Portal';

const MaterialPortal = props => {
  function _renderMaterialPortal(): React.Node {
    return <Portal {...props} />;
  }

  return _renderMaterialPortal();
};

MaterialPortal.displayName = 'MaterialPortal';

export default MaterialPortal;
