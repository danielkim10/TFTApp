import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { ability_desc_parse, ability_icon_parse, champion_icon_parse } from '../../../api-helper/string-parsing.js';
import SynergyCard from '../../../sub-components/synergy-card.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../../../css/colors.css'

import './champions-cheatsheet.component.css';

class ChampionsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      champions: {},
      championNumber: 0,
      champion: {},
      championList: [],
      searchName: "",
      traits: {},
      loading: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount = () => {
    this.setState({loading: true});
    if (this.props.location.state) {
      console.log(this.props.location.state.data);
    }
    let champions = require("../../../data/champions.json");
    let traits = require("../../../data/traits.json");
    let champions_arr = {};
    for (let champion in champions) {
      if (champions[champion].championId.startsWith("TFT5_")) {
        champions_arr[champions[champion].championId] = champions[champion];
      }
    }

    let traits_arr = {};
    for (let trait in traits) {
      traits_arr[traits[trait].key] = traits[trait];
    }

    fetch("https://raw.communitydragon.org/latest/cdragon/tft/en_us.json").then(res => res.json()).then(res =>{
      for (let champion in res.setData[5].champions) {
        if (champions_arr[res.setData[5].champions[champion].apiName] !== undefined) {
          champions_arr[res.setData[5].champions[champion].apiName].patch_data = res.setData[5].champions[champion];
          champions_arr[res.setData[5].champions[champion].apiName].patch_data.icon = champion_icon_parse(champions_arr[res.setData[5].champions[champion].apiName].patch_data.icon);
        }
      }

      for (let trait in res.setData[5].traits) {
        if (traits_arr[res.setData[5].traits[trait].apiName] !== undefined) {
          traits_arr[res.setData[5].traits[trait].apiName].patch_data = res.setData[5].traits[trait];
        }
      }
      console.log(champions_arr);

      let champion = {};
      if (this.props.location.search) {
        let searchString = this.props.location.search.slice(this.props.location.search.indexOf('=')+1, this.props.location.search.length);
        console.log(searchString);
        champion = champions_arr[searchString];
      }
      else {
        let keys = Object.keys(champions_arr);
        champion = champions_arr[keys[ keys.length * Math.random() << 0]]
      }
      this.setState({champions: champions_arr, champion: champion, championNumber: champions_arr.length, traits: traits_arr, loading: false});
    }).catch((err) => {
      console.error('Error retrieving patch data: ' + err);
    });
  }

  randomChampion = () => {
    let random = Math.floor(Math.random() * this.state.championNumber);
    console.log(this.state.champions[random]);
    this.setState({champion: this.state.champions[random]});
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
    for (let variable in champion.patch_data.ability.variables) {
      if (!(champion.patch_data.ability.variables[variable].value[1] === champion.patch_data.ability.variables[variable].value[2] && champion.patch_data.ability.variables[variable].value[1] === champion.patch_data.ability.variables[variable].value[2])) {
        abilityVariables.push(
          <p key={variable}>{champion.patch_data.ability.variables[variable].name}: {Math.round(champion.patch_data.ability.variables[variable].value[1]*100)/100}/{Math.round(champion.patch_data.ability.variables[variable].value[2]*100)/100}/{Math.round(champion.patch_data.ability.variables[variable].value[3]*100)/100}</p>
        );
      }
    }

    for (let trait in champion.traits) {
      let image = this.state.traits[champion.traits[trait]].patch_data.icon.substring(0, this.state.traits[champion.traits[trait]].patch_data.icon.indexOf('dds')).toLowerCase();
      championTraitsSmall.push(
        <tr key={trait}>
          <td>
            <img src={`https://raw.communitydragon.org/latest/game/${image}png`} width={20} height={20}/>
            {this.state.traits[champion.traits[trait]].name}
          </td>
        </tr>
      );
      championTraits.push(
        <SynergyCard key={trait} champions={this.state.champions} trait={this.state.traits[champion.traits[trait]]}/>
      );
    }

    return (
      <div>
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <div className="image-cropper">
                    <img src={champion.patch_data.icon} alt={champion.name} className={champion.cost === 1 ? 'cost1champion' : champion.cost === 2 ? 'cost2champion' : champion.cost === 3 ? 'cost3champion' : champion.cost === 4 ? 'cost4champion' : 'cost5champion'}/>
                  </div>
                </td>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        <td><strong>{this.state.champion.name}</strong></td>
                      </tr>
                      <tr>
                        <td>Cost: {this.state.champion.cost}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table>
                    <tbody>
                        {championTraitsSmall}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        <td className='stat-column'>Attack Damage: {this.state.champion.patch_data.stats.damage}</td>
                        <td className='stat-column'>Attack Speed: {Math.round(this.state.champion.patch_data.stats.attackSpeed*100)/100}</td>
                        <td className='stat-column'>Attack Range: {this.state.champion.patch_data.stats.range}</td>
                      </tr>
                      <tr>
                        <td className='stat-column'>Health: {this.state.champion.patch_data.stats.hp}</td>
                        <td className='stat-column'>Armor: {this.state.champion.patch_data.stats.armor}</td>
                        <td className='stat-column'>Magic Resist: {this.state.champion.patch_data.stats.magicResist}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table>
                    <tbody>
                    <tr>
                      <td style={{width: '60px'}}><img src={ability_icon_parse(this.state.champion.patch_data)} alt={this.state.champion.patch_data.ability.name}/></td>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td><strong>{this.state.champion.patch_data.ability.name}</strong></td>
                            </tr>
                            <tr>
                              <td>Mana: {this.state.champion.patch_data.stats.initialMana}/{this.state.champion.patch_data.stats.mana}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <table>
                    <tbody>
                      <tr>
                        <td className='test-whitespace'>{ability_desc_parse(this.state.champion.patch_data.ability)}</td>
                      </tr>
                      <tr>
                        <td>{abilityVariables}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>{championTraits}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render = () => {
    const champions = [];

    Object.keys(this.state.champions).forEach((key, index) => {
      if (this.state.champions[key].name.toLowerCase().includes(this.state.searchName.toLowerCase())) {
        champions.push(
          <div className='champion-spacing' key={key} onClick={() => this.loadChampionData(this.state.champions[key])}>
            <img src={this.state.champions[key].patch_data.icon} alt={this.state.champions[key].name} className={this.state.champions[key].cost === 1 ? 'cost1champion' : this.state.champions[key].cost === 2 ? 'cost2champion' : this.state.champions[key].cost === 3 ? 'cost3champion' : this.state.champions[key].cost === 4 ? 'cost4champion' : 'cost5champion'} />
            <p className='champion-name'>{this.state.champions[key].name}</p>
            <p className='cost'>${this.state.champions[key].cost}</p>
          </div>
        );
      }
    });
    return (
      <table>
        <tbody>
          <tr>
            <td className='side-margin'></td>
            <td className='main-content'>
              {this.state.loading && <CircularProgress size={24}/>}
              { !this.state.loading &&
              <table>
                <tbody>
                  <tr>
                    <td style={{width: '33%'}}>
                      <div>
                          <Input type="text" id="search" name="search" onChange={this.handleSearch} placeholder="Champion Name" />
                          {champions}
                       </div>
                    </td>
                    <td style={{width: '66%'}}>
                      <div>
                          {this.state.champion.name === undefined ? <div/> : this.championCard(this.state.champion)}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              }
            </td>
            <td className='side-margin'></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ChampionsCheatSheet;
