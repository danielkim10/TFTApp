import React, { Component } from 'react';
import { Alert, Button, Card, CardHeader, CardBody, Col, Collapse, Row, Input, Tooltip } from 'reactstrap';
import ChampionTooltip from '../../../sub-components/champion-tooltips.js';

import './champion-panel.css';

class ChampionPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      champions: this.props.champions,
      searchNameChamps: "",
    };
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

  placeChampions = () => {
    let champions = [];
    Object.keys(this.props.champions).forEach((key, index) => {
      if (key.includes(this.state.searchNameChamps.toLowerCase()) || this.props.champions[key].name.includes(this.state.searchNameChamps)) {
        champions.push(<div style={{ position: 'relative', display: 'inline-block', margin: '4px'}} onClick={() => this.props.addToTeam(this.props.champions[key])}>

        <img src={this.props.champions[key].icon} draggable="true" onDragStart={this.props.drag} className={this.props.champions[key].cost === 1 ? 'cost1champion' : this.props.champions[key].cost === 2 ? 'cost2champion' : this.props.champions[key].cost === 3 ? 'cost3champion' : this.props.champions[key].cost === 4 ? 'cost4champion' : 'cost5champion'}  id={key} />
          <p className="cost">${this.props.champions[key].cost}</p>
          <p className="champion-name">{this.props.champions[key].name}</p>

        <ChampionTooltip placement="top" isOpen={this.isToolTipOpen(key)} target={key} toggle={() => this.toggle(key)}
                 name={this.props.champions[key].name} cost={this.props.champions[key].cost} origin={this.props.champions[key].origin} classe={this.props.champions[key].classe}/>
        </div>);
      }
    });
    return champions;
  }

  handleChanges = (e) => {
    this.setState({ searchNameChamps: e.target.value });
  }

  render = () => {
    return(
      <Card className="card">
        <CardHeader className='whitebg'>
          <strong>Champions</strong>
        </CardHeader>
        <CardBody>
          <Input type="text" id="search" name="searchNameChamps" onChange={this.handleChanges} placeholder="Champion Name" />
          {this.placeChampions()}
        </CardBody>
      </Card>

    );
  }
}

export default ChampionPanel
