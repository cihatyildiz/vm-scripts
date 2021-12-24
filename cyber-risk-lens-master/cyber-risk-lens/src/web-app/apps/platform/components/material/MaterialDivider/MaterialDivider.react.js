
import React from 'react';
import Divider from '@material-ui/core/Divider';

const MaterialDivider = props => {
  function _renderMaterialDivider() {
    return <Divider {...props} />;
  }

  return _renderMaterialDivider();
};

MaterialDivider.displayName = 'MaterialDivider';

export default MaterialDivider;
