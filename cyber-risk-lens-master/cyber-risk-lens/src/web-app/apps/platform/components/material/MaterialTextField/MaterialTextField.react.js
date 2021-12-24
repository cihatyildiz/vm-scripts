import React from 'react';
import TextField from '@material-ui/core/TextField';

const MaterialTextField = props => {
  function _renderMaterialTextField(): React.Node {
    return <TextField {...props} />;
  }

  return _renderMaterialTextField();
};

MaterialTextField.displayName = 'MaterialTextField';

export default MaterialTextField;
