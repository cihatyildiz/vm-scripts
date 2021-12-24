import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const MaterialFormControlLabel = props => {
  function _renderMaterialFormControlLabel(): React.Node {
    return <FormControlLabel {...props} />;
  }

  return _renderMaterialFormControlLabel();
};

MaterialFormControlLabel.displayName = 'MaterialFormControlLabel';

export default MaterialFormControlLabel;
