import React, { Component } from 'react';
import { Row, Tooltip } from 'reactstrap';

import './item-tooltips.css';

class ItemTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <Tooltip placement="top" isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
        <p className='tooltipTitle'>{this.props.title}</p>
        <p>{this.props.bonus}</p>
        <p>{this.props.stats}</p>
        {
          this.props.item1 !== "" ?
          <Row>
            <img src={this.props.item1} className='tooltipimage1'/>
            <p style={{fontSize: '28px'}}>+</p>
            <img src={this.props.item2} className='tooltipimage2'/>
          </Row>
          : <></>
        }
      </Tooltip>
    )
  }
}

export default ItemTooltip
