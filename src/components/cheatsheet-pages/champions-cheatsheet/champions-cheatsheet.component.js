import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { ability_desc_parse } from '../../../api-helper/string-parsing.js';
import SynergyCard from '../../../sub-components/synergy-card.js';
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
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount = () => {
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
        }
      }

      for (let trait in res.setData[5].traits) {
        if (traits_arr[res.setData[5].traits[trait].apiName] !== undefined) {
          traits_arr[res.setData[5].traits[trait].apiName].patch_data = res.setData[5].traits[trait];
        }
      }
      this.setState({champions: champions_arr, championNumber: champions_arr.length, traits: traits_arr});
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
    console.log(champion);

    let abilityVariables = [];
    let championTraits = [];
    for (let variable in champion.patch_data.ability.variables) {
      if (!(champion.patch_data.ability.variables[variable].value[1] === champion.patch_data.ability.variables[variable].value[2] && champion.patch_data.ability.variables[variable].value[1] === champion.patch_data.ability.variables[variable].value[2])) {
        abilityVariables.push(
          <p key={variable}>{champion.patch_data.ability.variables[variable].name}: {Math.round(champion.patch_data.ability.variables[variable].value[1]*100)/100}/{Math.round(champion.patch_data.ability.variables[variable].value[2]*100)/100}/{Math.round(champion.patch_data.ability.variables[variable].value[3]*100)/100}</p>
        );
      }
    }

    for (let trait in champion.traits) {
      championTraits.push(
        <SynergyCard key={trait} champions={this.state.champions} trait={this.state.traits[champion.traits[trait]]}/>
      );
    }
    
    console.log(champion.patch_data.ability.icon.indexOf('Icons2D'));
    console.log(champion.patch_data.ability.icon.indexOf('.dds'));
    let icon = champion.patch_data.ability.icon.substring(champion.patch_data.ability.icon.indexOf('Icons2D/')+8, champion.patch_data.ability.icon.indexOf('.dds')).toLowerCase();
    console.log(icon);
    icon = icon.replace('tft5_', '');
    icon = icon.replace('.tft_set5', '');
    console.log("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/" + this.state.champion.name.replace(' ', '').replace('\'', '').toLowerCase() + "/hud/icons2d/" + icon + ".png");

    // to fix manually: akshan, garen, karma, khazix, lee, mf, nid, rakan, rell, syndra, teemo, vel

    return (
      <div>
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={require(`../../../data/champions/` + champion.championId + `.png`)} alt={champion.name} className={champion.cost === 1 ? 'cost1champion' : champion.cost === 2 ? 'cost2champion' : champion.cost === 3 ? 'cost3champion' : champion.cost === 4 ? 'cost4champion' : 'cost5champion'}/>
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
                        <td>Attack Damage: {this.state.champion.patch_data.stats.damage}</td>
                        <td>Attack Speed: {Math.round(this.state.champion.patch_data.stats.attackSpeed*100)/100}</td>
                        <td>Attack Range: {this.state.champion.patch_data.stats.range}</td>
                      </tr>
                      <tr>
                        <td>Health: {this.state.champion.patch_data.stats.hp}</td>
                        <td>Armor: {this.state.champion.patch_data.stats.armor}</td>
                        <td>Magic Resist: {this.state.champion.patch_data.stats.magicResist}</td>
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
                      <td style={{width: '60px'}}><img src={"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/" + this.state.champion.name.replace(' ', '').replace('\'', '').toLowerCase() + "/hud/icons2d/" + icon + ".png"} alt={this.state.champion.patch_data.ability.name}/></td>
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
          <div className='champion-spacing' key={key}>
            <img src={require(`../../../data/champions/` + key + `.png`)} alt={this.state.champions[key].name} className={this.state.champions[key].cost === 1 ? 'cost1champion' : this.state.champions[key].cost === 2 ? 'cost2champion' : this.state.champions[key].cost === 3 ? 'cost3champion' : this.state.champions[key].cost === 4 ? 'cost4champion' : 'cost5champion'} onClick={() => this.loadChampionData(this.state.champions[key])}/>
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
            <td style={{width: '16%'}}></td>
            <td style={{width: '66%'}}>
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
            </td>
            <td style={{width: '16%'}}></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ChampionsCheatSheet;
