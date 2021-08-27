import React, { Component } from 'react';
import { trait_desc_parse, trait_effect_parse } from '../../api-helper/string-parsing';
import { sortCostAscending } from '../../api-helper/sorting';

import './trait-tooltips.css';

class TraitTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  createSmallTooltip = () => {
    return (
      <table>
        <tbody>
          <tr>
            <td><p className='tooltipTitle'>{this.props.count} {this.props.trait.name}</p></td>
          </tr>
        </tbody>
      </table>
    );
  }

  createAdvancedTooltip = () => {
    let championDesc = [];
    let champions = [];
    Object.keys(this.props.champions).forEach((key, index) => {
        if (this.props.champions[key].traits.includes(this.props.trait.key)) {
            champions.push(this.props.champions[key]);
        }
    });

    champions.sort(sortCostAscending);
    for (let champion in champions) {
        championDesc.push(
            <div className='champion-spacing' onClick={() => this.championRedirect(champions[champion].championId)} key={champions[champion].championId}>
                <img src={champions[champion].patch_data.icon} alt={champions[champion].name} className={champions[champion].cost === 1 ? 'cost1champion-tooltip' : champions[champion].cost === 2 ? 'cost2champion-tooltip' : champions[champion].cost === 3 ? 'cost3champion-tooltip' : champions[champion].cost === 4 ? 'cost4champion-tooltip' : 'cost5champion-tooltip'}/>
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
            bonuses_hashed.push(<tr key={effect}><td key={effect} className='white-text'>{effects[effect]}</td></tr>)
        }
    }

    return (
      <table>
        <tbody>
          <tr>
            <td><p className='tooltipTitle'>{this.props.trait.name}</p></td>
          </tr>
          <tr>
            <td><p>{this.props.trait.innate}</p></td>
          </tr>
          <tr>
            <td>{desc_hashed}</td>
          </tr>
          {bonuses_hashed}
          <tr>
            <td>{championDesc}</td>
          </tr>
          
        </tbody>
      </table>
    )
  }

  render = () => {
    return (
      <div>
      { this.props.smallTooltip && this.createSmallTooltip() }
      { this.props.advancedTooltip && this.createAdvancedTooltip() }
      </div>
    );
  }
}

export default TraitTooltip
