import React, { Component } from 'react';
import { companion_parse } from '../../api-helper/string-parsing.js';
import { sortTierDescending, sortPlacementAscending, sortTierMatchDescending } from '../../api-helper/sorting.js'; 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Star from '@material-ui/icons/Star';

import ChampionTooltip from '../../sub-components/champion-tooltips.js';
import SynergyTooltip from '../../sub-components/synergies-tooltips.js';
import ItemTooltip from '../../sub-components/item-tooltips.js';

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
      let data = this.playerDataParse(playersSorted[player])
      if (playersSorted[player].puuid === this.props.puuid) {
        myPlayer = data;
      }

      playerData.push(data);
    }
    
    //https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-tft/global/default/

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>} style={{margin: '0px'}}>
          <table>
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
    for (let trait in traits) {
      if (this.props.traits[traits[trait].name] !== undefined) {
        if (traits[trait].tier_current > 0) {
          let image = this.props.traits[traits[trait].name].patch_data.icon.substring(0, this.props.traits[traits[trait].name].patch_data.icon.indexOf('dds')).toLowerCase();

          let traitStyle = this.props.traits[traits[trait].name].sets[traits[trait].tier_current-1].style;
          let traitBg = '';
          if (traitStyle === 'chromatic') {
            traitBg = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-tft/global/default/chromatic.png";
          }
          else if (traitStyle === 'gold') {
            traitBg = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-tft/global/default/gold.png";
          }
          else if (traitStyle === 'silver') {
            traitBg = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-tft/global/default/silver.png";
          }
          else {
            traitBg = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-tft/global/default/bronze.png";
          }

          traitsRow.push(
            <td key={this.props.traits[traits[trait].name]}>
              <div className='trait-layering'>
                <img src={traitBg} className='background'/>
                <img src={"https://raw.communitydragon.org/latest/game/" + image +"png"} className='trait'/>
              </div>
              
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
        let item_i = championsSorted[champion].items[item];
        let image = this.props.items['i' + championsSorted[champion].items[item]].patch_data.icon.substring(0, this.props.items['i' + championsSorted[champion].items[item]].patch_data.icon.indexOf('dds')).toLowerCase();
        items.push(
          <div style={{position: 'relative', display: 'inline-block'}}>
            <img src={`https://raw.communitydragon.org/latest/game/${image}png`} width={15} height={15}/>
            {/*<ItemTooltip placement="top" isOpen={this.isToolTipOpen(this.props.items['i'+item_i].name)} target={this.props.items['i'+item_i].id} toggle={() => this.toggle(this.props.items['i'+item_i].id)} name={this.props.items['i'+item_i].name}/>*/}
          </div>
        );
      }

      championsItemsRowSorted.push(
        <td>
          <table>
            <tbody>
              <tr>
                <td style={{marginLeft: '10px'}}>{stars}</td>
              </tr>
              <tr>
                <td><img src={require(`../../data/champions/` + championsSorted[champion].character_id + `.png`)} width={45} height={45}/></td>
              </tr>
              <tr style={{minWidth: '15px'}}>
                <td style={{height: '15px'}}>{items}</td>
              </tr>
            </tbody>
          </table>
        </td>
      );
    }
    return championsItemsRowSorted;
  }

  selfDataParse = (player) => {
    let traits = player.traits;
    let traitsSorted = [];
    traitsSorted = traits.sort(sortTierMatchDescending);

    let champions = player.units;
    let championsSorted = [];
    championsSorted = champions.sort(sortTierDescending);

    let rowBackground = '';
    let placement = '';
    
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
              <tr>
                {this.traitsSort(traitsSorted)}
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <table>
            <tbody>
              <tr>
                {this.championsItemSort(championsSorted)}
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    );
  }

  playerDataParse = (player) => {
    let traits = player.traits;
    let traitsSorted = [];
    traitsSorted = traits.sort(sortTierMatchDescending);

    let champions = player.units;
    let championsSorted = [];
    championsSorted = champions.sort(sortTierDescending);

    //let companion = companion_parse(player.companion);
    //console.log(companion);

    let rowBackground = '';
    let placement = '';
    switch (player.placement) {
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
        placement = player.placement + 'th';
        break;
    }

    console.log(player.name);

    // return (
    //   <tr>
    //     <td>
    //       <table className='row-border'>
    //         <tbody>
    //           <tr>
    //             <td>
    //               <table className={rowBackground}>
    //                 <tbody>
    //                   <tr>
    //                     <td className='placement-font'>{placement}</td>
    //                   </tr>
    //                   <tr>
    //                     <td>Level: {player.level}</td>
    //                   </tr>
    //                   <tr>
    //                     <td>Name: {player.name}</td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </td>
    //             <td>
    //               <table>
    //                 <tbody>
    //                   <tr>
    //                     {this.traitsSort(traitsSorted)}
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </td>
    //             <td>
    //               <table>
    //                 <tbody>
    //                   <tr>
    //                     {this.championsItemsSort(championsSorted)}
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </td>
    //   </tr>
    // )

    console.log(player.last_round);

    let last_round = player.last_round - 3;
    let main_round = Math.floor(last_round/6) + 1;
    let sub_round = (last_round % 6) + 1;

    return (
      <tr key={player.name}>
        <td className={rowBackground}>
          {placement}
        </td>
        <td>
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
              <tr key={'a'+player.name}>
                {this.traitsSort(traitsSorted)}
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <table>
            <tbody>
              <tr key={'b'+player.name}>
                {this.championsItemsSort(championsSorted)}
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          {player.gold_left}
        </td>
      </tr>
    )
  }

  render = () => {
    return(
      <div>
        <table>
          <tbody>
            <tr>
              <td>

              </td>
            </tr>
          </tbody>
        </table>
        {this.gameDataParse()}
      </div>

    );
  }
}

export default MatchBasic;
