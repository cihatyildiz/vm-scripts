import React from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';

const MaterialListSubheader = props => {
  function _renderMaterialListSubheader(): React.Node {
    return <ListSubheader {...props} />;
  }

  return _renderMaterialListSubheader();
};

MaterialListSubheader.displayName = 'MaterialListSubheader';

export default MaterialListSubheader;
