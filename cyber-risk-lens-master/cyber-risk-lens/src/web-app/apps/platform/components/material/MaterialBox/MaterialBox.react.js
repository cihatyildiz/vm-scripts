import React from 'react';
import Box from '@material-ui/core/Box';

const MaterialBox = props => {
  function _renderMaterialBox(): React.Node {
    return <Box {...props} />;
  }

  return _renderMaterialBox();
};

MaterialBox.displayName = 'MaterialBox';

export default MaterialBox;
