import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';

const MaterialMobileStepper = props => {
  function _renderMaterialMobileStepper(): React.Node {
    return <MobileStepper {...props} />;
  }

  return _renderMaterialMobileStepper();
};

MaterialMobileStepper.displayName = 'MaterialMobileStepper';

export default MaterialMobileStepper;
