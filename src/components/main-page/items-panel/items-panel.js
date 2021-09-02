import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Input } from 'reactstrap';
import { assets_url } from '../../../helper/urls';
import ItemTooltip from '../../../sub-components/item-tooltips/item-tooltips';
import Tooltip from '@material-ui/core/Tooltip';

import './items-panel.css';

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
                <div className='item-spacing' id={item.id} key={item.id.toString()} draggable="true" onDragStart={(e) => this.props.drag(e, item)}>
                  <img src={assets_url(image)} alt={item.name} className='itemborder' onError={this.props.imageError}/>
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
    return (
      <Card>
        <CardHeader className='whitebg'>
          <strong>Items</strong>
        </CardHeader>
        <CardBody style={{height: '350px', overflowY: 'auto'}}>
        <Input type="text" id="searchNameItems" name="searchNameItems" onChange={this.handleChanges} placeholder="Item Name" />
          {this.placeItems()}
        </CardBody>
      </Card>
    );
  }
}

export default ItemsPanel;
