import React, { Component } from 'react';
import { Alert, Input } from 'reactstrap';
import { postData } from '../../../api-helper/api';
import ChampionsPanel from '../champions-panel/champions-panel';
import ItemsPanel from '../items-panel/items-panel';
import TraitsPanel from '../traits-panel/traits-panel';
import { Button } from '@material-ui/core' ;
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CircularProgress from '@material-ui/core/CircularProgress';
import HexagonGrid from '../../../sub-components/hexagon-grid/hexagon-grid';
import { champion_icon_parse } from '../../../api-helper/string-parsing';
import { patch_data_url } from '../../../api-helper/urls';

import './main.css';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team: [],
      teamString: "",
      synergies: {},
      champions: {
        name: "",
        patch_data: {},
      },
      traits: {},
      items: {
        name: "",
        patch_data: {},
      },
      itemsBasic: [],
      draggedChampion: {},
      draggedItem: {},
      showAlert: false,
      alertVariant: "danger",
      alertMessage: "",
      text: {
        teamName: "",
        searchNameChamps: "",
        searchNameItems: "",
      },
    }
    this.findTraits = this.findTraits.bind(this);
    this.clearTeam = this.clearTeam.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.copy = this.copy.bind(this);
    this.addToTeam = this.addToTeam.bind(this);
    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
  }

  componentDidMount = () => {
    this.setState({loading: true});
    let champions = require("../../../data/champions.json");
    let items = require("../../../data/items.json");
    let traits = require("../../../data/traits.json");

    let champions_arr = {};
    for (let champion in champions) {
      if (champions[champion].championId.startsWith("TFT5_")) {
        champions_arr[champions[champion].championId] = champions[champion]; 
      }
    }

    let items_arr = {};
    for (let item in items) {
      items_arr['i' + items[item].id] = items[item];
    }

    let traits_arr = {};
    for (let trait in traits) {
      traits_arr[traits[trait].key] = traits[trait];
    }

    fetch(patch_data_url()).then(res => res.json()).then(res => {
      console.log(res);
      for (let champion in res.setData[5].champions) {
        if (champions_arr[res.setData[5].champions[champion].apiName] !== undefined) {
          champions_arr[res.setData[5].champions[champion].apiName].patch_data = res.setData[5].champions[champion];
          champions_arr[res.setData[5].champions[champion].apiName].patch_data.icon = champion_icon_parse(champions_arr[res.setData[5].champions[champion].apiName].patch_data.icon);
        }
      }

      for (let item in res.items) {
        if (items_arr['i' + res.items[item].id] !== undefined) {
          if (items_arr['i' + res.items[item].id].name.replaceAll(' ', '').toLowerCase() === res.items[item].name.replaceAll(' ', '').toLowerCase()) {
            items_arr['i' + res.items[item].id].patch_data = res.items[item];
          }
          else {
            if (items_arr['i' + res.items[item].id].patch_data === undefined) {
              items_arr['i' + res.items[item].id].patch_data = res.items[item];
            }
          }
        }
      }

      for (let trait in res.setData[5].traits) {
        if (traits_arr[res.setData[5].traits[trait].apiName] !== undefined) {
          traits_arr[res.setData[5].traits[trait].apiName].patch_data = res.setData[5].traits[trait];
          traits_arr[res.setData[5].traits[trait].apiName].count = 0;
          traits_arr[res.setData[5].traits[trait].apiName].champions = [];
        }

      }
      this.setState({champions: champions_arr, items: items_arr, traits: traits_arr, loading: false});
    }).catch((err) => {
      console.error('Error retrieving patch data: ' + err);
    });
    console.log(champions_arr);
    console.log(items_arr);
    console.log(traits_arr)

    
  }

  addToTeam = (e, data) => {
    let team = this.state.team;

    for (let i = 0; i < 28; i++) {
      if (team.findIndex(c => c.hexSlot === i) === -1) {
        this.findTraits(team, data);
        team.push({champion: data, tier: 1, items: [], remainingSlots: 3, hexSlot: i });
        this.setState({team: team});
        return;
      }
    }
  }

  removeFromTeam = (data) => {
    let team = this.state.team;
    team.splice(team.findIndex(c => c.hexSlot === this.state.draggedChampion.hexSlot), 1);
    this.setState({ team: team });
    this.removeTraits(team, this.state.draggedChampion.champion);
  }

  clearTeam = () => {
    let traits = Object.assign({}, this.state.traits);
    Object.keys(traits).forEach((key, index) => {
      traits[key].count = 0;
      traits[key].champions = [];
    });
    this.setState({team: [], traits: traits, draggedChampion: {}, draggedItem: {}, text: {teamName: "", searchNameChamps: "", searchNameItems: ""}});
  }

  findTraits = (team, champion) => {
    let traits = JSON.parse(JSON.stringify(this.state.traits));
    if (champion.name === undefined) {
      return;
    }
    let isDupe = false;
    for (let i in team) {
      if (team[i].champion.name === champion.name) {
        isDupe = true;
      }
    }
    for (let j = 0; j < champion.traits.length; ++j) {
      if (!isDupe) {
        traits[champion.traits[j]].count++;
      }
      traits[champion.traits[j]].champions.push(champion.championId);
    }
    this.setState({traits: traits});
  }

  removeTraits = (team, champion) => {
    let traits = JSON.parse(JSON.stringify(this.state.traits));
    if (champion === undefined) {
      return;
    }

    for (let i = 0; i < champion.traits.length; i++) {
      traits[champion.traits[i]].champions.splice(traits[champion.traits[i]].champions.findIndex(c => c === champion.championId), 1);
      if (traits[champion.traits[i]].champions.findIndex(c => c === champion.championId) < 0) {
        traits[champion.traits[i]].count -= 1;
      }
    }
    this.setState({traits: traits});
  }

  findTraitsFromEmblem = (champion, trait) => {
    let traits = Object.assign({}, this.state.traits);
    
    if (!traits[trait].champions.includes(champion.championId)) {
      traits[trait].count++;
    }
    traits[trait].champions.push(champion.championId);

    this.setState({traits: traits});
  }

  handleChanges = (e) => {
    let text = Object.assign({}, this.state.text);
    text[e.target.name] = e.target.value;
    this.setState({text: text});
  }
  copy = (event) => {
    
  }
  handleSave = (event) => {
    let teamObj = {name: this.state.text.teamName, team: this.state.team, synergies: this.state.synergies, teamString: this.state.teamString, set: 1, patch: "10.10"};
    postData('teams', teamObj, "");
    this.setState({showAlert: true, alertVariant: 'success', alertMessage: `Successfully saved team ${this.state.text.teamName}`})
  }

  drag = (e, item) => {
    e.dataTransfer.setData("text", e.target.id);
    this.setState({draggedItem: item});
  }

  dragChampion = (e, champion) => {
    e.dataTransfer.setData("text", e.target.id);
    let c = JSON.parse(JSON.stringify(champion));
    this.setState({draggedChampion: c});
  }

  dragFromGrid = (e, hexagonData) => {
    e.dataTransfer.setData("text", e.target.id);
    let hData = JSON.parse(JSON.stringify(hexagonData));
    this.setState({draggedChampion: hData});
  }

  drop = (e, id) => {
    e.preventDefault();

    let team = this.state.team;

    if (this.state.draggedChampion.name !== undefined) {
      this.findTraits(team, this.state.draggedChampion);
      team.push({champion: this.state.draggedChampion, tier: 1, items: [], remainingSlots: 3, hexSlot: id });
    }

    else if (this.state.draggedChampion.champion !== undefined) {
      //console.log(team.findIndex(tm => tm.hexSlot === id));
      if (team.findIndex(tm => tm.hexSlot === id) > -1) {
        team[team.findIndex(tm => tm.hexSlot === id)].hexSlot = this.state.draggedChampion.hexSlot;
      //let championslotId = this.state.draggedChampion.hexSlot;
        team[team.findIndex(tm => tm.champion.name === this.state.draggedChampion.champion.name)].hexSlot = id;
      }
      else {
        // console.log(team.findIndex(tm => tm.champion.name === this.state.draggedChampion.champion.name));
        team[team.findIndex(tm => tm.champion.name === this.state.draggedChampion.champion.name)].hexSlot = id;
        console.log(team);
      }
    }

    if (this.state.draggedItem.name !== undefined) {
      for (let teamMember in this.state.team) {
        if (this.state.team[teamMember].hexSlot === id) {

          if (this.state.team[teamMember].items.includes(this.state.draggedItem) && this.state.draggedItem.isUnique) {
            console.error('Error: Unique item, only one per champion');
          }

          else if (this.state.team[teamMember].items.includes(this.state.items['i99']) || this.state.team[teamMember].items.includes(this.state.items['i2099'])) {
            console.error('Error: Item consuesm three item slots 1');
          }

          else if (this.state.team[teamMember].items.length > 0 && (this.state.draggedItem.id === 99 || this.state.draggedItem.id === 2099)) {
            console.error('Error: Item consumes three item slots 2');
          }

          else if (this.state.draggedItem.isElusive || 
            (this.state.draggedItem.isUnique && this.state.draggedItem.id).toString().includes('8')) {
              let traitFromItem = this.state.draggedItem.name.substring(0, this.state.draggedItem.name.indexOf('Emblem')-1);
              let trait = 'Set5_' + traitFromItem.replace(' ', '');
              if (this.state.team[teamMember].items.includes(this.state.draggedItem)) {
                console.error('Error: Item cannot be equipped to this champion');
              }
              else if (this.state.team[teamMember].champion.traits.includes(trait)) {
                console.error('Error: Champion is already a ' + trait);
              }
              else {
                if (this.state.team[teamMember].items.length < 3) {
                  team[teamMember].champion.traits.push(trait);
                  team[teamMember].items.push(this.state.draggedItem);
                  this.findTraitsFromEmblem(team[teamMember], trait);
                }
                else {
                  console.error('Error: No item slots remaining');
                }
              }
            
          }

          else if (this.state.team[teamMember].items.length < 3) {
            team[teamMember].items.push(this.state.draggedItem);
          }
          else {
            console.error('Error: No item slots remaining');
          }
        }
      }
    }
    this.setState({team: team, draggedItem: {}, draggedChampion: {}});
  }

  render = () => {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td style={{width: '16%'}}></td>
              <td style={{width: '66%'}}>
              {this.state.loading && <CircularProgress size={24}/>}
                { !this.state.loading &&
                  <div>
                    <Button type="button" color="primary" style={{width: '33%'}} onClick={this.clearTeam}>
                      <ClearIcon/> Clear
                    </Button>
                    <Button type="button" color="primary" style={{width: '33%'}} onClick={this.copy}>
                      <FileCopyIcon/> Copy
                    </Button>
                    <Button type="button" color="primary" style={{width: '33%'}} onClick={this.handleSave}>
                      <SaveIcon/> Save
                    </Button>
                    <div>
                      <Alert color={this.state.alertVariant} isOpen={this.state.showAlert}>{this.state.alertMessage}</Alert>
                    </div>
                    <Input type="text" id="search" name="teamName" onChange={this.handleChanges} placeholder="Team Name"/>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{width: '20%', verticalAlign: 'top'}}>
                            <TraitsPanel traits={this.state.traits} champions={this.state.champions}/>
                          </td>
                          <td style={{width: '80%'}}>
                            <table>
                              <tbody>
                                <tr>
                                  <td style={{width: '75%'}}>
                                    <HexagonGrid team={this.state.team} drop={this.drop} drag={this.dragFromGrid}/>
                                  </td>
                                  <td style={{width: '25%'}}></td>
                                </tr>
                                <tr>
                                  <td style={{width: '25%'}}>
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td style={{width: '50%', verticalAlign: 'top'}}>
                                            <ChampionsPanel champions={this.state.champions} traits={this.state.traits} addToTeam={this.addToTeam} drag={this.dragChampion} drop={this.removeFromTeam}/>
                                          </td>
                                          <td style={{width: '50%', verticalAlign: 'top'}}>
                                            <ItemsPanel items={this.state.items} itemsBasic={this.state.itemsBasic} drag={this.drag}/>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td style={{width: '25%'}}></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                }
              </td>
              <td style={{width: '16%'}}></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
