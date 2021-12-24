import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

const MaterialButtonBase = props => {
  function _renderMaterialButtonBase(): React.Node {
    return <ButtonBase {...props} />;
  }

  return _renderMaterialButtonBase();
};

MaterialButtonBase.displayName = 'MaterialButtonBase';

export default MaterialButtonBase;
