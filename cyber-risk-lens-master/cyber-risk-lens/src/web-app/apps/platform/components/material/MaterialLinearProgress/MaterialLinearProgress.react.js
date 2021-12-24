import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const MaterialLinearProgress = props => {
  function _renderMaterialLinearProgress(): React.Node {
    return <LinearProgress {...props} />;
  }

  return _renderMaterialLinearProgress();
};

MaterialLinearProgress.displayName = 'MaterialLinearProgress';

export default MaterialLinearProgress;
