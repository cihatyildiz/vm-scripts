import React from 'react';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

const MaterialExpansionPanelActions = props => {
  function _renderMaterialExpansionPanelActions(): React.Node {
    return <ExpansionPanelActions {...props} />;
  }

  return _renderMaterialExpansionPanelActions();
};

MaterialExpansionPanelActions.displayName = 'MaterialExpansionPanelActions';

export default MaterialExpansionPanelActions;
