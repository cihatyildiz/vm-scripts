import React from 'react';
import TableBody from '@material-ui/core/TableBody';

const MaterialTableBody = props => {
  function _renderMaterialTableBody(): React.Node {
    return <TableBody {...props} />;
  }

  return _renderMaterialTableBody();
};

MaterialTableBody.displayName = 'MaterialTableBody';

export default MaterialTableBody;
