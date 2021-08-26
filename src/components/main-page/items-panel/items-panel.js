import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Input } from 'reactstrap';
import ItemTooltip from '../../../sub-components/item-tooltips/item-tooltips.js';

import './items-panel.css';

class ItemsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchNameItems: "",
    }
  }

  isToolTipOpen = (target) => {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }
  toggle = (target) => {
    if (!this.state[target]) {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: !this.state[target].tooltipOpen
        }
      });
    }
  }

  placeItems = () => {
    let items = [];
    Object.keys(this.props.items).forEach((key, index) => {
      if (this.props.items[key].patch_data !== undefined) {
        if (this.props.items[key].name.toLowerCase().includes(this.state.searchNameItems.toLowerCase())) {
          let str = parseInt((key.substring(1, key.length)));
          if (str > 10) {
            let image = this.props.items[key].patch_data.icon.substring(0, this.props.items[key].patch_data.icon.indexOf('dds'));
            
            items.push(<div className='item-spacing' id={key} key={key} draggable="true" onDragStart={(e) => this.props.drag(e, this.props.items[key])}>
            <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={this.props.items[key].name} className='itemborder'/>
              <p className='item-name'>{this.props.items[key].name}</p>

            <ItemTooltip placement="top" isOpen={this.isToolTipOpen(key)} target={key} toggle={() => this.toggle(key)}
              name={this.props.items[key].name}/>
            </div>);
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
