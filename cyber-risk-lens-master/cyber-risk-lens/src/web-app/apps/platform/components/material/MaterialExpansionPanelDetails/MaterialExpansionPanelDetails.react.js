import React from 'react';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const MaterialExpansionPanelDetails = props => {
  function _renderMaterialExpansionPanelDetails(): React.Node {
    return <ExpansionPanelDetails {...props} />;
  }

  return _renderMaterialExpansionPanelDetails();
};

MaterialExpansionPanelDetails.displayName = 'MaterialExpansionPanelDetails';

export default MaterialExpansionPanelDetails;
