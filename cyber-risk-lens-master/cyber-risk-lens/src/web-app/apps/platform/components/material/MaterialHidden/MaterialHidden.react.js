import React from 'react';
import Hidden from '@material-ui/core/Hidden';

const MaterialHidden = props => {
  function _renderMaterialHidden(): React.Node {
    return <Hidden {...props} />;
  }

  return _renderMaterialHidden();
};

MaterialHidden.displayName = 'MaterialHidden';

export default MaterialHidden;
  
