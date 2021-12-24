import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

const MaterialSvgIcon = props => {
  function _renderMaterialSvgIcon(): React.Node {
    return <SvgIcon {...props} />;
  }

  return _renderMaterialSvgIcon();
};

MaterialSvgIcon.displayName = 'MaterialSvgIcon';

export default MaterialSvgIcon;
