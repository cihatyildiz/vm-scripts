import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';

const MaterialListItemText = props => {
  function _renderMaterialListItemText(): React.Node {
    return <ListItemText {...props} />;
  }

  return _renderMaterialListItemText();
};

MaterialListItemText.displayName = 'MaterialListItemText';

export default MaterialListItemText;
