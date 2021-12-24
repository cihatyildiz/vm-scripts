import React from 'react';
import CardContent from '@material-ui/core/CardContent';

const MaterialCardContent = props => {
  function _renderMaterialCardContent(): React.Node {
    return <CardContent {...props} />;
  }

  return _renderMaterialCardContent();
};

MaterialCardContent.displayName = 'MaterialCardContent';

export default MaterialCardContent;
