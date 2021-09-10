import React from 'react';
import { sortTierDescending, sortPlacementAscending, sortTierMatchDescending, sortTraitMatch } from '../../../helper/sorting'; 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Star from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import { assets_url } from '../../../helper/urls';
import SaveIcon from '@material-ui/icons/Save';

import ChampionTooltip from '../../../sub-components/champion-tooltips/champion-tooltips';
import TraitTooltip from '../../../sub-components/trait-tooltips/trait-tooltips';
import ItemTooltip from '../../../sub-components/item-tooltips/item-tooltips';
import TraitEmblem from '../../../sub-components/trait-emblem/trait-emblem';

import './match-basic.component.css';
import '../../base.css';

const MatchBasic = (props) => {
  const gameDataParse = () => {
    let players = props.gamedata.info.participants;
    let playersSorted =  [];
    let playerData = [];
    let myPlayer = [];
    
    playersSorted = players.sort(sortPlacementAscending);

    let color = 'blue';

    for (let player in playersSorted) {
      let data = playerDataParse(playersSorted[player], player)
      if (playersSorted[player].puuid === props.puuid) {
        if (playersSorted[player].placement > 4) {
          color = 'red';
        }
        myPlayer = selfDataParse(playersSorted[player], player);
      }

      playerData.push(data);
    }
    
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>} className={`background-header-${color}`}>
          {myPlayer}
        </AccordionSummary>
        <AccordionDetails className={`background-body-${color}`}>
        <table className={`background-body-${color}`}>
          <thead>
            <tr>
              <td style={{minWidth: '50px'}}>Rank</td>
              <td style={{minWidth: '200px'}}>Summoner</td>
              <td style={{minWidth: '75px'}}>Round</td>
              <td style={{minWidth: '75px'}}>Alive</td>
              <td style={{minWidth: '400px'}}>Traits</td>
              <td style={{minWidth: '600px'}}>Champions</td>
              <td style={{minWidth: '50px'}}>Gold</td>
              <td style={{minWidth: '40px'}}></td>
            </tr>
          </thead>
          <tbody>
            {playerData}
          </tbody>
        </table>
        </AccordionDetails>
      </Accordion>
    );
  }

  const traitsSort = (traits) => {
    let traitsRow = [];
    traits = traits.sort(sortTraitMatch);
    for (let trait of traits) {
      if (props.traits[trait.name] !== undefined) {
        if (trait.style > 0) {
          let image = props.traits[trait.name].patch_data.icon.substring(0, props.traits[trait.name].patch_data.icon.indexOf('dds')).toLowerCase();
          let traitStyle = props.traits[trait.name].sets[trait.tier_current-1].style;

          traitsRow.push(
            <Tooltip placement='top' title={<TraitTooltip trait={props.traits[trait.name]} count={trait.num_units} smallTooltip={true}/>} key={props.traits[trait.name].name} arrow>
            <div className='trait-layering-mb'>

              <TraitEmblem traitStyle={traitStyle} image={image} name={props.traits[trait.name].name} iconClassName='trait' background='background' imageError={props.imageError}/>
            </div>
            </Tooltip>
          );

        }
      }
    }
    return traitsRow;
  }

  const championsItemsSort = (championsSorted) => {
    let championsItemsRowSorted = [];
    for (let [i1, champion] of championsSorted.entries()) {
      let stars = [];
      let items = [];
      for (let i = 0; i < champion.tier; i++) {
        let starColor = '';
        switch(champion.rarity) {
          case 0:
            starColor = 't1';
            break;
          case 1:
            starColor = 't2';
            break;
          case 2:
            starColor='t3';
            break;
          case 3:
            starColor='t4';
            break;
          case 4:
            starColor='t5';
            break;
          default:
            starColor='t5';
            break;
        }

        stars.push(<Star className={`star ${starColor}`} key={i}/>);
      }
      for (let [i2, item] of champion.items.entries()) {
        if (item !== 10006) {
          let image = props.items[item].patch_data.icon.substring(0, props.items[item].patch_data.icon.indexOf('dds')).toLowerCase();
          items.push(
            <Tooltip placement='top' title={<ItemTooltip item={props.items[item]}/>} key={i2} arrow>
              <div className='item-row' key={i2}>
              <img src={assets_url(image)} alt={image} width={15} height={15} onError={props.imageError}/>
              </div>
            </Tooltip>
          );
        }
      }
      if (!items.length) {
        items.push(<div key={i1} className='item-row'></div>);
      }

      let trait_data = [];
      
      for (let i in props.champions[champion.character_id].traits) {
        trait_data.push(props.traits[props.champions[champion.character_id].traits[i]]);
      }

      championsItemsRowSorted.push(
        <div key={i1} className='champion-row'>
          <div>
            {stars}
          </div>
          <div>
            <Tooltip placement='top' title={<ChampionTooltip champion={props.champions[champion.character_id]} traits={trait_data} imageError={props.imageError}/>} arrow>
              <img src={props.champions[champion.character_id].patch_data.icon} alt={champion.name} className={`cost${props.champions[champion.character_id].cost}`} width={45} height={45} onError={props.imageError}/>
            </Tooltip>
          </div>
          <div>
            {items}
          </div>
        </div>
      );
    }
    return championsItemsRowSorted;
  }

  const playerPlacement = (rank) => {
    let placement = '';
    switch (rank) {
      case 1:
        placement = '1st';
        break;
      case 2:
        placement = '2nd';
        break;
      case 3:
        placement = '3rd';
        break;
      case 4:
        placement = '4th';
        break;
      default:
        placement = rank + 'th';
        break;
    }

    return (
      <div>
          {placement}
      </div>
    );
  }

  const timeConvert = (time) => {
    let t = new Date(1970, 0, 1);
    t.setUTCSeconds(time/1000);
    return t;
  }

  const selfDataParse = (player, index) => {
    let traits = player.traits;
    let traitsSorted = [];
    traitsSorted = traits.sort(sortTierMatchDescending);

    let champions = player.units;
    let championsSorted = [];
    championsSorted = champions.sort(sortTierDescending);

    let playerStuff = [];
    for (let i = 0; i < props.gamedata.info.participants.length; i++) {
      playerStuff.push(
        <div key={i} className='player-row'>
          <div><img src={props.gamedata.info.participants[i].companion.image_source} alt={props.gamedata.info.participants[i].companion.species} width={25} height={25} onError={props.imageError}/><span className='small-font'>{props.gamedata.info.participants[i].name}</span></div>
          <div><img src={props.gamedata.info.participants[i+1].companion.image_source} alt={props.gamedata.info.participants[i+1].companion.species} width={25} height={25} onError={props.imageError}/><span className='small-font'>{props.gamedata.info.participants[i+1].name}</span></div>
        </div>
      )
      i++
    }

    let gamelength = `${Math.floor(props.gamedata.info.game_length/60)}:`;
    let selflength = `${Math.floor(player.time_eliminated/60)}:`;
    let selfsec = Math.floor(player.time_eliminated%60);
    let sec = Math.floor(props.gamedata.info.game_length%60);
    if (sec < 10) {
      gamelength += '0';
    }
    gamelength += sec;

    if (selfsec < 10) {
      selflength += '0';
    }
    selflength += selfsec;

    let time = timeConvert(props.gamedata.info.game_datetime);
    let timeString = '';

    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    timeString = `${months[(new Date(time)).getUTCMonth()]} ${(new Date(time)).getUTCDate()} ${(new Date(time)).getUTCFullYear()}`

    let queue = 'Normal';
    if (props.gamedata.info.queue_id === 1100) {
      queue = 'Ranked';
    }
    else if (props.gamedata.info.queue_id === 1130) {
      queue = 'Turbo';
    }
    
    return (
      <div className='self-grid text'>
        <div>
          <div>
            {playerPlacement(player.placement)}
          </div>
          <div>
            {queue}
          </div>
          <div>
            {selflength} / {gamelength}
          </div>
          <div>
            {timeString}
          </div>
        </div>
        <div className='align'>
          <img src={player.companion.image_source} alt={player.companion.species} width={50} height={50} onError={props.imageError}/>
          <div className='black-circle'></div>
          <div className='level-align'>{player.level}</div>
        </div>
        <div className='align'>
          {traitsSort(traitsSorted)}
        </div>
        <div>
          {championsItemsSort(championsSorted)}
        </div>
        <div className='players-grid'>
          {playerStuff}
        </div>
      </div>
    );
  }

  const playerDataParse = (player, index) => {
    let traits = player.traits;
    let traitsSorted = [];
    traitsSorted = traits.sort(sortTierMatchDescending);

    let champions = player.units;
    let championsSorted = [];
    championsSorted = champions.sort(sortTierDescending);

    let last_round = player.last_round - 3;
    let main_round = Math.floor(last_round/6) + 1;
    let sub_round = (last_round % 6) + 1;

    return (
      <tr key={index}>
        <td>{playerPlacement(player.placement)}</td>
        <td>
          <img src={player.companion.image_source} alt={player.companion.species} width={50} height={50} onError={props.imageError}/>
          <div className='black-circle'></div>
          <div className='level-align'>{player.level}</div>
          {player.name}
        </td>
        <td>
          {main_round}-{sub_round}
        </td>
        <td>
          {Math.floor(player.time_eliminated/60)}:{Math.floor(player.time_eliminated%60)}
        </td>
        <td>
          {traitsSort(traitsSorted)}
        </td>
        <td>
          {championsItemsSort(championsSorted)}
        </td>
        <td>
          {player.gold_left}
        </td>
        <td>
          <div title="Save" className='save-mb'>
            <SaveIcon onClick={(e) => props.save(e, player, traitsSorted, championsSorted)}/>
          </div>
        </td>
      </tr>
    );
  }

  return(
    <div>
      {gameDataParse()}
    </div>
  );
}

export default MatchBasic;
