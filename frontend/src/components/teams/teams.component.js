import React, { Component } from 'react';
import { getSetData, deleteTeams, errorHandler } from '../../helper/api';
import { sortTeamDate } from '../../helper/sorting';
import Alert from '@material-ui/lab/Alert';
import { patch_data_url, assets_url } from '../../helper/urls';
import { SET_NUMBER, champions, items, traits, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../helper/variables';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import VisibilityIcon from '@material-ui/icons/Visibility';

import ChampionTooltip from '../../sub-components/champion-tooltips/champion-tooltips';
import ItemTooltip from '../../sub-components/item-tooltips/item-tooltips';
import TraitTooltip from '../../sub-components/trait-tooltips/trait-tooltips';
import TraitEmblem from '../../sub-components/trait-emblem/trait-emblem';

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
      let patchData = await fetch(patch_data_url()).then(res => {
        if (!res.ok) {
            let errorStr = errorHandler(res.status);
            this.setState({error: true, errorSeverity: "error", loading: false, errorMessage: errorStr});
        }
        return res.json();
      });
      let thisSet = patchData.setData[SET_NUMBER];

      champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
      items_arr = item_patch_combine(items_arr, patchData.items);
      traits_arr = trait_patch_combine(traits_arr, thisSet.traits);

      getSetData("teams", 5).then(data => {
        data.sort(sortTeamDate);
        if (data.length > 10) {
          let dataExcess = data.slice(10, data.length);
          let teamsToDelete = [];
          for (let i of dataExcess) {
            teamsToDelete.push(i._id);
          }
          deleteTeams("teams", teamsToDelete);
          data = data.slice(0, 10);
        }


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

  imageError = () => {
    this.setState({
      error: true, 
      errorSeverity: "warning", 
      errorMessage: "Warning: Some images failed to load. Refreshing the page may solve the problem."
    });
  }

  render() {
    require('./teams.component.css');
    require('../base.css');
    let teams = [];
    for (let i of this.state.teams) {
      let teamMembers = [];
      for (let j of i.team) {
        let items = [];
        for (let item of j.items) {
          let image = this.state.items[item].patch_data.icon.substring(0, this.state.items[item].patch_data.icon.indexOf('dds')).toLowerCase();
          items.push(
            <Tooltip placement='top' title={<ItemTooltip item={this.state.items[item]}/>} key={item+image} arrow>
              <div className='item-row'>
                <img src={assets_url(image)} alt={image} className='item-small'/>
              </div>
            </Tooltip>
          );
        }

        if (!items.length) {
          items.push(<div className='item-row'></div>)
        }

        let trait_data = [];
        for (let k of i.traits) {
          if (j.champion.traits.includes(k.key)) {
            trait_data.push(this.state.traits[k.key]);
          }
        }

        teamMembers.push(
          <div className='champion-row'>
            <div>
              <Tooltip placement='top' title={<ChampionTooltip champion={this.state.champions[j.champion.championId]} traits={trait_data}/>} arrow>
                <div>
                  <img src={this.state.champions[j.champion.championId].patch_data.icon} alt={j.champion.name} className={`portrait-small cost${this.state.champions[j.champion.championId].cost}`}/>                
                </div>
              </Tooltip>
            </div>
            <div>
              {items}
            </div>
          </div>
        );
      }

      
      let traits = [];
      for (let j of i.traits) {
        if (j.tier > 0) {
          let image = this.state.traits[j.key].patch_data.icon.substring(0, this.state.traits[j.key].patch_data.icon.indexOf('dds')).toLowerCase();
          traits.push(
            <div className='trait-row'>
              <Tooltip placement='top' title={<TraitTooltip trait={this.state.traits[j.key]} count={j.count} smallTooltip={true}/>} arrow>
                <div key={j.key} className='trait-layering'>
                  <TraitEmblem traitStyle={j.color} image={image} name={this.state.traits[j.key].name} iconClassName='trait' background='background-team' onError={this.imageError}/>
                </div>
              </Tooltip>
            </div>
          );
        }
      }

      teams.push(
        <div>
          <div className='team-header'>
            <div className='team-name-teams'>
              {i.name}
            </div>
            <div className='team-date'>
              {new Date(i.date).toUTCString()}
            </div>
          </div>
          <div className='teams-grid'>
            <div>{teamMembers}</div>
            <div>{traits}</div>
            <div title="Open in Builder" className='visibility'><VisibilityIcon onClick={(e) => this.viewInBuilder(e, i._id)}/></div>
          </div>
        </div>
      );
    }

      return (
        <div className='page-grid'>
          <div></div>
          <div>
            <div>
              <h1 className='title'>Teams</h1>
              <h3 className='subtitle'>Up to 10 teams can be stored in the database</h3>
            </div>
            {this.state.error && <Alert severity={this.state.errorSeverity}>{this.state.errorMessage}</Alert>}
            {this.state.loading && <CircularProgress size={24}/>}
            <div>
              {!this.state.loading && teams.length === 0 && 
                <div className='team-header'>
                  No teams found
                </div>
              }
              {!this.state.loading && teams}
            </div>
          </div>
          <div></div>
        </div>
      );
  }
}

export default Teams
