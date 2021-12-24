
import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';

const MaterialCardHeader = props => {
  function _renderMaterialCardHeader(): React.Node {
    return <CardHeader {...props} />;
  }

  return _renderMaterialCardHeader();
};

MaterialCardHeader.displayName = 'MaterialCardHeader';

export default MaterialCardHeader;
