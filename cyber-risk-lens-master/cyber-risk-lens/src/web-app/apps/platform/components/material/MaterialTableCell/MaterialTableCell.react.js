import React from 'react';
import TableCell from '@material-ui/core/TableCell';

const MaterialTableCell = props => {
  function _renderMaterialTableCell(): React.Node {
    return <TableCell {...props} />;
  }

  return _renderMaterialTableCell();
};

MaterialTableCell.displayName = 'MaterialTableCell';

export default MaterialTableCell;
