import React, { Component } from 'react';
import TraitTooltip from '../../../sub-components/trait-tooltips/trait-tooltips';
import Tooltip from '@material-ui/core/Tooltip';
import { assets_url, trait_bg_url } from '../../../helper/urls';
import { sortTrait } from '../../../helper/sorting';

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

    for (let trait of Object.values(this.props.traits)) {
      let sets = trait.sets.length;
      if (trait.count !== 0) {
        for (let j = sets-1; j >= 0; j--) {
          if (trait.count >= trait.sets[j].min) {
            switch(trait.sets[j].style) {
              case 'chromatic':
                trait.tier = 4;
                trait.color = 'chromatic';
                break;
              case 'gold':
                trait.tier = 3;
                trait.color = 'gold';
                break;
              case 'silver':
                trait.tier = 2;
                trait.color = 'silver';
                break;
              default:
                trait.tier = 1;
                trait.color = 'bronze';
                break;
            }
            break;
          }
          else {
            trait.tier = 0;
            trait.color = '';
          }
        }
        traitsUnsorted.push(trait);
      }
    }

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
      let iconClassName = 'trait-icon-white'
      for (let j = traitsUnsorted[i].sets.length-1; j >= 0; j--) {
        if (traitsUnsorted[i].count >= traitsUnsorted[i].sets[j].min) {
          traitBg = traitsUnsorted[i].sets[j].style;
          iconClassName = 'trait-icon';
          break;
        }
      }

      traitsSorted.push(
        <Tooltip placement='top' title={<TraitTooltip trait={traitsUnsorted[i]} champions={this.props.champions} key={traitsUnsorted[i].key} advancedTooltip={true}/>} arrow>
          <div key={traitsUnsorted[i].key} id={traitsUnsorted[i].key} className='trait-layering'>
            { traitBg !== '' && <img src={trait_bg_url(traitBg)} alt={traitBg} className='background' onError={this.props.imageError}/>}
            <img src={assets_url(image)} alt={traitsUnsorted[i].name} className={iconClassName} onError={this.props.imageError}/><p className='trait-text'>{traitsUnsorted[i].name + ": " + traitsUnsorted[i].count + " / " + max}</p>
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
