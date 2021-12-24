import React from 'react';
import Zoom from '@material-ui/core/Zoom';

const MaterialZoom = props => {
  function _renderMaterialZoom(): React.Node {
    return <Zoom {...props} />;
  }

  return _renderMaterialZoom();
};

MaterialZoom.displayName = 'MaterialZoom';

export default MaterialZoom;
