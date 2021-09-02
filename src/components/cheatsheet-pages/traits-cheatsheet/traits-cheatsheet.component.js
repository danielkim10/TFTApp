import React, { Component } from 'react';
import TraitCard from '../../../sub-components/trait-card/trait-card';
import CircularProgress from '@material-ui/core/CircularProgress';
import { patch_data_url } from '../../../helper/urls';
import { SET_NUMBER, champions, traits, champion_patch_combine, trait_patch_combine } from '../../../helper/variables';
import './traits-cheatsheet.component.css';

class TraitsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      traits: {},
      champions: {},
      loading: false,
    };
    this.championRedirect = this.championRedirect.bind(this);
  }

  componentDidMount = async() => {
    this.setState({loading: true});

    let champions_arr = champions();
    let traits_arr = traits();

    try {
      let patchData = await fetch(patch_data_url()).then(res => res.json());
      let thisSet = patchData.setData[SET_NUMBER];

      champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
      traits_arr = trait_patch_combine(traits_arr, thisSet.traits);
      
      this.setState({champions: champions_arr, traits: traits_arr, loading: false});

    } catch (err) {
      console.error(`Error retrieving patch data: ${err}`);
    }
  }

  createTrait = (data) => {
    return <TraitCard champions={this.state.champions} trait={data}/>
  }

  championRedirect = (key) => {
    let path = '/cheatsheet/champions';
    this.props.history.push({pathname: path, data: key});
  }

  render = () => {
    let originCards = [];
    let classCards = [];

    for (let trait of Object.values(this.state.traits)) {
      if (trait.type === 'origin') {
        originCards.push(<tr key={trait.apiName}><td style={{verticalAlign: 'top'}}>{this.createTrait(trait)}</td></tr>);
      }
      else {
        classCards.push(<tr key={trait.apiName}><td style={{verticalAlign: 'top'}}>{this.createTrait(trait)}</td></tr>);
      }
    }

    return (
      <table>
        <tbody>
          <tr>
            <td className='side-margins'></td>
            <td className='main-content float-top'>
              <h1 className='title'>Traits Cheatsheet</h1>
              {this.state.loading && <CircularProgress className='circular-progress'/>}
              { !this.state.loading && 
              <table className="float-top">
                <tbody>
                  {originCards}
                </tbody>
              </table>
              }
            </td>
            <td className='main-content'>
            {this.state.loading && <CircularProgress className='circular-progress'/>}
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

export default TraitsCheatSheet;
