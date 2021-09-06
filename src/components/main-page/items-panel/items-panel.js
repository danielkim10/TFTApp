import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { assets_url } from '../../../helper/urls';
import ItemTooltip from '../../../sub-components/item-tooltips/item-tooltips';
import Tooltip from '@material-ui/core/Tooltip';



class ItemsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchNameItems: "",
    }
  }

  placeItems = () => {
    let items = [];
    for (let item of Object.values(this.props.items)) {
      if (item.patch_data !== undefined) {
        if (item.name.toLowerCase().includes(this.state.searchNameItems.toLowerCase())) {
          if (item.id > 10) {
            let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();
            
            items.push(
              <Tooltip placement='top' title={<ItemTooltip item={item}/>} key={item.id.toString()} arrow>
                <div className='portrait-spacing' id={item.id} key={item.id.toString()} draggable="true" onDragStart={(e) => this.props.drag(e, item)} onDragEnd={(e) => this.props.dragEnd()}>
                  <img src={assets_url(image)} alt={item.name} className='portrait-border item' onError={this.props.imageError}/>
                  <p className='item-name'>{item.name}</p>
                </div>
              </Tooltip>
            );
          }
        }
      }
    }
    return items;
  }

  handleChanges = (e) => {
    this.setState({ searchNameItems: e.target.value })
  }

  render = () => {
    require('./items-panel.css');
    require('../../base.css');

    return (
      <div className='item-panel'>
        <div className='item-panel-header'>
          <p className='header-title'>Items</p>
        </div>
        <div className='item-panel-body'>
          <TextField id="searchNameItems" name="searchNameItems" onChange={this.handleChanges} placeholder="Item Name" variant="outlined" className='item-search' />
          {this.placeItems()}
        </div>
      </div>
    );
  }
}

export default ItemsPanel;
