import React from 'react';
import StepIcon from '@material-ui/core/StepIcon';

const MaterialStepIcon = props => {
  function _renderMaterialStepIcon(): React.Node {
    return <StepIcon {...props} />;
  }

  return _renderMaterialStepIcon();
};

MaterialStepIcon.displayName = 'MaterialStepIcon';

export default MaterialStepIcon;
