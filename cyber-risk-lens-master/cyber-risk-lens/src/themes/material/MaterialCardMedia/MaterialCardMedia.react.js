import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';

const MaterialCardMedia = props => {
  function _renderMaterialCardMedia(): React.Node {
    return <CardMedia {...props} />;
  }

  return _renderMaterialCardMedia();
};

MaterialCardMedia.displayName = 'MaterialCardMedia';

export default MaterialCardMedia;
