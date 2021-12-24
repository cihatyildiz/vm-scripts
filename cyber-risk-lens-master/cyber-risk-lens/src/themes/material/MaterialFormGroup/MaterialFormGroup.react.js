import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';

const MaterialFormGroup = props => {
  function _renderMaterialFormGroup(): React.Node {
    return <FormGroup {...props} />;
  }

  return _renderMaterialFormGroup();
};

MaterialFormGroup.displayName = 'MaterialFormGroup';

export default MaterialFormGroup;
