import React from 'react';
import TableFooter from '@material-ui/core/TableFooter';

const MaterialTableFooter = props => {
  function _renderMaterialTableFooter(): React.Node {
    return <TableFooter {...props} />;
  }

  return _renderMaterialTableFooter();
};

MaterialTableFooter.displayName = 'MaterialTableFooter';

export default MaterialTableFooter;
