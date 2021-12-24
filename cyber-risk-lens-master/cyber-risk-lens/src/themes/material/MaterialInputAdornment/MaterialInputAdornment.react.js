import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';

const MaterialInputAdornment = props => {
  function _renderMaterialInputAdornment(): React.Node {
    return <InputAdornment {...props} />;
  }

  return _renderMaterialInputAdornment();
};

MaterialInputAdornment.displayName = 'MaterialInputAdornment';

export default MaterialInputAdornment;
