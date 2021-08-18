import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Input } from 'reactstrap';
import ItemTooltip from '../../../sub-components/item-tooltips.js';

import './item-panel.css';

class ItemPanel extends Component {
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
          if (str < 10) {
            str = '0' + key.substring(1, key.length);
          }
          else {
            str = key.substring(1, key.length);
          }
          items.push(<div style={{position: 'relative', display: 'inline-block', margin: '4px'}} id={key} key={key}>
          <img src={require(`../../../data/items/` + str + `.png`)} alt={this.props.items[key].name} draggable="true" onDragStart={(e) => this.props.drag(e, this.props.items[key])} className='itemborder'/>
            <p className='item-name'>{this.props.items[key].name}</p>

          <ItemTooltip placement="top" isOpen={this.isToolTipOpen(key)} target={key} toggle={() => this.toggle(key)}
                  name={this.props.items[key].name}/>
          </div>);
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
        <Input type="text" id="search" name="searchNameItems" onChange={this.handleChanges} placeholder="Item Name" />
          {this.placeItems()}
        </CardBody>
      </Card>
    );
  }
}

export default ItemPanel;
