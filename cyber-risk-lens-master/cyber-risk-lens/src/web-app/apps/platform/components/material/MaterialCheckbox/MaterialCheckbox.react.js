import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

const MaterialCheckbox = props => {
  function _renderMaterialCheckbox(): React.Node {
    return <Checkbox {...props} />;
  }

  return _renderMaterialCheckbox();
};

MaterialCheckbox.displayName = 'MaterialCheckbox';

export default MaterialCheckbox;
