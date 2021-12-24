import React from 'react';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';

const MaterialTouchRipple = props => {
  function _renderMaterialTouchRipple(): React.Node {
    return <TouchRipple {...props} />;
  }

  return _renderMaterialTouchRipple();
};

MaterialTouchRipple.displayName = 'MaterialTouchRipple';

export default MaterialTouchRipple;
