import React, { Component } from 'react';
import { companion_parse } from '../../api-helper/string-parsing.js';
import { sortTierDescending, sortPlacementAscending, sortTierMatchDescending } from '../../api-helper/sorting.js'; 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          {myPlayer}
        </AccordionSummary>
      <table>
        <tbody>
          {playerData}
        </tbody>
      </table>
      </Accordion>
    );
  }

  playerDataParse = (player) => {
    let traits = player.traits;
    let traitsSorted = [];
    let traitsRow = [];

    traitsSorted = traits.sort(sortTierMatchDescending);

    

    for (let trait in traitsSorted) {
      if (this.props.traits[traitsSorted[trait].name] !== undefined) {
        if (traitsSorted[trait].tier_current > 0) {
          let image = this.props.traits[traitsSorted[trait].name].patch_data.icon.substring(0, this.props.traits[traitsSorted[trait].name].patch_data.icon.indexOf('dds')).toLowerCase();

          traitsRow.push(
            <td><img src={"https://raw.communitydragon.org/latest/game/" + image +"png"}/></td>
          );
        }
      }
    }

    let champions = player.units;
    let championsSorted = [];
    championsSorted = champions.sort(sortTierDescending);
    let championsItemsRowSorted = [];
    
    let stars = [];

    for (let champion in championsSorted) {
      stars.push(<td>{championsSorted[champion].tier}</td>)
      championsItemsRowSorted.push(
        <td><img src={require(`../../data/champions/` + championsSorted[champion].character_id + `.png`)} width={45} height={45}/></td>
      );
    }

    //let companion = companion_parse(player.companion);
    //console.log(companion);

    return (
      <tr>
        <td>
          <table>
            <tbody>
              <tr>
                <td>Placement: {player.placement}</td>
                <td>Level: {player.level}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                {stars}
              </tr>
              <tr>
                {championsItemsRowSorted}
              </tr>
              <tr>
                {traitsRow}
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    )
  }

  render = () => {
    return(
      <div>
        <p>{new Date(this.state.gamedata.info.game_datetime).toString()}</p>
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
