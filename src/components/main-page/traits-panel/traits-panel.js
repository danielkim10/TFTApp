import React, { Component } from 'react';
import TraitTooltip from '../../../sub-components/trait-tooltips/trait-tooltips';
import Tooltip from '@material-ui/core/Tooltip';
import { assets_url, trait_bg_url } from '../../../api-helper/urls';
import { sortTrait } from '../../../api-helper/sorting';

import './traits-panel.css';

class TraitsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  createSynergies = () => {
    let synergiesUnsorted = [];
    let synergiesSorted = [];

    Object.keys(this.props.traits).forEach((key, index) => {
      let sets = this.props.traits[key].sets.length;
      if (this.props.traits[key].count !== 0) {
        for (let j = sets-1; j >= 0; j--) {
          if (this.props.traits[key].count >= this.props.traits[key].sets[j].min) {
            switch(this.props.traits[key].sets[j].style) {
              case 'chromatic':
                this.props.traits[key].tier = 4;
                this.props.traits[key].color = 'chromatic';
                break;
              case 'gold':
                this.props.traits[key].tier = 3;
                this.props.traits[key].color = 'gold';
                break;
              case 'silver':
                this.props.traits[key].tier = 2;
                this.props.traits[key].color = 'silver';
                break;
              default:
                this.props.traits[key].tier = 1;
                this.props.traits[key].color = 'bronze';
                break;
            }
            break;
          }
          else {
            this.props.traits[key].tier = 0;
            this.props.traits[key].color = '';
          }
        }
        synergiesUnsorted.push(this.props.traits[key]);
      }
    })

    console.log(synergiesUnsorted);
    synergiesUnsorted.sort(sortTrait);
    for (let i = 0; i < synergiesUnsorted.length; i++) {
      let max = 0;

      for (let j = 0; j < synergiesUnsorted[i].sets.length; j++) {
        if (synergiesUnsorted[i].color === '') {
          max = synergiesUnsorted[i].sets[0].min;
          break;
        }
        else if (synergiesUnsorted[i].color === 'chromatic') {
          max = synergiesUnsorted[i].sets[synergiesUnsorted[i].sets.length-1].min;
          break;
        }
        else if (synergiesUnsorted[i].color === 'gold') {
          max = synergiesUnsorted[i].sets[synergiesUnsorted[i].sets.length-1].min;
          break;
        }
        else if (synergiesUnsorted[i].color === synergiesUnsorted[i].sets[j].style){
          max = synergiesUnsorted[i].sets[j+1].min;
          break;
        }
      }

      let image = synergiesUnsorted[i].patch_data.icon.substring(0, synergiesUnsorted[i].patch_data.icon.indexOf('dds')).toLowerCase();
      let traitBg = '';
      for (let j = synergiesUnsorted[i].sets.length-1; j >= 0; j--) {
        if (synergiesUnsorted[i].count >= synergiesUnsorted[i].sets[j].min) {
          traitBg = synergiesUnsorted[i].sets[j].style;
          break;
        }
      }

      synergiesSorted.push(
        <Tooltip placement='top' title={<TraitTooltip trait={synergiesUnsorted[i]} champions={this.props.champions} key={synergiesUnsorted[i].key} advancedTooltip={true}/>} arrow>
          <div key={synergiesUnsorted[i].key} id={synergiesUnsorted[i].key} className='trait-layering'>
            { traitBg !== '' && <img src={trait_bg_url(traitBg)} alt={traitBg} className='background'/>}
            <img src={assets_url(image)} alt={synergiesUnsorted[i].name} className='trait-icon'/><p className='trait-text'>{synergiesUnsorted[i].name + ": " + synergiesUnsorted[i].count + " / " + max}</p>
          </div>
        </Tooltip>
      );
    }
    return synergiesSorted;
  }

  render = () => {
    return(
      this.createSynergies()
    );
  }
}

export default TraitsPanel;
