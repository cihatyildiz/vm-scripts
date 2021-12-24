import React from 'react';
import Slide from '@material-ui/core/Slide';

const MaterialSlide = props => {
  function _renderMaterialSlide(): React.Node {
    return <Slide {...props} />;
  }

  return _renderMaterialSlide();
};

MaterialSlide.displayName = 'MaterialSlide';

export default MaterialSlide;
