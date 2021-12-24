import React from 'react';
import Modal from '@material-ui/core/Modal';

const MaterialModal = props => {
  function _renderMaterialModal(): React.Node {
    return <Modal {...props} />;
  }

  return _renderMaterialModal();
};

MaterialModal.displayName = 'MaterialModal';

export default MaterialModal;
