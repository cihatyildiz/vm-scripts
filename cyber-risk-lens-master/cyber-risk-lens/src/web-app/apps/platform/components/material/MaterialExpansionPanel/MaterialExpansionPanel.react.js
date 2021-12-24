import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';

const MaterialExpansionPanel = props => {
  function _renderMaterialExpansionPanel(): React.Node {
    return <ExpansionPanel {...props} />;
  }

  return _renderMaterialExpansionPanel();
};

MaterialExpansionPanel.displayName = 'MaterialExpansionPanel';

export default MaterialExpansionPanel;
