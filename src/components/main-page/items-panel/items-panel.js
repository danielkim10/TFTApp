import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Input } from 'reactstrap';
import { assets_url } from '../../../api-helper/urls';
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
    Object.keys(this.props.items).forEach((key, index) => {
      if (this.props.items[key].patch_data !== undefined) {
        if (this.props.items[key].name.toLowerCase().includes(this.state.searchNameItems.toLowerCase())) {
          let str = parseInt((key.substring(1, key.length)));
          if (str > 10) {
            let image = this.props.items[key].patch_data.icon.substring(0, this.props.items[key].patch_data.icon.indexOf('dds')).toLowerCase();
            
            items.push(
              <Tooltip placement='top' title={<ItemTooltip item={this.props.items[key]}/>} key={key} arrow>
                <div className='item-spacing' id={key} key={key} draggable="true" onDragStart={(e) => this.props.drag(e, this.props.items[key])}>
                  <img src={assets_url(image)} alt={this.props.items[key].name} className='itemborder'/>
                  <p className='item-name'>{this.props.items[key].name}</p>
                </div>
              </Tooltip>
            );
          }
        }
      }
    });
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
        <CardBody>
        <Input type="text" id="searchNameItems" name="searchNameItems" onChange={this.handleChanges} placeholder="Item Name" />
          {this.placeItems()}
        </CardBody>
      </Card>
    );
  }
}

export default ItemsPanel;
