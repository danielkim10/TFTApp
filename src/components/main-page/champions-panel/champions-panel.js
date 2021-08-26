import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Input } from 'reactstrap';
import ChampionTooltip from '../../../sub-components/champion-tooltips/champion-tooltips';
import Tooltip from '@material-ui/core/Tooltip';

import './champions-panel.css';

class ChampionsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      champions: this.props.champions,
      searchNameChamps: "",
    };
  }

  placeChampions = () => {
    let champions = [];
    Object.keys(this.props.champions).forEach((key, index) => {
      if (this.props.champions[key].patch_data !== undefined) {
        if (this.props.champions[key].name.toLowerCase().includes(this.state.searchNameChamps.toLowerCase())) {
          let trait_data = [];
          for (let i in this.props.champions[key].traits) {
            trait_data.push(this.props.traits[this.props.champions[key].traits[i]]);
          }
          champions.push(
            <Tooltip placement='top' title={<ChampionTooltip champion={this.props.champions[key]} traits={trait_data}/>} key={key} arrow>
              <div className='champion-spacing' draggable="true" onDragStart={(e) => this.props.drag(e, this.props.champions[key])} id={key} key={key}>
                <img src={this.props.champions[key].patch_data.icon} id={key} alt={this.props.champions[key].name} className={this.props.champions[key].cost === 1 ? 'cost1champion' : this.props.champions[key].cost === 2 ? 'cost2champion' : this.props.champions[key].cost === 3 ? 'cost3champion' : this.props.champions[key].cost === 4 ? 'cost4champion' : 'cost5champion'}/>
                <p className="cost">${this.props.champions[key].cost}</p>
                <p className="champion-name">{this.props.champions[key].name}</p>
              </div>
            </Tooltip>
          );
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

export default ChampionsPanel
