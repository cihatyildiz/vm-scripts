
import React from 'react';
import Card from '@material-ui/core/Card';

const MaterialCard = props => {
  function _renderMaterialCard(): React.Node {
    return <Card {...props} />;
  }

  return _renderMaterialCard();
};

MaterialCard.displayName = 'MaterialCard';

export default MaterialCard;
