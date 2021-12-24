import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';

const MaterialFormHelperText = props => {
  function _renderMaterialFormHelperText(): React.Node {
    return <FormHelperText {...props} />;
  }

  return _renderMaterialFormHelperText();
};

MaterialFormHelperText.displayName = 'MaterialFormHelperText';

export default MaterialFormHelperText;
