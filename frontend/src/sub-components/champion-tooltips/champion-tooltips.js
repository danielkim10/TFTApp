import React from 'react';
import { ability_icon_parse, ability_desc_parse } from '../../helper/string-parsing';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { assets_url } from '../../helper/urls';

import './champion-tooltips.css';
import '../../components/base.css';

const ChampionTooltip = (props) => {
  let abilityVariables = [];
  let championTraitsSmall = [];
  for (let variable of Object.values(props.champion.patch_data.ability.variables)) {
    if (!(variable.value[1] === variable.value[2] && variable.value[1] === variable.value[2])) {
      abilityVariables.push(
        <div key={variable.name}>{variable.name}: {Math.round(variable.value[1]*100)/100}/{Math.round(variable.value[2]*100)/100}/{Math.round(variable.value[3]*100)/100}</div>
      );
    }
  }

  for (let trait of props.traits) {
    let image = trait.patch_data.icon.substring(0, trait.patch_data.icon.indexOf('dds')).toLowerCase();
    championTraitsSmall.push(
      <div key={trait.name} className='traits-align-tooltip'>
        <img src={assets_url(image)} alt={trait.name} className='trait-image-size' onError={props.imageError}/>{trait.name} 
      </div>
    );
  }

  return (
    <div className='font'>
      <div className='tooltip-wrapper'>
        <div className='name-tooltip'>
          {props.champion.name}
        </div>
        <div className='cost-tooltip'>
          <div>
            <MonetizationOnIcon className='coin-color'/>{props.champion.cost}
          </div>
        </div>
        <div className='champion-traits-tooltip'>
          {championTraitsSmall}
        </div>
      </div>
      <div className='ability-wrapper'>
        <div className='portrait-tooltip'>
          <img src={ability_icon_parse(props.champion.patch_data)} className='ability-image-size' alt={props.champion.patch_data.ability.name} onError={props.imageError}/>
        </div>
        <div className='ability-tooltip'>
          {props.champion.patch_data.ability.name}
        </div>
        <div className='mana-tooltip'>
          Mana: {props.champion.patch_data.stats.initialMana}/{props.champion.patch_data.stats.mana}
        </div>
      </div>
      <div className='ability-desc-tooltip'>
        {ability_desc_parse(props.champion.patch_data.ability)}
      </div>
      <div className='ability-variables-tooltip'>
        {abilityVariables}
      </div>
    </div>
  );
}

export default ChampionTooltip;
