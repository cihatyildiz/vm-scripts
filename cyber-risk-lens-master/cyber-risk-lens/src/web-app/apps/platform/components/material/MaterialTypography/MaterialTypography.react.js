import React from 'react';
import Typography from '@material-ui/core/Typography';

const MaterialTypography = props => {
  function _renderMaterialTypography(): React.Node {
    return <Typography {...props} />;
  }

  return _renderMaterialTypography();
};

MaterialTypography.displayName = 'MaterialTypography';

export default MaterialTypography;
