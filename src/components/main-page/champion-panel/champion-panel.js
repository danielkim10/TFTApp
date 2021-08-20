import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Input } from 'reactstrap';
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

  placeChampions = () => {

    let champions = [];
    Object.keys(this.props.champions).forEach((key, index) => {
      if (this.props.champions[key].patch_data !== undefined) {
        if (this.props.champions[key].name.toLowerCase().includes(this.state.searchNameChamps.toLowerCase())) {
          champions.push(<div style={{ position: 'relative', display: 'inline-block', margin: '4px'}} onClick={() => this.props.addToTeam(this.props.champions[key])} id={key} key={key}>

          <img src={require(`../../../data/champions/` + key + `.png`)} id={key} alt={this.props.champions[key].name} draggable="true" onDragStart={this.props.drag} className={this.props.champions[key].cost === 1 ? 'cost1champion' : this.props.champions[key].cost === 2 ? 'cost2champion' : this.props.champions[key].cost === 3 ? 'cost3champion' : this.props.champions[key].cost === 4 ? 'cost4champion' : 'cost5champion'}/>
            <p className="cost">${this.props.champions[key].cost}</p>
            <p className="champion-name">{this.props.champions[key].name}</p>

          <ChampionTooltip placement="top" isOpen={this.isToolTipOpen(key)} target={key} toggle={() => this.toggle(key)}
                  name={this.props.champions[key].name} cost={this.props.champions[key].cost}/>
          </div>);
        }
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
          <Input type="text" id="searchNameChamps" name="searchNameChamps" onChange={this.handleChanges} placeholder="Champion Name" />
          {this.placeChampions()}
        </CardBody>
      </Card>

    );
  }
}

export default ChampionPanel
