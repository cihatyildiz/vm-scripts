import React from 'react';
import Paper from '@material-ui/core/Paper';

const MaterialPaper = props => {
  function _renderMaterialPaper(): React.Node {
    return <Paper {...props} />;
  }

  return _renderMaterialPaper();
};

MaterialPaper.displayName = 'MaterialPaper';

export default MaterialPaper;
