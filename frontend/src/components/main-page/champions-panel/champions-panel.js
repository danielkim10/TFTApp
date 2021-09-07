import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import ChampionTooltip from '../../../sub-components/champion-tooltips/champion-tooltips';
import Tooltip from '@material-ui/core/Tooltip';

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
        if (champion.name.toLowerCase().includes(this.state.searchNameChamps.toLowerCase()) || champion.cost.toString().includes(this.state.searchNameChamps)) {
          let trait_data = [];
          for (let i in champion.traits) {
            trait_data.push(this.props.traits[champion.traits[i]]);
          }
          champions.push(
            <Tooltip placement='top' title={<ChampionTooltip champion={champion} traits={trait_data}/>} key={champion.championId} arrow>
              <div className='portrait-spacing' onClick={(e) => this.props.addToTeam(e, champion)} draggable="true" onDragStart={(e) => this.props.drag(e, champion)} onDragEnd={(e) => this.props.dragEnd()}  id={champion.championId} key={champion.championId}>
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

  allowDrop = (e) => {
    e.preventDefault();
  }

  render = () => {
    require('./champions-panel.css');
    require('../../base.css') ;

    return(
      <div className="champion-panel" onDragOver={this.allowDrop} onDrop={(e) => this.props.drop(e)}>
        <div className="champion-panel-header">
          <p className="header-title">Champions</p>
        </div>
        <div className="champion-panel-body">
          <TextField id="searchNameChamps" name="searchNameChamps" onChange={this.handleChanges} placeholder="Champion Name or Cost" className="champion-search" variant="outlined"/>
            {this.placeChampions()}
        </div>
      </div>
    );
  }
}

export default ChampionsPanel
