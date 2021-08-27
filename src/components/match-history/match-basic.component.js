import React, { Component } from 'react';
import { sortTierDescending, sortPlacementAscending, sortTierMatchDescending } from '../../api-helper/sorting.js'; 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Star from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import { assets_url, trait_bg_url } from '../../api-helper/urls.js';

import ChampionTooltip from '../../sub-components/champion-tooltips/champion-tooltips.js';
import TraitTooltip from '../../sub-components/trait-tooltips/trait-tooltips.js';
import ItemTooltip from '../../sub-components/item-tooltips/item-tooltips.js';

import './match-basic.component.css';

class MatchBasic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gamedata: this.props.gamedata,
      champions: this.props.champions,
      traits: this.props.traits,
      items: this.props.items,
    }

    this.championIdParse = this.championIdParse.bind(this);
  }

  componentDidMount = () => {
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

  championIdParse = (id) => {
    return id.replace(/'/, "").substring(id.indexOf('_') + 1).toLowerCase();
  }

  createTeam = (units) => {
    // let teamMembers = [];
    // for (let i in units) {
    //   let itemDiv = [];
    //    if (units[i].items.length === 3) {
    //      itemDiv.push(<img src={this.state.items[units[i].items[0]].image[3]} className='item-image-3items-left'/>)
    //      itemDiv.push(<img src={this.state.items[units[i].items[1]].image[3]} className='item-image'/>)
    //      itemDiv.push(<img src={this.state.items[units[i].items[2]].image[3]} className='item-image-3items-right'/>)
    //     }
    //    else if (units[i].items.length === 2) {
    //      itemDiv.push(<img src={this.state.items[units[i].items[0]].image[3]} className='item-image-2items-left'/>)
    //      itemDiv.push(<img src={this.state.items[units[i].items[1]].image[3]} className='item-image-2items-right'/>)
    //    }
    //    else if (units[i].items.length === 1) {
    //      itemDiv.push(<img src={this.state.items[units[i].items[0]].image[3]} className='item-image-1item'/>)
    //    }
    //    teamMembers.push(<div className='champion-row'><div><img src={this.state.champions[this.championIdParse(units[i].character_id)].icon} className='champion-image'/></div>{itemDiv}</div>);
    // }
    // return teamMembers;
  }

  gameDataParse = () => {
    let players = this.props.gamedata.info.participants;
    let playersSorted =  [];
    let playerData = [];
    let myPlayer = [];
    
    playersSorted = players.sort(sortPlacementAscending);

    for (let player in playersSorted) {
      let data = this.playerDataParse(playersSorted[player], player)
      if (playersSorted[player].puuid === this.props.puuid) {
        myPlayer = this.selfDataParse(playersSorted[player], player);
      }

      playerData.push(data);
    }
    
    //https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-tft/global/default/

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>} style={{backgroundColor: '#343a40'}}>
          <table className='backgrounds'>
            <tbody>
              {myPlayer}
            </tbody>
          </table>
        </AccordionSummary>
        <AccordionDetails>
        <table style={{width: '100%'}}>
          <thead>
            <tr>
              <td style={{minWidth: '50px'}}>Rank</td>
              <td style={{minWidth: '200px'}}>Summoner</td>
              <td style={{minWidth: '75px'}}>Round</td>
              <td style={{minWidth: '75px'}}>Alive</td>
              <td style={{minWidth: '400px'}}>Traits</td>
              <td style={{minWidth: '600px'}}>Champions</td>
              <td style={{minWidth: '50px'}}>Gold</td>
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

  traitsSort = (traits) => {
    let traitsRow = [];
    console.log(traits);
    for (let trait in traits) {
      if (this.props.traits[traits[trait].name] !== undefined) {
        if (traits[trait].tier_current > 0) {
          let image = this.props.traits[traits[trait].name].patch_data.icon.substring(0, this.props.traits[traits[trait].name].patch_data.icon.indexOf('dds')).toLowerCase();
          let traitStyle = this.props.traits[traits[trait].name].sets[traits[trait].tier_current-1].style;

          traitsRow.push(
            <td key={this.props.traits[traits[trait].name].name}>
              <Tooltip placement='top' title={<TraitTooltip trait={this.props.traits[traits[trait].name]} count={traits[trait].num_units} smallTooltip={true}/>} arrow>
              <div className='trait-layering'>
                <img src={trait_bg_url(traitStyle)} alt={traitStyle} className='background'/>
                <img src={assets_url(image)} alt={this.props.traits[traits[trait].name].name} className='trait'/>
              </div>
              </Tooltip>
            </td>
          );
        }
      }
    }
    return traitsRow;
  }

  championsItemsSort = (championsSorted) => {
    let championsItemsRowSorted = [];
    for (let champion in championsSorted) {
      let stars = [];
      let items = [];
      for (let i = 0; i < championsSorted[champion].tier; i++) {
        let starColor = '';
        switch(championsSorted[champion].rarity) {
          case 0:
            starColor = 't1-star';
            break;
          case 1:
            starColor = 't2-star';
            break;
          case 2:
            starColor='t3-star';
            break;
          case 3:
            starColor='t4-star';
            break;
          case 4:
            starColor='t5-star';
            break;
          default:
            starColor='t5-star';
            break;
        }

        stars.push(<Star className={starColor} key={i}/>);
      }

      for (let item in championsSorted[champion].items) {
        //let item_i = championsSorted[champion].items[item];
        let image = this.props.items['i' + championsSorted[champion].items[item]].patch_data.icon.substring(0, this.props.items['i' + championsSorted[champion].items[item]].patch_data.icon.indexOf('dds')).toLowerCase();
        items.push(
          <Tooltip placement='top' title={<ItemTooltip item={this.props.items['i' + championsSorted[champion].items[item]]}/>} key={item+image} arrow>
            <div style={{position: 'relative', display: 'inline-block', minWidth: '15px'}} key={item+image}>
            <img src={`https://raw.communitydragon.org/latest/game/${image}png`} alt={image} width={15} height={15}/>
            {/*<ItemTooltip placement="top" isOpen={this.isToolTipOpen(this.props.items['i'+item_i].name)} target={this.props.items['i'+item_i].id} toggle={() => this.toggle(this.props.items['i'+item_i].id)} name={this.props.items['i'+item_i].name}/>*/}
            </div>
          </Tooltip>
        );
      }

      championsItemsRowSorted.push(
        <td key={champion+championsSorted[champion].character_id}>
          <table>
            <tbody>
              <tr>
                <td style={{marginLeft: '10px'}}>{stars}</td>
              </tr>
              <tr>
                <td>
                  <Tooltip placement='top' title={<ChampionTooltip champion={this.props.champions[championsSorted[champion].character_id]}/>} arrow>
                    <img src={this.props.champions[championsSorted[champion].character_id].patch_data.icon} alt={championsSorted[champion].name} width={45} height={45}/>
                  </Tooltip>
                </td>
              </tr>
              <tr style={{minHeight: '15px'}}>
                <td style={{height: '15px'}}>{items}</td>
              </tr>
            </tbody>
          </table>
        </td>
      );
    }
    return championsItemsRowSorted;
  }

  playerPlacement = (rank) => {
    let rowBackground = '';
    let placement = '';
    switch (rank) {
      case 1:
        rowBackground = 'first';
        placement = '1st';
        break;
      case 2:
        rowBackground = 'second';
        placement = '2nd';
        break;
      case 3:
        rowBackground = 'third';
        placement = '3rd';
        break;
      case 4:
        rowBackground = 'fourth';
        placement = '4th';
        break;
      default:
        rowBackground = 'defeat';
        placement = rank + 'th';
        break;
    }

    return (
      <td className={rowBackground}>
          {placement}
      </td>
    );
  }

  selfDataParse = (player, index) => {
    let traits = player.traits;
    let traitsSorted = [];
    traitsSorted = traits.sort(sortTierMatchDescending);

    let champions = player.units;
    let championsSorted = [];
    championsSorted = champions.sort(sortTierDescending);

    let placement = '';

    console.log(this.props.gamedata.info);

    let playerStuff = [];
    for (let i = 0; i < this.props.gamedata.info.participants.length; i++) {
      playerStuff.push(
        <tr key={i}>
          <td><img src={this.props.gamedata.info.participants[i].companion.image_source} alt={this.props.gamedata.info.participants[i].companion.species} width={25} height={25}/></td><td>{this.props.gamedata.info.participants[i].name}</td>
          <td><img src={this.props.gamedata.info.participants[i+1].companion.image_source} alt={this.props.gamedata.info.participants[i+1].companion.species} width={25} height={25}/></td><td>{this.props.gamedata.info.participants[i+1].name}</td>
        </tr>
      )
      i++
    }

    console.log(index);
    
    return (
      <tr>
        <td>
          <table>
            <tbody>
              <tr>
                <td className='placement-font'>{placement}</td>
              </tr>
              <tr>
                <td>Level: {player.level}</td>
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <table>
            <tbody>
              <tr key={'t'+index}>
                {this.traitsSort(traitsSorted)}
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <table>
            <tbody>
              <tr key={'c'+index}>
                {this.championsItemsSort(championsSorted)}
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <table>
            <tbody>
              {playerStuff}
            </tbody>
          </table>
        </td>
      </tr>
    );
  }

  playerDataParse = (player, index) => {
    let traits = player.traits;
    let traitsSorted = [];
    traitsSorted = traits.sort(sortTierMatchDescending);

    let champions = player.units;
    let championsSorted = [];
    championsSorted = champions.sort(sortTierDescending);

    //let companion = companion_parse(player.companion);
    //console.log(companion);

    //console.log(player.name);
    //console.log(player.last_round);

    let last_round = player.last_round - 3;
    let main_round = Math.floor(last_round/6) + 1;
    let sub_round = (last_round % 6) + 1;

    return (
      <tr key={index}>
        {this.playerPlacement(player.placement)}
        <td>
          <img src={player.companion.image_source} alt={player.companion.species} width={25} height={25}/>
          {player.name}
        </td>
        <td>
          {main_round}-{sub_round}
        </td>
        <td>
          {Math.floor(player.time_eliminated/60)}:{Math.floor(player.time_eliminated%60)}
        </td>
        <td>
          <table>
            <tbody>
              <tr key={'a'+index}>
                {this.traitsSort(traitsSorted)}
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <table>
            <tbody>
              <tr key={'b'+index}>
                {this.championsItemsSort(championsSorted)}
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          {player.gold_left}
        </td>
      </tr>
    );
  }

  render = () => {
    return(
      <div className='backgrounds'>
        {this.gameDataParse()}
      </div>

    );
  }
}

export default MatchBasic;
