import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';

const MaterialRadioGroup = props => {
  function _renderMaterialRadioGroup(): React.Node {
    return <RadioGroup {...props} />;
  }

  return _renderMaterialRadioGroup();
};

MaterialRadioGroup.displayName = 'MaterialRadioGroup';

export default MaterialRadioGroup;
