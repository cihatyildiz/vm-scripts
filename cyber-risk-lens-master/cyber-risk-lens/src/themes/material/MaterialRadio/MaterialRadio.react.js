import React from 'react';
import Radio from '@material-ui/core/Radio';

const MaterialRadio = props => {
  function _renderMaterialRadio(): React.Node {
    return <Radio {...props} />;
  }

  return _renderMaterialRadio();
};

MaterialRadio.displayName = 'MaterialRadio';

export default MaterialRadio;
