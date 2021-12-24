import React from 'react';
import List from '@material-ui/core/List';

const MaterialList = props => {
  function _renderMaterialList(): React.Node {
    return <List {...props} />;
  }

  return _renderMaterialList();
};

MaterialList.displayName = 'MaterialList';

export default MaterialList;
