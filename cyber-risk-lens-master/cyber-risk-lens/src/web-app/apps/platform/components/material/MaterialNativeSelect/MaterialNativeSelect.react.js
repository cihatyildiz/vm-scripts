import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';

const MaterialNativeSelect = props => {
  function _renderMaterialNativeSelect(): React.Node {
    return <NativeSelect {...props} />;
  }

  return _renderMaterialNativeSelect();
};

MaterialNativeSelect.displayName = 'MaterialNativeSelect';

export default MaterialNativeSelect;
