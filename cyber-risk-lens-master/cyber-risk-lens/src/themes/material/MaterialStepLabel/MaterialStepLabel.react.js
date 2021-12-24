import React from 'react';
import StepLabel from '@material-ui/core/StepLabel';

const MaterialStepLabel = props => {
  function _renderMaterialStepLabel(): React.Node {
    return <StepLabel {...props} />;
  }

  return _renderMaterialStepLabel();
};

MaterialStepLabel.displayName = 'MaterialStepLabel';

export default MaterialStepLabel;
