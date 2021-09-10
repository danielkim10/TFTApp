import React, { useState, useEffect } from 'react';
import { ability_desc_parse, ability_icon_parse } from '../../../helper/string-parsing';
import { patch_data_url, assets_url } from '../../../helper/urls';
import { SET_NUMBER, champions_fetch, traits_fetch, champion_patch_combine, trait_patch_combine } from '../../../helper/variables';
import TraitCard from '../../../sub-components/trait-card/trait-card';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import './champions-cheatsheet.component.css';
import '../../base.css';

const ChampionsCheatSheet = (props) => {
  const [champions, setChampions] = useState({});
  const [champion, setChampion] = useState({});
  const [searchName, setSearchName] = useState("");
  const [traits, setTraits] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorSeverity, setErrorSeverity] = useState("error");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true); 

    const fetchData = async () => {
      let champions_arr = champions_fetch();
      let traits_arr = traits_fetch();
  
      try {
        let patchData = await fetch(patch_data_url()).then(res => res.json());
        let thisSet = patchData.setData[SET_NUMBER];
  
        champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
        traits_arr = trait_patch_combine(traits_arr, thisSet.traits);
  
        let champion = {};
        if (props.location.search) {
          let searchString = props.location.search.slice(props.location.search.indexOf('=')+1, props.location.search.length);
          champion = champions_arr[searchString];
        }
        else {
          let keys = Object.keys(champions_arr);
          champion = champions_arr[keys[keys.length * Math.random() << 0]]
        }
        setChampions(champions_arr);
        setChampion(champion);
        setTraits(traits_arr);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(true);
        setErrorSeverity("error");
        setErrorMessage(`Error retrieving patch data: ${err}. Try refreshing the page.`);
      }
    }

    fetchData();
  }, [props]);

  const loadChampionData = (champion_new) => {
    setChampion(champion_new);
  }

  const handleSearch = (event) => {
    setSearchName(event.target.value);
  }

  const championCard = (champion_new) => {
    let abilityVariables = [];
    let championTraitsSmall = [];
    let championTraits = [];

    let parsedAbilityDesc = ability_desc_parse(champion.patch_data.ability);

    for (let variable of Object.values(champion.patch_data.ability.variables)) {
      if (!(variable.value[1] === variable.value[2] && variable.value[1] === variable.value[2])) {
        abilityVariables.push(
          <div key={variable.name}>{variable.name}: {Math.round(variable.value[1]*100)/100}/{Math.round(variable.value[2]*100)/100}/{Math.round(variable.value[3]*100)/100}</div>
        );
      }
    }

    for (let trait of Object.values(champion.traits)) {
      let image = traits[trait].patch_data.icon.substring(0, traits[trait].patch_data.icon.indexOf('dds')).toLowerCase();
      championTraitsSmall.push(
        <div key={trait} className='traits-align'>
          <img src={assets_url(image)} alt={traits[trait].name} className='trait-icon-small' onError={imageError}/>
          {traits[trait].name}
        </div>
      );
      championTraits.push(
        <TraitCard key={trait} champions={champions} trait={traits[trait]} imageError={imageError}/>
      );
    }

    return (
      <div>
        <div className={`champion-body-${champion.cost}`}>
          <div className={`champion-header-${champion.cost}`}>
            <div className="wrapper">
              <div className="portrait">
                <img src={champion.patch_data.icon} alt={champion.name} className={`portrait-border cost${champion.cost}`} onError={imageError}/>
              </div>
              <div className="row1">
                <p>{champion.name}</p>
              </div>
              <div className="row2">
                <p>Cost: {champion.cost}</p>
              </div>
              <div className="champion-traits">
                {championTraitsSmall}
              </div>
            </div>
          </div>
          <div className='stats-grid'>
            <div>Attack Damage: {champion.patch_data.stats.damage}</div>
            <div>Attack Speed: {Math.round(champion.patch_data.stats.attackSpeed*100)/100}</div>
            <div>Attack Range: {champion.patch_data.stats.range}</div>
            <div>Health: {champion.patch_data.stats.hp}</div>
            <div>Armor: {champion.patch_data.stats.armor}</div>
            <div>Magic Resist: {champion.patch_data.stats.magicResist}</div>
          </div>
          <div className="wrapper-ability">
            <div className="portrait">
              <img src={ability_icon_parse(champion.patch_data)} alt={champion.patch_data.ability.name} loading="lazy" className="portrait-border ability" onError={imageError}/>
            </div>
            <div className="row1">
              {champion.patch_data.ability.name}
            </div>
            <div className="row2">
              Mana: {champion.patch_data.stats.initialMana}/{champion.patch_data.stats.mana}
            </div>
          </div>
          <div className="ability-desc">
              {parsedAbilityDesc}
          </div>
          <div className="ability-variables">
            {abilityVariables}
          </div>
        </div>
        <div className='champion-traits-cards'>
          {championTraits}
        </div>
      </div>
    );
  }

  const imageError = () => {
    setError(true);
    setErrorSeverity("warning");
    setErrorMessage("Warning: Some images failed to load. Refreshing the page may solve the problem.")
  }

  const champions_arr = [];

  for (let c of Object.values(champions)) {
    if (c.name.toLowerCase().includes(searchName.toLowerCase())) {
      champions_arr.push(
        <div className='portrait-spacing' key={c.championId} onClick={() => loadChampionData(c)}>
          <img src={c.patch_data.icon} alt={c.name} className={`portrait-border cost${c.cost}`} loading="lazy" onError={imageError}/>
          <p className='champion-name'>{c.name}</p>
          <p className='cost'>${c.cost}</p>
        </div>
      );
    }
  }

  return (
    <div className='page-grid'>
      <div></div>
      <div>
        <h1 className='title'>Champions Cheatsheet</h1>
          {error && <Alert severity={errorSeverity}>{errorMessage}</Alert>}
          {loading && <CircularProgress size={24}/>}
          { !loading &&
          <div className="content-grid-champions">
            <div className="content-margins">
              <TextField id="search" onChange={handleSearch} placeholder="Champion Name" variant="outlined" className="search-field"/>
              <div>{champions_arr}</div>
            </div>
            <div className="content-margins">
              {champion.name === undefined ? <div/> : championCard()}
            </div>
          </div>
          }
        </div>
      <div></div>
    </div>
  );
}

export default ChampionsCheatSheet;
