import React from 'react';
import GridList from '@material-ui/core/GridList';

const MaterialGridList = props => {
  function _renderMaterialGridList(): React.Node {
    return <GridList {...props} />;
  }

  return _renderMaterialGridList();
};

MaterialGridList.displayName = 'MaterialGridList';

export default MaterialGridList;
