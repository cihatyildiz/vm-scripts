import React from 'react';
import {MaterialButton} from 'themes/material'

const MaterialRoundButtonIcon = props => {
  function _renderMaterialRoundButtonIcon(): React.Node {
    console.log(...props)
    const img_src
      = 'https://github.com/PankajMoolrajani/mxr-icons/blob/master/marketplace_manager/'
        + props.image_name
        + '?raw=true'
    return (
      <MaterialButton variant = 'fab' mini onClick = {() => props.onClick()}>
        <img width = '100%' height = '100%' src =  {img_src} alt = {img_src}/>
      </MaterialButton>
    )
  }
  return _renderMaterialRoundButtonIcon();
};

MaterialRoundButtonIcon.displayName = 'MaterialRoundButtonIcon';

export default MaterialRoundButtonIcon;
