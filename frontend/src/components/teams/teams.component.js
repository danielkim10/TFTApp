import React, { useState, useEffect } from 'react';
import { getSetData, deleteTeams, errorHandler } from '../../helper/api';
import { sortTeamDate } from '../../helper/sorting';
import Alert from '@material-ui/lab/Alert';
import { patch_data_url, assets_url } from '../../helper/urls';
import { SET_NUMBER, champions_fetch, items_fetch, traits_fetch, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../helper/variables';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import VisibilityIcon from '@material-ui/icons/Visibility';

import ChampionTooltip from '../../sub-components/champion-tooltips/champion-tooltips';
import ItemTooltip from '../../sub-components/item-tooltips/item-tooltips';
import TraitTooltip from '../../sub-components/trait-tooltips/trait-tooltips';
import TraitEmblem from '../../sub-components/trait-emblem/trait-emblem';

import './teams.component.css';

const Teams = (props) => {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [champions, setChampions] = useState({});
  const [traits, setTraits] = useState({});
  const [items, setItems] = useState({});
  const [error, setError] = useState(false);
  const [errorSeverity, setErrorSeverity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      let champions_arr = champions_fetch();
      let items_arr = items_fetch();
      let traits_arr = traits_fetch();

      try {
        let patchData = await fetch(patch_data_url()).then(res => {
          if (!res.ok) {
              let errorStr = errorHandler(res.status);
              setError(true);
              setErrorSeverity("error");
              setLoading(false);
              setErrorMessage(errorStr);
          }
          return res.json();
        });
        let thisSet = patchData.setData[SET_NUMBER];

        champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
        items_arr = item_patch_combine(items_arr, patchData.items);
        traits_arr = trait_patch_combine(traits_arr, thisSet.traits);

        setChampions(champions_arr);
        setItems(items_arr);
        setTraits(traits_arr);

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

          setTeams(data.map(team => team));
          setLoading(false);
        }).catch((err) => {
          setLoading(false);
          setError(true);
          setErrorSeverity("error");
          setErrorMessage(`Error retrieving patch data: ${err}. Try refreshing the page.`);
        });
      } catch (err) {
        setLoading(false);
        setError(true);
        setErrorSeverity("error");
        setErrorMessage(`Error retrieving patch data: ${err}. Try refreshing the page.`);
      }
    }

    fetchData();
  }, []);

  const viewInBuilder = (e, teamID) => {
    let path = '/';
    props.history.push({
      pathname: path,
      search: `?teamID=${teamID}`,
      state: {
        teamID: teamID
      }
    });
  }

  const imageError = () => {
    setError(true);
    setErrorSeverity("warning");
    setErrorMessage("Warning: Some images failed to load. Refreshing the page may solve the problem.");
  }

  let teams_t = [];
  let teamcounter = 0;
  for (let i of teams) {
    let teamMembers = [];
    teamcounter++;
    let counter = 0;
    for (let j of i.team) {
      counter++;
      let items_i = [];
      let itemcounter = 0;
      for (let item of j.items) {
        itemcounter++;
        let image = items[item].patch_data.icon.substring(0, items[item].patch_data.icon.indexOf('dds')).toLowerCase();
        items_i.push(
          <Tooltip placement='top' title={<ItemTooltip item={items[item]}/>} key={itemcounter} arrow>
            <div className='item-row'>
              <img src={assets_url(image)} alt={image} className='item-small' onError={imageError}/>
            </div>
          </Tooltip>
        );
      }

      if (!items_i.length) {
        items_i.push(<div key={counter} className='item-row'></div>)
      }

      let trait_data = [];
      for (let k of i.traits) {
        if (j.champion.traits.includes(k.key)) {
          trait_data.push(traits[k.key]);
        }
      }

      teamMembers.push(
        <div key={counter} className='champion-row'>
          <div>
            <Tooltip placement='top' title={<ChampionTooltip champion={champions[j.champion.championId]} traits={trait_data} imageError={imageError}/>} arrow>
              <div>
                <img src={champions[j.champion.championId].patch_data.icon} alt={j.champion.name} className={`portrait-small cost${champions[j.champion.championId].cost}`} onError={imageError}/>                
              </div>
            </Tooltip>
          </div>
          <div>
            {items_i}
          </div>
        </div>
      );
    }
    
    let traits_t = [];
    let traitcounter = 0;
    for (let j of i.traits) {
      traitcounter++;
      if (j.tier > 0) {
        let image = traits[j.key].patch_data.icon.substring(0, traits[j.key].patch_data.icon.indexOf('dds')).toLowerCase();
        traits_t.push(
          <div key={traitcounter} className='trait-row'>
            <Tooltip placement='top' title={<TraitTooltip trait={traits[j.key]} count={j.count} smallTooltip={true}/>} arrow>
              <div key={j.key} className='trait-layering'>
                <TraitEmblem traitStyle={j.color} image={image} name={traits[j.key].name} iconClassName='trait' background='background-team' imageError={imageError}/>
              </div>
            </Tooltip>
          </div>
        );
      }
    }

    teams_t.push(
      <div key={teamcounter}>
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
          <div>{traits_t}</div>
          <div title="Open in Builder" className='visibility'><VisibilityIcon onClick={(e) => viewInBuilder(e, i._id)}/></div>
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
        {error && <Alert severity={errorSeverity}>{errorMessage}</Alert>}
        {loading && <CircularProgress size={24}/>}
        <div>
          {!loading && teams_t.length === 0 && 
            <div className='team-header'>
              No teams found
            </div>
          }
          {!loading && teams_t}
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Teams;
