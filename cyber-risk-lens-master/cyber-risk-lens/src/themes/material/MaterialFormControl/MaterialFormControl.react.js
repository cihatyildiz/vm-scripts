import React from 'react';
import FormControl from '@material-ui/core/FormControl';

const MaterialFormControl = props => {
  function _renderMaterialFormControl(): React.Node {
    return <FormControl {...props} />;
  }

  return _renderMaterialFormControl();
};

MaterialFormControl.displayName = 'MaterialFormControl';

export default MaterialFormControl;
