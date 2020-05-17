import React from 'react';
import { Tooltip } from 'reactstrap';

export function toggle(target) {
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

export function isToolTipOpen(target) {
  return this.state[target] ? this.state[target].tooltipOpen : false;
}
