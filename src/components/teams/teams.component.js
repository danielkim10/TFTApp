import React, { Component } from 'react';
import { getSetData } from '../../helper/api';
import { sortTrait } from '../../helper/sorting';
import Alert from '@material-ui/lab/Alert';
import { patch_data_url } from '../../helper/urls';
import { SET_NUMBER, champions, items, traits, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../helper/variables';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import ChampionTooltip from '../../sub-components/champion-tooltips/champion-tooltips';
import ItemTooltip from '../../sub-components/item-tooltips/item-tooltips';
import TraitTooltip from '../../sub-components/trait-tooltips/trait-tooltips';

import './teams.component.css';

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      
      champions: {},
      traits: {},
      items: {},
      loading: true,
      error: false,
      errorSeverity: "",
      errorMessage: "",
    }
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

      getSetData("teams", 5).then(data => {
        this.setState({teams: data.map(team => team), champions: champions_arr, items: items_arr, traits: traits_arr, loading: false});
      }).catch((err) => {
        this.setState({
          loading: false,
          error: true,
          errorSeverity: "error",
          errorMessage: `Error retrieving patch data: ${err}. Try refreshing the page.`
        })
      });
    } catch (err) {
      console.error('Error retrieving patch data: ' + err);
    }
  }

  viewInBuilder = (e, teamID) => {
    let path = '/';
    this.props.history.push({
      pathname: path,
      search: `?teamID=${teamID}`,
      state: {
        teamID: teamID
      }
    });
  }

  copy = (e) => {
    console.log('adsf');
  }

  imageError = () => {
    this.setState({
      error: true, 
      errorSeverity: "warning", 
      errorMessage: "Warning: Some images failed to load. Refreshing the page may solve the problem."
    });
  }

  render() {
    let teams = [];

    for (let i = 0; i < this.state.teams.length; i++) {
      let teamMembers = [];
      let synergies = [];
      for (let j = 0; j < this.state.teams[i].team.length; j++) {
        let items = [];
        for (let item in this.state.teams[i].team[j].items) {
          let image = this.state.items[this.state.teams[i].team[j].items[item].id].patch_data.icon.substring(0, this.state.items[this.state.teams[i].team[j].items[item].id].patch_data.icon.indexOf('dds')).toLowerCase();
          items.push(
            <Tooltip placement='top' title={<ItemTooltip item={this.state.items[this.state.teams[i].team[j].items[item].id]}/>} key={item+image} arrow>
              <div style={{position: 'relative', display: 'inline-block', minWidth: '15px'}}>
                <img src={`https://raw.communitydragon.org/latest/game/${image}png`} alt={image} width={15} height={15}/>
              </div>
            </Tooltip>
          );
        }


        teamMembers.push(
          <table key={j + this.state.teams[i]._id}>
            <tbody>
              <tr>
                <td>
                <Tooltip placement='top' title={<ChampionTooltip champion={this.state.champions[this.state.teams[i].team[j].champion.championId]}/>} arrow>
                  <img src={this.state.champions[this.state.teams[i].team[j].champion.championId].patch_data.icon} alt={this.state.teams[i].team[j].champion.name} width={45} height={45}/>
                </Tooltip>
                </td>
              </tr>
              <tr>
                <td>{items}</td>
              </tr>
            </tbody>
          </table>
        );
      }
      teams.push(
        <table key={i}>
          <tbody>
            <tr>
              <td style={{display: 'inline-block'}}>{teamMembers}</td>
              <td><VisibilityIcon onClick={(e) => this.viewInBuilder(e, this.state.teams[i]._id)}/></td>
              <td><FileCopyIcon onClick={this.copy}/></td>
            </tr>
          </tbody>
        </table>
      );
    }
      return (
        <div className='text-color'>
          {this.state.error && <Alert severity={this.state.errorSeverity}>{this.state.errorMessage}</Alert>}
          <div>
            <h1>Teams</h1>
            <h2>Click on a team to open it in the builder</h2>
          </div>
          <div>
            {teams}
          </div>
        </div>
      )
  }
}

export default Teams
