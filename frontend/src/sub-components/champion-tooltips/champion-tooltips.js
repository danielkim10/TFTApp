import React, { Component } from 'react';
import { ability_icon_parse, ability_desc_parse } from '../../helper/string-parsing';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { assets_url } from '../../helper/urls';

class ChampionTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render = () => {
    require('./champion-tooltips.css');
    require('../../components/base.css');

    let abilityVariables = [];
    let championTraitsSmall = [];
    for (let variable of Object.values(this.props.champion.patch_data.ability.variables)) {
      if (!(variable.value[1] === variable.value[2] && variable.value[1] === variable.value[2])) {
        abilityVariables.push(
          <div key={variable.name}>{variable.name}: {Math.round(variable.value[1]*100)/100}/{Math.round(variable.value[2]*100)/100}/{Math.round(variable.value[3]*100)/100}</div>
        );
      }
    }

    for (let trait of this.props.traits) {
      let image = trait.patch_data.icon.substring(0, trait.patch_data.icon.indexOf('dds')).toLowerCase();
      championTraitsSmall.push(
        <div key={trait.name} className='traits-align'>
          <img src={assets_url(image)} alt={trait.name} className='trait-image-size'/>{trait.name}
        </div>
      );
    }

    return (
      <div className='font'>
        <div className='tooltip-wrapper'>
          <div className='name-tooltip'>
            {this.props.champion.name}
          </div>
          <div className='cost-tooltip'>
            <div>
              <MonetizationOnIcon className='coin-color'/>{this.props.champion.cost}
            </div>
          </div>
          <div className='champion-traits'>
            {championTraitsSmall}
          </div>
        </div>
        <div className='ability-wrapper'>
          <div className='portrait-tooltip'>
            <img src={ability_icon_parse(this.props.champion.patch_data)} className='ability-image-size' alt={this.props.champion.patch_data.ability.name}/>
          </div>
          <div className='ability-tooltip'>
            {this.props.champion.patch_data.ability.name}
          </div>
          <div className='mana-tooltip'>
            Mana: {this.props.champion.patch_data.stats.initialMana}/{this.props.champion.patch_data.stats.mana}
          </div>
        </div>
        <div className='ability-desc-tooltip'>
          {ability_desc_parse(this.props.champion.patch_data.ability)}
        </div>
        <div className='ability-variables-tooltip'>
          {abilityVariables}
        </div>
      </div>
    );
  }
}

export default ChampionTooltip
