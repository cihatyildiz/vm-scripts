import React from 'react';
import Fade from '@material-ui/core/Fade';

const MaterialFade = props => {
  function _renderMaterialFade(): React.Node {
    return <Fade {...props} />;
  }

  return _renderMaterialFade();
};

MaterialFade.displayName = 'MaterialFade';

export default MaterialFade;
