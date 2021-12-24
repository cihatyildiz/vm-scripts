import React from 'react';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const MaterialListItemSecondaryAction = props => {
  function _renderMaterialListItemSecondaryAction(): React.Node {
    return <ListItemSecondaryAction {...props} />;
  }

  return _renderMaterialListItemSecondaryAction();
};

MaterialListItemSecondaryAction.displayName = 'MaterialListItemSecondaryAction';

export default MaterialListItemSecondaryAction;
