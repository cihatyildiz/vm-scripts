import React from 'react';
import Popover from '@material-ui/core/Popover';

const MaterialPopover = props => {
  function _renderMaterialPopover(): React.Node {
    return <Popover {...props} />;
  }

  return _renderMaterialPopover();
};

MaterialPopover.displayName = 'MaterialPopover';

export default MaterialPopover;
