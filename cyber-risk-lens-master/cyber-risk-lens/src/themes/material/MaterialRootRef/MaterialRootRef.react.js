import React from 'react';
import RootRef from '@material-ui/core/RootRef';

const MaterialRootRef = props => {
  function _renderMaterialRootRef(): React.Node {
    return <RootRef {...props} />;
  }

  return _renderMaterialRootRef();
};

MaterialRootRef.displayName = 'MaterialRootRef';

export default MaterialRootRef;
