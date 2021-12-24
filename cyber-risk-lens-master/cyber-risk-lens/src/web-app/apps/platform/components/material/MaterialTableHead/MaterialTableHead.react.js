import React from 'react';
import TableHead from '@material-ui/core/TableHead';

const MaterialTableHead = props => {
  function _renderMaterialTableHead(): React.Node {
    return <TableHead {...props} />;
  }

  return _renderMaterialTableHead();
};

MaterialTableHead.displayName = 'MaterialTableHead';

export default MaterialTableHead;
