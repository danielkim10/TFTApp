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

  createTraits = () => {
    let traitsUnsorted = [];
    let traitsSorted = [];

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
        traitsUnsorted.push(this.props.traits[key]);
      }
    })

    //console.log(traitsUnsorted);
    traitsUnsorted.sort(sortTrait);
    for (let i = 0; i < traitsUnsorted.length; i++) {
      let max = 0;

      for (let j = 0; j < traitsUnsorted[i].sets.length; j++) {
        if (traitsUnsorted[i].color === '') {
          max = traitsUnsorted[i].sets[0].min;
          break;
        }
        else if (traitsUnsorted[i].color === 'chromatic') {
          max = traitsUnsorted[i].sets[traitsUnsorted[i].sets.length-1].min;
          break;
        }
        else if (traitsUnsorted[i].color === 'gold') {
          max = traitsUnsorted[i].sets[traitsUnsorted[i].sets.length-1].min;
          break;
        }
        else if (traitsUnsorted[i].color === traitsUnsorted[i].sets[j].style){
          max = traitsUnsorted[i].sets[j+1].min;
          break;
        }
      }

      let image = traitsUnsorted[i].patch_data.icon.substring(0, traitsUnsorted[i].patch_data.icon.indexOf('dds')).toLowerCase();
      let traitBg = '';
      for (let j = traitsUnsorted[i].sets.length-1; j >= 0; j--) {
        if (traitsUnsorted[i].count >= traitsUnsorted[i].sets[j].min) {
          traitBg = traitsUnsorted[i].sets[j].style;
          break;
        }
      }

      traitsSorted.push(
        <Tooltip placement='top' title={<TraitTooltip trait={traitsUnsorted[i]} champions={this.props.champions} key={traitsUnsorted[i].key} advancedTooltip={true}/>} arrow>
          <div key={traitsUnsorted[i].key} id={traitsUnsorted[i].key} className='trait-layering'>
            { traitBg !== '' && <img src={trait_bg_url(traitBg)} alt={traitBg} className='background'/>}
            <img src={assets_url(image)} alt={traitsUnsorted[i].name} className='trait-icon'/><p className='trait-text'>{traitsUnsorted[i].name + ": " + traitsUnsorted[i].count + " / " + max}</p>
          </div>
        </Tooltip>
      );
    }
    return traitsSorted;
  }

  render = () => {
    return(
      this.createTraits()
    );
  }
}

export default TraitsPanel;
