import React, { Component } from 'react';
import TraitTooltip from '../../../sub-components/trait-tooltips/trait-tooltips';
import Tooltip from '@material-ui/core/Tooltip';
import { assets_url } from '../../../api-helper/urls';

class SynergiesPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  compareSynergy = (a, b) => {
    const idA = a.synergy1.tier;
    const idB = b.synergy1.tier;

    let comparison = 0;
    if (idA < idB) {
      comparison = 1;
    }
    else if (idA > idB) {
      comparison = -1;
    }
    return comparison;
  }

  createSynergies = () => {
    const colors = {
      'BLACK_COLOR': '#404040', 
      'gold': '#ffd700', 
      'silver': '#acacac',
      'bronze': '#cd7f32',
      'chromatic': '#425af5'
    };
    let color = colors['BLACK_COLOR'];
    let iconColor = '';
    let synergiesUnsorted = [];
    let synergiesSorted = [];

    Object.keys(this.props.traits).forEach((key, index) => {
      color = colors['BLACK_COLOR'];
      let sets = this.props.traits[key].sets.length;

      if (this.props.traits[key].count !== 0) {
        for (let j = sets-1; j >= 0; j--) {
          if (this.props.traits[key].count >= this.props.traits[key].sets[j].min) {
            color = colors[this.props.traits[key].sets[j].style];
            iconColor = 'black-icon';
            this.props.traits[key].tier = j+1;
            break;
          }
          else {
            color = colors['BLACK_COLOR'];
            iconColor = '';
            this.props.traits[key].tier = 0;
          }
        }
        synergiesUnsorted.push({synergy: this.props.traits[key], color: color, iconcolor: iconColor});
      }
    })

    // synergiesUnsorted.sort(this.compareSynergy);
    for (let i = 0; i < synergiesUnsorted.length; i++) {
      let max = 0;
      if (synergiesUnsorted[i].synergy.tier === synergiesUnsorted[i].synergy.sets.length) {
        max = synergiesUnsorted[i].synergy.sets[synergiesUnsorted[i].synergy.tier-1].min;
      }
      else {
        max = synergiesUnsorted[i].synergy.sets[synergiesUnsorted[i].synergy.tier].min;
      }

      let image = synergiesUnsorted[i].synergy.patch_data.icon.substring(0, synergiesUnsorted[i].synergy.patch_data.icon.indexOf('dds')).toLowerCase();

      synergiesSorted.push(
        <Tooltip placement='top' title={<TraitTooltip trait={synergiesUnsorted[i].synergy} champions={this.props.champions} advancedTooltip={true}/>} arrow>
        <div key={synergiesUnsorted[i].synergy.key}
           id={synergiesUnsorted[i].synergy.key}
          inverse={synergiesUnsorted[i].color === colors['BLACK_COLOR']}
          style={{ backgroundColor: synergiesUnsorted[i].color, borderColor: synergiesUnsorted[i].color }}>
          <img src={assets_url(image)} alt={synergiesUnsorted[i].synergy.name} width='24px' height='24px' className={synergiesUnsorted[i].iconcolor}/>{synergiesUnsorted[i].synergy.name + ": " + synergiesUnsorted[i].synergy.count + " / " + max}
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

export default SynergiesPanel;
