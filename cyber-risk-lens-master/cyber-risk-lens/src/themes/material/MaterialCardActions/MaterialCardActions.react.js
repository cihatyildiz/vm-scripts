import React from 'react';
import CardActions from '@material-ui/core/CardActions';

const MaterialCardActions = props => {
  function _renderMaterialCardActions(): React.Node {
    return <CardActions {...props} />;
  }

  return _renderMaterialCardActions();
};

MaterialCardActions.displayName = 'MaterialCardActions';

export default MaterialCardActions;
