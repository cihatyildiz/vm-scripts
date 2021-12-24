import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const MaterialTooltip = props => {
  function _renderMaterialTooltip(): React.Node {
    return <Tooltip {...props} />;
  }

  return _renderMaterialTooltip();
};

MaterialTooltip.displayName = 'MaterialTooltip';

export default MaterialTooltip;
