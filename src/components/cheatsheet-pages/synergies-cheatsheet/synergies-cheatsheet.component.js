import React, { Component } from 'react';
import SynergyCard from '../../../sub-components/synergy-card.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { champion_icon_parse } from '../../../api-helper/string-parsing.js';
import '../../../css/colors.css';
import './synergies-cheatsheet.component.css';

class SynergiesCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      traits: {},
      champions: {},
      loading: false,
    };
    this.championRedirect = this.championRedirect.bind(this);
  }

  componentDidMount = () => {
    this.setState({loading: true});
    
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

    fetch("https://raw.communitydragon.org/latest/cdragon/tft/en_us.json").then(res => res.json()).then(res => {
      console.log(res);
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
      this.setState({champions: champions_arr, traits: traits_arr, loading: false});
    });
  }

  createSynergy = (data) => {
    return <SynergyCard champions={this.state.champions} trait={data}/>
  }

  championRedirect = (key) => {
    let path = '/cheatsheet/champions';
    this.props.history.push({pathname: path, data: key});
  }

  toggle = (target) => {
    if (!this.state[target]) {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: !this.state[target].tooltipOpen
        }
      });
    }
  }
  isToolTipOpen = (target) => {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }

  render = () => {
    console.log(this.props.location.state);
    let originCards = [];
    let classCards = [];

    console.log(this.state.traits);
    console.log(this.state.champions);
    Object.keys(this.state.traits).forEach((key, index) => {
      if (this.state.traits[key].type === 'origin') {
        originCards.push(<tr key={key}><td>{this.createSynergy(this.state.traits[key])}</td></tr>);
      }
      else {
        classCards.push(<tr key={key}><td>{this.createSynergy(this.state.traits[key])}</td></tr>);
      }
    });

    return (
      <table>
        <tbody>
          <tr>
            <td className='side-margins'></td>
            <td className='main-content'>
              {this.state.loading && <CircularProgress size={24}/>}
              { !this.state.loading && 
              <table className="float-top">
                <tbody>
                  {originCards}
                </tbody>
              </table>
              }
            </td>
            <td className='main-content'>
            {this.state.loading && <CircularProgress size={24}/>}
            { !this.state.loading && 
              <table className="float-top">
                <tbody>
                  {classCards}
                </tbody>
              </table>
            }
            </td>
            <td className='side-margins'></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default SynergiesCheatSheet;
