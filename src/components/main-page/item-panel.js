import React, { Component } from 'react';
import { Alert, Button, Card, CardHeader, CardBody, Col, Collapse, Row, Input, Tooltip } from 'reactstrap';
import ItemTooltip from '../../sub-components/item-tooltips.js';

class ItemPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchNameItems: "",
    }
  }

  isToolTipOpen(target) {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }
  toggle(target) {
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
      if (key.includes(this.state.searchNameItems.toLowerCase()) || this.props.items[key].name[0].includes(this.state.searchNameItems)) {
        let str = "";
        for (let j = 0; j < this.props.items[key].stats[0].length; ++j) {
          if (this.props.items[key].depth !== 1 && (this.props.items[key].stats[0][j].name !== 'class' && this.props.items[key].stats[0][j].name !== 'origin') && key !== 'forceofnature') {
            if (j != 0)
              str += ', '
            str += this.props.items[key].stats[0][j].label;
          }
        }
        items.push(<div style={{display: 'inline-block'}}>
        <img src={this.props.items[key].image[0]} draggable="true" onDragStart={(e) => this.props.drag(e, this.props.items[key])} className='icon50' id={key}/>
        <ItemTooltip placement="top" isOpen={this.isToolTipOpen(key)} target={key} toggle={() => this.toggle(key)}
                     title={this.props.items[key].name[0]} bonus={this.props.items[key].bonus[0]} stats={str} item1={this.props.itemsBasic[Math.floor(this.props.items[key].id / 10) - 1].image[0]} item2={this.props.itemsBasic[Math.floor(this.props.items[key].id % 10) - 1].image[0]}/>
        </div>);
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
