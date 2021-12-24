import React from 'react';
import TableRow from '@material-ui/core/TableRow';

const MaterialTableRow = props => {
  function _renderMaterialTableRow(): React.Node {
    return <TableRow {...props} />;
  }

  return _renderMaterialTableRow();
};

MaterialTableRow.displayName = 'MaterialTableRow';

export default MaterialTableRow;
