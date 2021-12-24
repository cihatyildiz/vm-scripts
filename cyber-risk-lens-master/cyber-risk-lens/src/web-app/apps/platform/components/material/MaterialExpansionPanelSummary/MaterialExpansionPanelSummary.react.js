import React from 'react';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

const MaterialExpansionPanelSummary = props => {
  function _renderMaterialExpansionPanelSummary(): React.Node {
    return <ExpansionPanelSummary {...props} />;
  }

  return _renderMaterialExpansionPanelSummary();
};

MaterialExpansionPanelSummary.displayName = 'MaterialExpansionPanelSummary';

export default MaterialExpansionPanelSummary;
