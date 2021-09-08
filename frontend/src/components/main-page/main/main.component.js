import React, { Component } from 'react';
import { postData, getDataFromId } from '../../../helper/api';
import ChampionsPanel from '../champions-panel/champions-panel';
import ItemsPanel from '../items-panel/items-panel';
import TraitsPanel from '../traits-panel/traits-panel';
import Button from '@material-ui/core/Button' ;
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import HelpIcon from '@material-ui/icons/Help';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import CopyDialog from '../../../sub-components/copy-dialog/copy-dialog';
import HelpDialog from '../../../sub-components/help-dialog/help-dialog';
import HexagonGrid from '../../../sub-components/hexagon-grid/hexagon-grid';
import { patch_data_url } from '../../../helper/urls';
import { sortTrait } from '../../../helper/sorting';
import { SET_NUMBER, champions, items, traits, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../../helper/variables';

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
      teamName: "",
      openCopyDialog: false,
      openHelpDialog: false,
    }

    this.findTraits = this.findTraits.bind(this);
    this.removeFromTeam = this.removeFromTeam.bind(this);
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
            this.setState({champions: champions_arr, items: items_arr, traits: traits_arr, team: data.team, teamName: data.name, loading: false}, () => {
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
    let champion = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < 28; i++) {
      if (team.findIndex(c => c.hexSlot === i) === -1) {
        this.findTraits(team, this.state.traits, data);
        team.push({champion: champion, tier: 1, items: [], hexSlot: i });
        this.setState({team: team});
        return;
      }
    }
  }

  removeFromTeam = (data) => {
    let team = this.state.team;
    if (this.state.draggedChampion.hexSlot === undefined) {
      return;
    }

    team.splice(team.findIndex(c => c.hexSlot === this.state.draggedChampion.hexSlot), 1);
    let traits = this.removeTraits(team, this.state.draggedChampion.champion);
    this.setState({ team: team, traits: traits });
  }

  clearTeam = () => {
    let traits = Object.assign({}, this.state.traits);
    Object.keys(traits).forEach((key, index) => {
      traits[key].count = 0;
      traits[key].champions = [];
      traits[key].tier = -1;
      traits[key].color = "";
    });
    this.setState({team: [], traits: traits, draggedChampion: {}, draggedItem: {}, teamName: ""});
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

  findTraits = (team, traits_t, champion) => {
    let traits = JSON.parse(JSON.stringify(traits_t));
    if (champion.name === undefined) {
      return;
    }
    let isDupe = false;
    for (let i of team) {
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
    return traits;
  }

  findTraitsFromEmblem = (champion, trait) => {
    let traits = JSON.parse(JSON.stringify(this.state.traits));
    
    if (!traits[trait].champions.includes(champion.champion.championId)) {
      traits[trait].count++;
    }
    traits[trait].champions.push(champion.champion.championId);

    this.setState({traits: traits});
  }

  handleChanges = (e) => {
    this.setState({ teamName: e.target.value });
  }

  copy = (event) => {
    this.setState({openCopyDialog: true});
  }

  help = (event) => {
    this.setState({openHelpDialog: true});
  }

  closeDialog = () => {
    this.setState({openCopyDialog: false, openHelpDialog: false});
  }

  handleSave = (event) => {
    let traits = [];
    for (let i of Object.values(this.state.traits)) {
      if (i.count > 0) {
        traits.push({key: i.key, champions: i.champions, count: i.count, color: i.color, tier: i.tier});
      }
    }

    traits = traits.sort(sortTrait);

    let team = [];
    for (let i of this.state.team) {
      let items = [];
      for (let item of i.items) {
        items.push(item);
      }

      team.push({ champion: { championId: i.champion.championId, traits: i.champion.traits }, tier: i.tier, items: items, hexSlot: i.hexSlot });
    }

    let teamName = this.state.teamName;
    if (teamName.trim() === "") {
      teamName = `${traits[0].count} ${this.state.traits[traits[0].key].name}, ${traits[1].count} ${this.state.traits[traits[1].key].name}`;
    }

    let teamObj = {name: teamName, team: team, traits: traits, date: new Date(), set: 5};
    postData('teams', teamObj, "");
    this.setState({error: true, errorSeverity: 'success', errorMessage: `Successfully saved team ${teamName}`});
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
    if (this.state.draggedChampion.championId !== undefined) {

      let index = team.findIndex(tm => tm.hexSlot === id);
      if (index > -1) {
        let traits = this.removeTraits(team, team[index].champion);
        team.splice(index, 1);
        this.findTraits(team, traits, this.state.draggedChampion);
      }
      else {
        this.findTraits(team, this.state.traits, this.state.draggedChampion);
      }
      team.push({champion: this.state.draggedChampion, tier: 1, items: [], hexSlot: id });
    }
    
    else if (this.state.draggedChampion.champion !== undefined) {
      let originalHexSlot = team.findIndex(tm => tm.hexSlot === this.state.draggedChampion.hexSlot);
      if (team.findIndex(tm => tm.hexSlot === id) > -1) {
        team[team.findIndex(tm => tm.hexSlot === id)].hexSlot = this.state.draggedChampion.hexSlot;
        team[originalHexSlot].hexSlot = id;
      }
      else {
        team[originalHexSlot].hexSlot = id;
      }
    }

    if (this.state.draggedItem.name !== undefined) {
      for (let teamMember of Object.values(this.state.team)) {
        if (teamMember.hexSlot === id) {

          if (teamMember.items.includes(this.state.draggedItem.id) && this.state.draggedItem.isUnique) {
            this.setState({error: true, errorSeverity: "warning", errorMessage: "Error: Unique item, only one per champion."});
            setTimeout(() => {
              this.setState({error: false});
            }, 3000);
          }

          else if (teamMember.items.includes(99) || teamMember.items.includes(2099)) {
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
            (this.state.draggedItem.isUnique && (this.state.draggedItem.id.toString().includes('8')))) {
              let traitFromItem = this.state.draggedItem.name.substring(0, this.state.draggedItem.name.indexOf('Emblem')-1);
              let trait = 'Set5_' + traitFromItem.replace(' ', '');
              if (teamMember.items.includes(this.state.draggedItem.id)) {
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
                  team[team.findIndex(t => t === teamMember)].items.push(this.state.draggedItem.id);
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
            team[team.findIndex(t => t === teamMember)].items.push(this.state.draggedItem.id);
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

  dragEnd = () => {
    this.setState({draggedChampion: {}, draggedItem: {}});
  }

  render = () => {
    require('./main.css');
    require('../../base.css');
    return (
      <div className='page-grid'>
        <div></div>
        <div>
          <h1 className='title'>Builder</h1>
          {this.state.loading && <CircularProgress size={24}/>}
          {this.state.error && <Alert severity={this.state.errorSeverity}>{this.state.errorMessage}</Alert>}
          {this.state.openCopyDialog && <CopyDialog team={this.state.team} traits={this.state.traits} items={this.state.items} name={this.state.teamName} open={this.state.openCopyDialog} onClose={this.closeDialog}/>}
          {this.state.openHelpDialog && <HelpDialog open={this.state.openHelpDialog} onClose={this.closeDialog}/>}
          { !this.state.loading &&
            <div>
              
              <TextField id="search" type="search" placeholder="Team name" variant="outlined" onChange={this.handleChanges} value={this.state.teamName} className="team-name"/>
              <div className='team-grid'>
                <div className='traits-container'>
                  <TraitsPanel traits={this.state.traits} champions={this.state.champions} team={this.state.team} imageError={this.imageError}/>
                </div>
                <HexagonGrid team={this.state.team} champions={this.state.champions} items={this.state.items} drop={this.drop} drag={this.dragFromGrid} dragEnd={this.dragEnd} imageError={this.imageError}/>
                <div>
                  <Button type="button" className="button-width" onClick={this.clearTeam}>
                    <ClearIcon className='icon-color'/><span className='icon-color'>Clear</span>
                  </Button>
                  <Button type="button" className="button-width" onClick={this.copy}>
                    <FileCopyIcon className='icon-color'/><span className='icon-color'>Copy</span>
                  </Button>
                  <Button type="button" className="button-width" onClick={this.handleSave} disabled={this.state.team.length === 0}>
                    <SaveIcon className='icon-color'/><span className='icon-color'>Save</span>
                  </Button>
                  <Button type="button" className="button-width" onClick={this.help}>
                    <HelpIcon className='icon-color'/><span className='icon-color'>Help</span>
                  </Button>
                </div>
              </div>
              <div className='panels-grid'>
                <ChampionsPanel champions={this.state.champions} traits={this.state.traits} addToTeam={this.addToTeam} drag={this.dragChampion} dragEnd={this.dragEnd} drop={this.removeFromTeam} imageError={this.imageError}/>
                <ItemsPanel items={this.state.items} itemsBasic={this.state.itemsBasic} drag={this.drag} dragEnd={this.dragEnd} imageError={this.imageError}/>

              </div>
            </div>
          }
        </div>
        <div></div>
      </div>
    );
  }
}
