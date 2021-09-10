import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import ChampionTooltip from '../../../sub-components/champion-tooltips/champion-tooltips';
import Tooltip from '@material-ui/core/Tooltip';

import './champions-panel.css';
import '../../base.css';

const ChampionsPanel = (props) => {
  const [searchNameChamps, setSearchNameChamps] = useState("");

  const placeChampions = () => {
    let champions_arr = [];
    for (let champion of Object.values(props.champions)) {
      if (champion.patch_data !== undefined) {
        if (champion.name.toLowerCase().includes(searchNameChamps.toLowerCase()) || champion.cost.toString().includes(searchNameChamps)) {
          let trait_data = [];
          for (let i in champion.traits) {
            trait_data.push(props.traits[champion.traits[i]]);
          }
          champions_arr.push(
            <Tooltip placement='top' title={<ChampionTooltip champion={champion} traits={trait_data} imageError={props.imageError}/>} key={champion.championId} arrow>
              <div className='portrait-spacing' onClick={(e) => props.addToTeam(e, champion)} draggable="true" onDragStart={(e) => props.drag(e, champion)} onDragEnd={(e) => props.dragEnd()}  id={champion.championId} key={champion.championId}>
                <img src={champion.patch_data.icon} id={champion.championId} alt={champion.name} className={`portrait-border cost${champion.cost}`} onError={props.imageError}/>
                <p className="cost">${champion.cost}</p>
                <p className="champion-name">{champion.name}</p>
              </div>
            </Tooltip>
          );
        }
      }
    }
    return champions_arr;
  }

  const handleChanges = (e) => {
    setSearchNameChamps(e.target.value);
  }

  const allowDrop = (e) => {
    e.preventDefault();
  }

  return(
    <div className="champion-panel" onDragOver={allowDrop} onDrop={(e) => props.drop(e)}>
      <div className="champion-panel-header">
        <p className="header-title">Champions</p>
      </div>
      <div className="champion-panel-body">
        <TextField id="searchNameChamps" name="searchNameChamps" onChange={handleChanges} placeholder="Champion Name or Cost" className="champion-search" variant="outlined"/>
          {placeChampions()}
      </div>
    </div>
  );
}

export default ChampionsPanel;
