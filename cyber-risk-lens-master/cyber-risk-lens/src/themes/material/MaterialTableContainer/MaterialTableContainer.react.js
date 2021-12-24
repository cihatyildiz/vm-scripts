import React from 'react';
import TableContainer from '@material-ui/core/TableContainer';

const MaterialTableContainer = (props) => {
  function _renderMaterialTableContainer (): React.Node {
    return <TableContainer {...props} />;
  };

  return _renderMaterialTableContainer();
};

MaterialTableContainer.displayName = 'MaterialTableContainer';

export default MaterialTableContainer;
