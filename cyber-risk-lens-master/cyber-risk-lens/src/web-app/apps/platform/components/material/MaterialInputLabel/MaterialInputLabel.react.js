import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';

const MaterialInputLabel = props => {
  function _renderMaterialInputLabel(): React.Node {
    return <InputLabel {...props} />;
  }

  return _renderMaterialInputLabel();
};

MaterialInputLabel.displayName = 'MaterialInputLabel';

export default MaterialInputLabel;
