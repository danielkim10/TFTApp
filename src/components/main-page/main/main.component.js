import React, { Component } from 'react';
import { postData, errorHandler, getDataFromId } from '../../../helper/api';
import ChampionsPanel from '../champions-panel/champions-panel';
import ItemsPanel from '../items-panel/items-panel';
import TraitsPanel from '../traits-panel/traits-panel';
import Button from '@material-ui/core/Button' ;
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import CopyDialog from '../../../sub-components/copy-dialog/copy-dialog';
import HexagonGrid from '../../../sub-components/hexagon-grid/hexagon-grid';
import { patch_data_url } from '../../../helper/urls';
import { SET_NUMBER, champions, items, traits, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../../helper/variables';

import './main.css';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team: [],
      champions: {
        name: "",
        patch_data: {},
      },
      traits: {},
      selectedTraits: [],
      items: {
        name: "",
        patch_data: {},
      },
      itemsBasic: [],
      draggedChampion: {},
      draggedItem: {},
      error: false,
      errorSeverity: "error",
      errorMessage: "",
      text: {
        teamName: "",
        searchNameChamps: "",
        searchNameItems: "",
      },
      openDialog: false,
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

  componentDidMount = async () => {
    this.setState({loading: true});

    let champions_arr = champions();
    let items_arr = items();
    let traits_arr = traits();

    try {
      let patchData = await fetch(patch_data_url()).then(res => res.json());
      let thisSet = patchData.setData[SET_NUMBER];

      champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
      items_arr = item_patch_combine(items_arr, patchData.items);
      traits_arr = trait_patch_combine(traits_arr, thisSet.traits);

      if (this.props.location.search) {
        if (this.props.location.state) {
          getDataFromId("teams", this.props.location.state.teamID).then(data => {
            console.log(data);
            this.setState({champions: champions_arr, items: items_arr, traits: traits_arr, team: data.team, loading: false}, () => {
              this.findTraitsInitial(data.team);
            });
          });
        }
      }
      else {
        this.setState({champions: champions_arr, items: items_arr, traits: traits_arr, loading: false});
      }
    } catch (err) {
      console.error('Error retrieving patch data: ' + err);
    }
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

  findTraitsInitial = (team) => {
    let traits = JSON.parse(JSON.stringify(this.state.traits));
    for (let i of team) {
      for (let j of i.champion.traits) {
        if (!traits[j].champions.includes(i.champion.championId)) {
          traits[j].count++;
        }
        traits[j].champions.push(i.champion.championId);
      }
    }
    this.setState({traits: traits});
  }

  findTraits = (team, champion) => {
    let traits = JSON.parse(JSON.stringify(this.state.traits));
    if (champion.name === undefined) {
      return;
    }
    let isDupe = false;
    for (let i of team) {
      console.log(i);
      if (i.champion.name === champion.name) {
        isDupe = true;
      }
    }
    for (let j of champion.traits) {
      if (!isDupe) {
        traits[j].count++;
      }
      traits[j].champions.push(champion.championId);
    }
    this.setState({traits: traits});
  }

  removeTraits = (team, champion) => {
    let traits = JSON.parse(JSON.stringify(this.state.traits));
    if (champion === undefined) {
      return;
    }

    for (let i of champion.traits) {
      traits[i].champions.splice(traits[i].champions.findIndex(c => c === champion.championId), 1);
      if (traits[i].champions.findIndex(c => c === champion.championId) < 0) {
        traits[i].count -= 1;
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
    console.log(this.state.team);
    this.setState({openDialog: true});
  }

  closeDialog = () => {
    this.setState({openDialog: false});
  }

  handleSave = (event) => {
    let teamObj = {name: this.state.text.teamName, team: this.state.team, date: new Date(), set: 5};
    postData('teams', teamObj, "");
    this.setState({error: true, errorSeverity: 'success', errorMessage: `Successfully saved team ${this.state.text.teamName}`});
    setTimeout(() => {
      this.setState({error: false});
    }, 3000);
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
      if (team.findIndex(tm => tm.hexSlot === id) > -1) {
        team[team.findIndex(tm => tm.hexSlot === id)].hexSlot = this.state.draggedChampion.hexSlot;
        team[team.findIndex(tm => tm.champion.name === this.state.draggedChampion.champion.name)].hexSlot = id;
      }
      else {
        team[team.findIndex(tm => tm.champion.name === this.state.draggedChampion.champion.name)].hexSlot = id;
      }
    }

    if (this.state.draggedItem.name !== undefined) {
      for (let teamMember of Object.values(this.state.team)) {
        if (teamMember.hexSlot === id) {

          if (teamMember.items.includes(this.state.draggedItem) && this.state.draggedItem.isUnique) {
            this.setState({error: true, errorSeverity: "warning", errorMessage: "Error: Unique item, only one per champion."});
            setTimeout(() => {
              this.setState({error: false});
            }, 3000);
          }

          else if (teamMember.items.includes(this.state.items['99']) || teamMember.items.includes(this.state.items['2099'])) {
            this.setState({error: true, errorSeverity: "warning", errorMessage: "Error: No item slots remaining."});
            setTimeout(() => {
              this.setState({error: false});
            }, 3000);
          }

          else if (teamMember.items.length > 0 && (this.state.draggedItem.id === 99 || this.state.draggedItem.id === 2099)) {
            this.setState({error: true, errorSeverity: "warning", errorMessage: "Error: Item consumes three item slots."});
            setTimeout(() => {
              this.setState({error: false});
            }, 3000);
          }

          else if (this.state.draggedItem.isElusive || 
            (this.state.draggedItem.isUnique && this.state.draggedItem.id).toString().includes('8')) {
              let traitFromItem = this.state.draggedItem.name.substring(0, this.state.draggedItem.name.indexOf('Emblem')-1);
              let trait = 'Set5_' + traitFromItem.replace(' ', '');
              if (teamMember.items.includes(this.state.draggedItem)) {
                this.setState({error: true, errorSeverity: "warning", errorMessage: "Error: Unique item, only one per champion."});
                setTimeout(() => {
                  this.setState({error: false});
                }, 3000);
              }
              else if (teamMember.champion.traits.includes(trait)) {
                this.setState({error: true, errorSeverity: "warning", errorMessage: "Error: Champion is already a " + trait});
                setTimeout(() => {
                  this.setState({error: false});
                }, 3000);
              }
              else {
                if (teamMember.items.length < 3) {
                  team[team.findIndex(t => t === teamMember)].champion.traits.push(trait);
                  team[team.findIndex(t => t === teamMember)].items.push(this.state.draggedItem);
                  this.findTraitsFromEmblem(team[team.findIndex(t => t === teamMember)], trait);
                }
                else {
                  this.setState({error: true, errorSeverity: "warning", errorMessage: "Error: No item slots remaining."});
                  setTimeout(() => {
                    this.setState({error: false});
                  }, 3000);
                }
              }
            
          }

          else if (teamMember.items.length < 3) {
            team[team.findIndex(t => t === teamMember)].items.push(this.state.draggedItem);
          }
          else {
            this.setState({error: true, errorSeverity: "warning", errorMessage: "Error: No item slots remaining."});
            setTimeout(() => {
              this.setState({error: false});
            }, 3000);
          }
        }
      }
    }
    this.setState({team: team, draggedItem: {}, draggedChampion: {}});
  }

  imageError = () => {
    this.setState({
      error: true, 
      errorSeverity: "warning", 
      errorMessage: "Warning: Some images failed to load. Refreshing the page may solve the problem."
    });
  }

  saveTraits = (traits) => {
    this.setState({selectedTraits: traits});
  }

  render = () => {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td className='side-margins'></td>
              <td className='main-content'>
              {this.state.loading && <CircularProgress size={24}/>}
                {this.state.openDialog && <CopyDialog team={this.state.team} traits={this.state.selectedTraits} name={this.state.text.teamName} open={this.state.openDialog} onClose={this.closeDialog}/>}
                { !this.state.loading &&
                  <div className='button-row'>
                    <Button type="button" className="button-width" onClick={this.clearTeam}>
                      <ClearIcon className='icon-color'/><span className='icon-color'>Clear</span>
                    </Button>
                    <Button type="button" className="button-width" onClick={this.copy}>
                      <FileCopyIcon className='icon-color'/><span className='icon-color'>Copy</span>
                    </Button>
                    <Button type="button" className="button-width" onClick={this.handleSave}>
                      <SaveIcon className='icon-color'/><span className='icon-color'>Save</span>
                    </Button>
                    <div>
                      {this.state.error && <Alert severity={this.state.errorSeverity}>{this.state.errorMessage}</Alert>}
                    </div>
                    <TextField id="search" type="search" placeholder="Team name" variant="outlined" onChange={this.handleChanges} className="team-name"/>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{width: '20%', verticalAlign: 'top'}}>
                            <TraitsPanel traits={this.state.traits} champions={this.state.champions} imageError={this.imageError} saveTraits={this.saveTraits}/>
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
                                            <ChampionsPanel champions={this.state.champions} traits={this.state.traits} addToTeam={this.addToTeam} drag={this.dragChampion} drop={this.removeFromTeam} imageError={this.imageError}/>
                                          </td>
                                          <td style={{width: '50%', verticalAlign: 'top'}}>
                                            <ItemsPanel items={this.state.items} itemsBasic={this.state.itemsBasic} drag={this.drag} imageError={this.imageError}/>
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
              <td className='side-margins'></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
