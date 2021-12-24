import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';

const MaterialTablePagination = props => {
  function _renderMaterialTablePagination(): React.Node {
    return <TablePagination {...props} />;
  }

  return _renderMaterialTablePagination();
};

MaterialTablePagination.displayName = 'MaterialTablePagination';

export default MaterialTablePagination;
