import React from 'react';
import { trait_desc_parse, trait_effect_parse } from '../../helper/string-parsing';
import { sortCostAscending } from '../../helper/sorting';

import './trait-tooltips.css';
import '../../components/base.css';

const TraitTooltip = (props) => {
  const createSmallTooltip = () => {
    return (
      <div className='tooltipTitle small'>{props.count} {props.trait.name}</div>
    );
  }

  const createAdvancedTooltip = () => {
    let championDesc = [];
    let champions = [];

    for (let champion of Object.values(props.champions)) {
      if (champion.traits.includes(props.trait.key)) {
        champions.push(champion);
      }
    }

    champions.sort(sortCostAscending);
    for (let champion of Object.values(champions)) {
      let championLocked = '';
      if (props.team.findIndex(t => t.champion.championId === champion.championId) === -1) {
        championLocked = 'champion-locked';
      }

      championDesc.push(
        <div className='portrait-spacing' key={champion.championId}>
            <img src={champion.patch_data.icon} alt={champion.name} className={`portrait-border-small cost${champion.cost} ${championLocked}`} onError={props.imageError}/>
        </div>);
    }

    let bonuses_hashed = [];
    let stat_string = "";
    let desc_hashed = "";
    if (props.trait.patch_data.desc.indexOf('<expandRow>') !== -1) {
      if (props.trait.name === 'Assassin') {
        desc_hashed = props.trait.patch_data.desc.substring(props.trait.patch_data.desc.indexOf('<br><br>')+8, props.trait.patch_data.desc.indexOf('<br><br>', props.trait.patch_data.desc.indexOf('<br><br>')+9));
      }
      else {
        desc_hashed = trait_desc_parse(props.trait.patch_data);
      }
      
      stat_string = props.trait.patch_data.desc.substring(props.trait.patch_data.desc.indexOf('<expandRow>') + 11, props.trait.patch_data.desc.indexOf('</expandRow>', props.trait.patch_data.desc.indexOf('<expandRow>') + 12));
      let effects = trait_effect_parse(stat_string, props.trait.patch_data);
      
      for (let effect in effects) {
        let bonusLocked = '';

        if (props.trait.sets[effect].min > props.trait.count) {
          bonusLocked = 'bonus-locked';
        }

        bonuses_hashed.push(<div key={effect} className={bonusLocked}>{effects[effect]}</div>);
      }
    }

    else {
      if (props.trait.name === 'Draconic') {
          let description = props.trait.patch_data.desc.replaceAll('<row>', '');
          description = description.replaceAll('</row>', '');
          description = description.replaceAll('<tftitemrules>', '');
          description = description.replaceAll('</tftitemrules>', '');
          
          stat_string = description.substring(0, description.indexOf('<br>'));
          stat_string = stat_string.replace('@MinUnits@', '3');

          let bonusLocked = '';
          if (props.trait.sets[0].min > props.trait.count) {
            bonusLocked = 'bonus-locked';
          }

          bonuses_hashed.push(<div key={'0'} className={bonusLocked}>{stat_string}</div>);
          
          let stat_string_2 = description.substring(description.indexOf('<br>') + 4, description.indexOf('<br><br>'));
          stat_string_2 = stat_string_2.replace('@MinUnits@', '5');

          bonusLocked = '';
          if (props.trait.sets[1].min > props.trait.count) {
            bonusLocked = 'bonus-locked';
          }

          bonuses_hashed.push(<div key={'1'} className={bonusLocked}>{stat_string_2}</div>);
          bonuses_hashed.push(<div key={'2'}>{description.substring(description.indexOf('<br><br>')+8)}</div>)
      }
      else {
        let description = props.trait.patch_data.desc.replaceAll('<br>', '');
          let effects = trait_effect_parse(description, props.trait.patch_data);
          for (let effect in effects) {
              bonuses_hashed.push(<div key={effect}>{effects[effect]}</div>);
          }
      }
  }

    return (
      <div className='trait-wrapper font'>
        <div className='tooltipTitle'>{props.trait.name}</div>
        <div className='trait-tooltip-row'>{props.trait.innate}</div>
        <div className='trait-tooltip-row'>{desc_hashed}</div>
        <div className='trait-tooltip-row'>{bonuses_hashed}</div>
        <div>{championDesc}</div>
      </div>
    )
  }

  return (
    <div>
    { props.smallTooltip && createSmallTooltip() }
    { props.advancedTooltip && createAdvancedTooltip() }
    </div>
  );
}

export default TraitTooltip;
