import React from 'react';
import Switch from '@material-ui/core/Switch';

const MaterialSwitch = props => {
  function _renderMaterialSwitch(): React.Node {
    return <Switch {...props} />;
  }

  return _renderMaterialSwitch();
};

MaterialSwitch.displayName = 'MaterialSwitch';

export default MaterialSwitch;
