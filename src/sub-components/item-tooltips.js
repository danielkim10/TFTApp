import React, { Component } from 'react';
import { Row, Tooltip } from 'reactstrap';

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
        <Row>
        <img src={this.props.item1} width={40} height={40}/>
        <p style={{fontSize: '28px'}}>+</p>
        <img src={this.props.item2} width={40} height={40}/>
        </Row>
        </Tooltip>
    )
  }
}

export default ItemTooltip
