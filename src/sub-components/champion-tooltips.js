import React, { Component } from 'react';
import { Row, Tooltip } from 'reactstrap';

class ChampionTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <Tooltip placement="top" isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
        <p className='tooltipTitle'>{this.props.name}</p>
        <p>{this.props.cost} cost unit</p>
        <p>{this.props.origin[0]}{this.props.origin.length === 2 ? ' / ' + this.props.origin[1] : ""}</p>
        <p>{this.props.classe[0]}{this.props.classe.length === 2 ? ' / ' + this.props.classe[1] : ""}</p>
      </Tooltip>
    )
  }
}

export default ChampionTooltip
