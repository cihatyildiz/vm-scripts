import React from 'react';
import Select from '@material-ui/core/Select';

 const MaterialSelect = props => {
  function _renderMaterialSelect(): React.Node {
    return <Select {...props} />;
  }
   return _renderMaterialSelect();
};

MaterialSelect.displayName = 'MaterialSelect';
export default MaterialSelect;
