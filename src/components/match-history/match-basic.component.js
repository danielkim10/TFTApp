import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { sortTierMatchDescending } from '../../api-helper/sorting.js'; 

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
    let playerData = [];
    
    for (let player in players) {
      playerData.push(this.playerDataParse(players[player]));
    }
    

    return (
      <table>
        <tbody>
          {playerData}
        </tbody>
      </table>
    );
  }

  playerDataParse = (player) => {
    let traits = player.traits;
    let traitsSorted = [];
    let traitsRow = [];

    traitsSorted = traits.sort(sortTierMatchDescending);

    for (let trait in traitsSorted) {
      console.log(this.props.traits[traits[trait].name]);
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
    let championsItemsRowUnsorted = [];
    let championsItemsRowSorted = [];

    for (let champion in champions) {

    }

    return (
      <tr>
        <td>
          <table>
            <tbody>
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
      <Card>
        <CardHeader>
          <p>{new Date(this.state.gamedata.info.game_datetime).toString()}</p>
        </CardHeader>
        <CardBody>
          <table>
            <tbody>
              <tr>
                <td>

                </td>
              </tr>
            </tbody>
          </table>
          <p>{this.state.gamedata.info.participants[0].level}</p>
          <p>{this.state.gamedata.info.participants[0].placement}</p>
          {this.gameDataParse()}
        </CardBody>
      </Card>

    );
  }
}

export default MatchBasic;
