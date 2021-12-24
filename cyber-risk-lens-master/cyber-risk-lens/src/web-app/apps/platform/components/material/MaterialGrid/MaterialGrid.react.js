import React from 'react';
import Grid from '@material-ui/core/Grid';

const MaterialGrid = props => {
  function _renderMaterialGrid(): React.Node {
    return <Grid {...props} />;
  }

  return _renderMaterialGrid();
};

MaterialGrid.displayName = 'MaterialGrid';

export default MaterialGrid;
