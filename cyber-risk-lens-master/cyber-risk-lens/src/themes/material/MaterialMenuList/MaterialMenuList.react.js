import React from 'react';
import MenuList from '@material-ui/core/MenuList';

const MaterialMenuList = props => {
  function _renderMaterialMenuList(): React.Node {
    return <MenuList {...props} />;
  }

  return _renderMaterialMenuList();
};

MaterialMenuList.displayName = 'MaterialMenuList';

export default MaterialMenuList;
