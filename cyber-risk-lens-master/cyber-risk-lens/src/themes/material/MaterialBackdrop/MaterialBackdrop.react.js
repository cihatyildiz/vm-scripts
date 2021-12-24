import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';

const MaterialBackdrop = props => {
  function _renderMaterialBackdrop(): React.Node {
    return <Backdrop {...props} />;
  }

  return _renderMaterialBackdrop();
};

MaterialBackdrop.displayName = 'MaterialBackdrop';

export default MaterialBackdrop;
