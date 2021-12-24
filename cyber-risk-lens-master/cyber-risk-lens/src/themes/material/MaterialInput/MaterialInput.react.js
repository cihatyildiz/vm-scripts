import React from 'react';
import Input from '@material-ui/core/Input';

const MaterialInput = props => {
  function _renderMaterialInput(): React.Node {
    return <Input {...props} />;
  }

  return _renderMaterialInput();
};

MaterialInput.displayName = 'MaterialInput';

export default MaterialInput;
