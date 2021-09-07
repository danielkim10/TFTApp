import React, { Component } from 'react';
import { trait_desc_parse, trait_effect_parse } from '../../helper/string-parsing';
import { sortCostAscending } from '../../helper/sorting';

class TraitTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  createSmallTooltip = () => {
    return (
      <div className='tooltipTitle small'>{this.props.count} {this.props.trait.name}</div>
    );
  }

  createAdvancedTooltip = () => {
    let championDesc = [];
    let champions = [];

    for (let champion of Object.values(this.props.champions)) {
      if (champion.traits.includes(this.props.trait.key)) {
        champions.push(champion);
      }
    }

    champions.sort(sortCostAscending);
    for (let champion of Object.values(champions)) {
      let championLocked = '';
      if (this.props.team.findIndex(t => t.champion.championId === champion.championId) === -1) {
        championLocked = 'champion-locked';
      }

      championDesc.push(
        <div className='portrait-spacing' onClick={() => this.championRedirect(champion.championId)} key={champion.championId}>
            <img src={champion.patch_data.icon} alt={champion.name} className={`portrait-border-small cost${champion.cost} ${championLocked}`} onError={this.props.imageError}/>
        </div>);
    }

    let bonuses_hashed = [];
    let stat_string = "";
    let desc_hashed = "";
    if (this.props.trait.patch_data.desc.indexOf('<expandRow>') !== -1) {
        desc_hashed = trait_desc_parse(this.props.trait.patch_data);
        stat_string = this.props.trait.patch_data.desc.substring(this.props.trait.patch_data.desc.indexOf('<expandRow>') + 11, this.props.trait.patch_data.desc.length - 12);
        let effects = trait_effect_parse(stat_string, this.props.trait.patch_data);
        
        for (let effect in effects) {
          let bonusLocked = '';

          if (this.props.trait.sets[effect].min > this.props.trait.count) {
            bonusLocked = 'bonus-locked';
          }

          bonuses_hashed.push(<div key={effect} className={bonusLocked}>{effects[effect]}</div>);
        }
    }

    else {
      if (this.props.trait.name === 'Draconic') {
          let description = this.props.trait.patch_data.desc.replaceAll('<row>', '');
          description = description.replaceAll('</row>', '');
          description = description.replaceAll('<tftitemrules>', '');
          description = description.replaceAll('</tftitemrules>', '');
          
          stat_string = description.substring(0, description.indexOf('<br>'));
          stat_string = stat_string.replace('@MinUnits@', '3');

          let bonusLocked = '';
          if (this.props.trait.sets[0].min > this.props.trait.count) {
            bonusLocked = 'bonus-locked';
          }

          bonuses_hashed.push(<div key={'0'} className={bonusLocked}>{stat_string}</div>);
          
          let stat_string_2 = description.substring(description.indexOf('<br>') + 4, description.indexOf('<br><br>'));
          stat_string_2 = stat_string_2.replace('@MinUnits@', '5');

          bonusLocked = '';
          if (this.props.trait.sets[1].min > this.props.trait.count) {
            bonusLocked = 'bonus-locked';
          }

          bonuses_hashed.push(<div key={'1'} className={bonusLocked}>{stat_string_2}</div>);
          bonuses_hashed.push(<div key={'2'}>{description.substring(description.indexOf('<br><br>')+8)}</div>)
      }
      else {
        let description = this.props.trait.patch_data.desc.replaceAll('<br>', '');
          let effects = trait_effect_parse(description, this.props.trait.patch_data);
          for (let effect in effects) {
              bonuses_hashed.push(<div key={effect}>{effects[effect]}</div>);
          }
      }
  }

    return (
      <div className='trait-wrapper font'>
        <div className='tooltipTitle'>{this.props.trait.name}</div>
        <div className='trait-tooltip-row'>{this.props.trait.innate}</div>
        <div className='trait-tooltip-row'>{desc_hashed}</div>
        <div className='trait-tooltip-row'>{bonuses_hashed}</div>
        <div>{championDesc}</div>
      </div>
    )
  }

  render = () => {
    require('./trait-tooltips.css');
    require('../../components/base.css');
    return (
      <div>
      { this.props.smallTooltip && this.createSmallTooltip() }
      { this.props.advancedTooltip && this.createAdvancedTooltip() }
      </div>
    );
  }
}

export default TraitTooltip
