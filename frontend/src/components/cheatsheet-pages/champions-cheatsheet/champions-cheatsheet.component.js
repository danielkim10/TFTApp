import React, { Component } from 'react';
import { ability_desc_parse, ability_icon_parse } from '../../../helper/string-parsing';
import { patch_data_url, assets_url } from '../../../helper/urls';
import { SET_NUMBER, champions, traits, champion_patch_combine, trait_patch_combine } from '../../../helper/variables';
import TraitCard from '../../../sub-components/trait-card/trait-card';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

class ChampionsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      champions: {},
      champion: {},
      searchName: "",
      traits: {},
      loading: false,
      error: false,
      errorSeverity: "error",
      errorMessage: "",
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount = async () => {
    this.setState({loading: true});

    let champions_arr = champions();
    let traits_arr = traits();

    try {
      let patchData = await fetch(patch_data_url()).then(res => res.json());
      let thisSet = patchData.setData[SET_NUMBER];

      champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
      traits_arr = trait_patch_combine(traits_arr, thisSet.traits);

      let champion = {};
      if (this.props.location.search) {
        let searchString = this.props.location.search.slice(this.props.location.search.indexOf('=')+1, this.props.location.search.length);
        champion = champions_arr[searchString];
      }
      else {
        let keys = Object.keys(champions_arr);
        champion = champions_arr[keys[keys.length * Math.random() << 0]]
      }
      this.setState({champions: champions_arr, champion: champion, traits: traits_arr, loading: false});
    } catch (err) {
      console.error('Error retrieving patch data: ' + err);
    }
  }

  loadChampionData = (champion) => {
    this.setState({ champion: champion });
  }

  handleSearch = (event) => {
    this.setState({searchName: event.target.value});
  }

  championCard = (champion) => {
    let abilityVariables = [];
    let championTraitsSmall = [];
    let championTraits = [];

    let parsedAbilityDesc = ability_desc_parse(this.state.champion.patch_data.ability);

    for (let variable of Object.values(champion.patch_data.ability.variables)) {
      if (!(variable.value[1] === variable.value[2] && variable.value[1] === variable.value[2])) {
        abilityVariables.push(
          <div key={variable.name}>{variable.name}: {Math.round(variable.value[1]*100)/100}/{Math.round(variable.value[2]*100)/100}/{Math.round(variable.value[3]*100)/100}</div>
        );
      }
    }

    for (let trait of Object.values(champion.traits)) {
      let image = this.state.traits[trait].patch_data.icon.substring(0, this.state.traits[trait].patch_data.icon.indexOf('dds')).toLowerCase();
      championTraitsSmall.push(
        <div key={trait} className='traits-align'>
          <img src={assets_url(image)} alt={this.state.traits[trait].name} className='trait-icon-small' onError={this.imageError}/>
          {this.state.traits[trait].name}
        </div>
      );
      championTraits.push(
        <TraitCard key={trait} champions={this.state.champions} trait={this.state.traits[trait]} imageError={this.imageError}/>
      );
    }

    return (
      <div>
        <div className={`champion-body-${champion.cost}`}>
          <div className={`champion-header-${champion.cost}`}>
            <div className="wrapper">
              <div className="portrait">
                <img src={champion.patch_data.icon} alt={champion.name} className={`portrait-border cost${champion.cost}`} onError={this.imageError}/>
              </div>
              <div className="row1">
                <p>{this.state.champion.name}</p>
              </div>
              <div className="row2">
                <p>Cost: {this.state.champion.cost}</p>
              </div>
              <div className="champion-traits">
                {championTraitsSmall}
              </div>
            </div>
          </div>
          <div className='stats-grid'>
            <div>Attack Damage: {this.state.champion.patch_data.stats.damage}</div>
            <div>Attack Speed: {Math.round(this.state.champion.patch_data.stats.attackSpeed*100)/100}</div>
            <div>Attack Range: {this.state.champion.patch_data.stats.range}</div>
            <div>Health: {this.state.champion.patch_data.stats.hp}</div>
            <div>Armor: {this.state.champion.patch_data.stats.armor}</div>
            <div>Magic Resist: {this.state.champion.patch_data.stats.magicResist}</div>
          </div>
          <div className="wrapper-ability">
            <div className="portrait">
              <img src={ability_icon_parse(this.state.champion.patch_data)} alt={this.state.champion.patch_data.ability.name} loading="lazy" className="portrait-border ability" onError={this.imageError}/>
            </div>
            <div className="row1">
              {this.state.champion.patch_data.ability.name}
            </div>
            <div className="row2">
              Mana: {this.state.champion.patch_data.stats.initialMana}/{this.state.champion.patch_data.stats.mana}
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

  imageError = () => {
    this.setState({
      error: true, 
      errorSeverity: "warning", 
      errorMessage: "Warning: Some images failed to load. Refreshing the page may solve the problem."
    });
  }

  render = () => {
    require('./champions-cheatsheet.component.css');
    require('../../base.css');
    const champions = [];

    for (let champion of Object.values(this.state.champions)) {
      if (champion.name.toLowerCase().includes(this.state.searchName.toLowerCase())) {
        champions.push(
          <div className='portrait-spacing' key={champion.championId} onClick={() => this.loadChampionData(champion)}>
            <img src={champion.patch_data.icon} alt={champion.name} className={`portrait-border cost${champion.cost}`} loading="lazy" onError={this.imageError}/>
            <p className='champion-name'>{champion.name}</p>
            <p className='cost'>${champion.cost}</p>
          </div>
        );
      }
    }

    return (
      <div className='page-grid'>
        <div></div>
        <div>
          <h1 className='title'>Champions Cheatsheet</h1>
            {this.state.error && <Alert severity={this.state.errorSeverity}>{this.state.errorMessage}</Alert>}
            {this.state.loading && <CircularProgress size={24}/>}
            { !this.state.loading &&
            <div className="content-grid-champions">
              <div className="content-margins">
                <TextField id="search" onChange={this.handleSearch} placeholder="Champion Name" variant="outlined" className="search-field"/>
                <div>{champions}</div>
              </div>
              <div className="content-margins">
                {this.state.champion.name === undefined ? <div/> : this.championCard(this.state.champion)}
              </div>
            </div>
            }
          </div>
        <div></div>
      </div>
    );
  }
}

export default ChampionsCheatSheet;
