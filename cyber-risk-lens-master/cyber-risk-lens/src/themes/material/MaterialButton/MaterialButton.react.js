import React from 'react';
import Button from '@material-ui/core/Button';

const MaterialButton = props => {
  function _renderMaterialButton(): React.Node {
    return <Button {...props} />;
  }

  return _renderMaterialButton();
};

MaterialButton.displayName = 'MaterialButton';

export default MaterialButton;
