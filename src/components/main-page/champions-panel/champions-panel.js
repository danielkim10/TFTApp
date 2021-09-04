import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Input } from 'reactstrap';
import ChampionTooltip from '../../../sub-components/champion-tooltips/champion-tooltips';
import Tooltip from '@material-ui/core/Tooltip';

import './champions-panel.css';
import '../../base.css';

class ChampionsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      champions: this.props.champions,
      searchNameChamps: "",
    };
  }

  allowDrop = (e) => {
    e.preventDefault();
  }

  placeChampions = () => {
    let champions = [];
    for (let champion of Object.values(this.props.champions)) {
      if (champion.patch_data !== undefined) {
        if (champion.name.toLowerCase().includes(this.state.searchNameChamps.toLowerCase())) {
          let trait_data = [];
          for (let i in champion.traits) {
            trait_data.push(this.props.traits[champion.traits[i]]);
          }
          champions.push(
            <Tooltip placement='top' title={<ChampionTooltip champion={champion} traits={trait_data}/>} key={champion.championId} arrow>
              <div className='portrait-spacing' onClick={(e) => this.props.addToTeam(e, champion)} draggable="true" onDragStart={(e) => this.props.drag(e, champion)}  id={champion.championId} key={champion.championId}>
                <img src={champion.patch_data.icon} id={champion.championId} alt={champion.name} className={`portrait-border cost${champion.cost}`} onError={this.props.imageError}/>
                <p className="cost">${champion.cost}</p>
                <p className="champion-name">{champion.name}</p>
              </div>
            </Tooltip>
          );
        }
      }
    }
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
        <CardBody onDrop={(e) => this.props.drop(e)} onDragOver={this.allowDrop} style={{height: '350px', overflowY: 'auto'}}>
          <Input type="text" id="searchNameChamps" name="searchNameChamps" onChange={this.handleChanges} placeholder="Champion Name" />
          {this.placeChampions()}
        </CardBody>
      </Card>

    );
  }
}

export default ChampionsPanel
