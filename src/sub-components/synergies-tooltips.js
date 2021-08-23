import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

class SynergiesTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  createSmallTooltip = () => {
    return (
      <Tooltip placement="top" isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
        <div>
          <p className='tooltipTitle'>{this.props.count} {this.props.name}</p>
        </div>
      </Tooltip>
    );
  }

  createAdvancedTooltip = () => {
    return (
      <Tooltip placement="top" isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
      <div>
        <p className='tooltipTitle'>{this.props.name}</p>
        <p>{this.props.description}</p>
        {/*<p className={this.props.tier < 1 ? 'tooltipLocked' : ''}>{this.props.bonuses[0].needed + ": " + this.props.bonuses[0].effect}</p>
        <p className={this.props.tier < 2 ? 'tooltipLocked' : ''}>{this.props.bonuses.length > 1 ? this.props.bonuses[1].needed + ": " + this.props.bonuses[1].effect : ""}</p>
        <p className={this.props.tier < 3 ? 'tooltipLocked' : ''}>{this.props.bonuses.length > 2 ? this.props.bonuses[2].needed + ": " + this.props.bonuses[2].effect : ""}</p>
         <p className={this.props.tier < 4 ? 'tooltipLocked' : ''}>{this.props.bonuses.length > 3 ? this.props.bonuses[3].needed + ": " + this.props.bonuses[3].effect : ""}</p>*/}
      </div>
      </Tooltip>
    )
  }

  render = () => {
    return (
      <div>
      { this.props.smallTooltip && this.createSmallTooltip() }
      { this.props.advancedTooltip && this.createAdvancedTooltip() }
      </div>
    );
  }
}

export default SynergiesTooltip
