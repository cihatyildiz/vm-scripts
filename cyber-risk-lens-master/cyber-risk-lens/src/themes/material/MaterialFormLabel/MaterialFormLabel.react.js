import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';

const MaterialFormLabel = props => {
  function _renderMaterialFormLabel(): React.Node {
    return <FormLabel {...props} />;
  }

  return _renderMaterialFormLabel();
};

MaterialFormLabel.displayName = 'MaterialFormLabel';

export default MaterialFormLabel;
