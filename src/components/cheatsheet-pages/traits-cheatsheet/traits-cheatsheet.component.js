import React, { Component } from 'react';
import TraitCard from '../../../sub-components/trait-card/trait-card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { patch_data_url } from '../../../helper/urls';
import { SET_NUMBER, champions, traits, champion_patch_combine, trait_patch_combine } from '../../../helper/variables';

class TraitsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      traits: {},
      champions: {},
      loading: false,
      error: false,
      errorSeverity: "",
      errorMessage: "",
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
    return <TraitCard champions={this.state.champions} trait={data} imageError={this.imageError}/>
  }

  championRedirect = (key) => {
    let path = '/cheatsheet/champions';
    this.props.history.push({pathname: path, data: key});
  }

  imageError = () => {
    this.setState({
      error: true, 
      errorSeverity: "warning", 
      errorMessage: "Warning: Some images failed to load. Refreshing the page may solve the problem."
    });
  }

  render = () => {
    require('./traits-cheatsheet.component.css');
    require('../../base.css');

    let originCards = [];
    let classCards = [];

    for (let trait of Object.values(this.state.traits)) {
      if (trait.type === 'origin') {
        originCards.push(<div key={trait.key}>{this.createTrait(trait)}</div>);
      }
      else {
        classCards.push(<div key={trait.key}>{this.createTrait(trait)}</div>);
      }
    }

    return (
      <div className='page-grid'>
        <div></div>
        <div>
            <h1 className='title'>Traits Cheatsheet</h1>
            {this.state.error && <Alert severity={this.state.errorSeverity}>{this.state.errorMessage}</Alert>}
            <div className='content-grid'>
              {this.state.loading && <CircularProgress className='circular-progress'/>}
              { !this.state.loading && 
                  <div>{originCards}</div>
              }
              <div></div>
              { !this.state.loading && 
                <div>{classCards}</div>
              }
          </div>
        </div>
        <div></div>
      </div>
    );
  }
}

export default TraitsCheatSheet;
