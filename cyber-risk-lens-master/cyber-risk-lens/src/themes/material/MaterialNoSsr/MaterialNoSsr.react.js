import React from 'react';
import NoSsr from '@material-ui/core/NoSsr';

const MaterialNoSsr = props => {
  function _renderMaterialNoSsr(): React.Node {
    return <NoSsr {...props} />;
  }

  return _renderMaterialNoSsr();
};

MaterialNoSsr.displayName = 'MaterialNoSsr';

export default MaterialNoSsr;
