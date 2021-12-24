import React from 'react';
import ListItem from '@material-ui/core/ListItem';

const MaterialListItem = props => {
  function _renderMaterialListItem(): React.Node {
    return <ListItem {...props} />;
  }

  return _renderMaterialListItem();
};

MaterialListItem.displayName = 'MaterialListItem';

export default MaterialListItem;
