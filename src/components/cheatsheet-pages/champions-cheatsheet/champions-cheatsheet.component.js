import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { ability_desc_parse, ability_icon_parse } from '../../../helper/string-parsing';
import { patch_data_url, assets_url } from '../../../helper/urls';
import { SET_NUMBER, champions, traits, champion_patch_combine, trait_patch_combine } from '../../../helper/variables';
import TraitCard from '../../../sub-components/trait-card/trait-card';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import './champions-cheatsheet.component.css';

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
    for (let variable of Object.values(champion.patch_data.ability.variables)) {
      if (!(variable.value[1] === variable.value[2] && variable.value[1] === variable.value[2])) {
        abilityVariables.push(
          <p key={variable.name} className='white'>{variable.name}: {Math.round(variable.value[1]*100)/100}/{Math.round(variable.value[2]*100)/100}/{Math.round(variable.value[3]*100)/100}</p>
        );
      }
    }

    for (let trait of Object.values(champion.traits)) {
      let image = this.state.traits[trait].patch_data.icon.substring(0, this.state.traits[trait].patch_data.icon.indexOf('dds')).toLowerCase();
      championTraitsSmall.push(
        <tr key={trait}>
          <td className='white'>
            <img src={assets_url(image)} alt={this.state.traits[trait].name} width={20} height={20}/>
            {this.state.traits[trait].name}
          </td>
        </tr>
      );
      championTraits.push(
        <TraitCard key={trait} champions={this.state.champions} trait={this.state.traits[trait]}/>
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
                    <img src={champion.patch_data.icon} alt={champion.name} className={`cost${champion.cost}champion`}/>
                  </div>
                </td>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        <td className='white'><strong>{this.state.champion.name}</strong></td>
                      </tr>
                      <tr>
                        <td className='white'>Cost: {this.state.champion.cost}</td>
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
                        <td className='stat-column white'>Attack Damage: {this.state.champion.patch_data.stats.damage}</td>
                        <td className='stat-column white'>Attack Speed: {Math.round(this.state.champion.patch_data.stats.attackSpeed*100)/100}</td>
                        <td className='stat-column white'>Attack Range: {this.state.champion.patch_data.stats.range}</td>
                      </tr>
                      <tr>
                        <td className='stat-column white'>Health: {this.state.champion.patch_data.stats.hp}</td>
                        <td className='stat-column white'>Armor: {this.state.champion.patch_data.stats.armor}</td>
                        <td className='stat-column white'>Magic Resist: {this.state.champion.patch_data.stats.magicResist}</td>
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
                              <td className='white'><strong>{this.state.champion.patch_data.ability.name}</strong></td>
                            </tr>
                            <tr>
                              <td className='white'>Mana: {this.state.champion.patch_data.stats.initialMana}/{this.state.champion.patch_data.stats.mana}</td>
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

  imageError = () => {
    this.setState({
      error: true, 
      errorSeverity: "warning", 
      errorMessage: "Warning: Some images failed to load. Refreshing the page may solve the problem."
    });
  }

  render = () => {
    const champions = [];

    for (let champion of Object.values(this.state.champions)) {
      if (champion.name.toLowerCase().includes(this.state.searchName.toLowerCase())) {
        champions.push(
          <div className='champion-spacing' key={champion.championId} onClick={() => this.loadChampionData(champion)}>
            <img src={champion.patch_data.icon} alt={champion.name} className={`cost${champion.cost}champion`} onError={this.imageError}/>
            <p className='champion-name'>{champion.name}</p>
            <p className='cost'>${champion.cost}</p>
          </div>
        );
      }
    }

    return (
      <table>
        <tbody>
          <tr>
            <td className='side-margin'></td>
            <td className='main-content'>
              <h1 className='title'>Champions Cheatsheet</h1>
              {this.state.error && <Alert severity={this.state.errorSeverity}>{this.state.errorMessage}</Alert>}
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
                    <td style={{width: '66%', verticalAlign: 'top'}}>
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
