import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { assets_url } from '../../../helper/urls';
import ItemTooltip from '../../../sub-components/item-tooltips/item-tooltips';
import Tooltip from '@material-ui/core/Tooltip';

import './items-panel.css';
import '../../base.css';

const ItemsPanel = (props) => {
  const [searchNameItems, setSearchNameItems] = useState("");
  
  const placeItems = () => {
    let items_arr = [];
    for (let item of Object.values(props.items)) {
      if (item.patch_data !== undefined) {
        if (item.name.toLowerCase().includes(searchNameItems.toLowerCase())) {
          if (item.id > 10) {
            let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();
            
            items_arr.push(
              <Tooltip placement='top' title={<ItemTooltip item={item}/>} key={item.id.toString()} arrow>
                <div className='portrait-spacing' id={item.id} key={item.id.toString()} draggable="true" onDragStart={(e) => props.drag(e, item)} onDragEnd={(e) => props.dragEnd()}>
                  <img src={assets_url(image)} alt={item.name} className='portrait-border item' onError={props.imageError}/>
                  <p className='item-name'>{item.name}</p>
                </div>
              </Tooltip>
            );
          }
        }
      }
    }
    return items_arr;
  }

  const handleChanges = (e) => {
    setSearchNameItems(e.target.value);
  }

  return (
    <div className='item-panel'>
      <div className='item-panel-header'>
        <p className='header-title'>Items</p>
      </div>
      <div className='item-panel-body'>
        <TextField id="searchNameItems" name="searchNameItems" onChange={handleChanges} placeholder="Item Name" variant="outlined" className='item-search' />
        {placeItems()}
      </div>
    </div>
  );
}

export default ItemsPanel;
