import React from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const MaterialTableSortLabel = props => {
  function _renderMaterialTableSortLabel(): React.Node {
    return <TableSortLabel {...props} />;
  }

  return _renderMaterialTableSortLabel();
};

MaterialTableSortLabel.displayName = 'MaterialTableSortLabel';

export default MaterialTableSortLabel;
