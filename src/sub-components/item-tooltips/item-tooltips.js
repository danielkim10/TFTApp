import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

import './item-tooltips.css';

class ItemTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render = () => {
    return (
      <Tooltip placement="top" isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
        <p className='tooltipTitle'>{this.props.name}</p>
      </Tooltip>
    )
  }
}

export default ItemTooltip
