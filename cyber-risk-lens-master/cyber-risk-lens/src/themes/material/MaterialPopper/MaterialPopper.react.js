import React from 'react';
import Popper from '@material-ui/core/Popper';

const MaterialPopper = props => {
  function _renderMaterialPopper(): React.Node {
    return <Popper {...props} />;
  }

  return _renderMaterialPopper();
};

MaterialPopper.displayName = 'MaterialPopper';

export default MaterialPopper;
