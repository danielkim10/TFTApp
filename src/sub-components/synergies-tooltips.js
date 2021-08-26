import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { synergy_desc_parse, synergy_effect_parse } from '../api-helper/string-parsing.js';
import { sortCostAscending } from '../api-helper/sorting.js';

class SynergiesTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  createSmallTooltip = () => {
    return (
      <Tooltip placement="top" isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
        <div>
          <p className='tooltipTitle'></p>
        </div>
      </Tooltip>
    );
  }

  createAdvancedTooltip = () => {
    console.log(this.props.synergy);

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
                <img src={champions[champion].patch_data.icon} alt={champions[champion].name} width={20} height={20} className={champions[champion].cost === 1 ? 'cost1champion' : champions[champion].cost === 2 ? 'cost2champion' : champions[champion].cost === 3 ? 'cost3champion' : champions[champion].cost === 4 ? 'cost4champion' : 'cost5champion'}/>
            </div>);
    }

    let bonuses_hashed = [];
    let stat_string = "";
    let desc_hashed = "";
    if (this.props.trait.patch_data.desc.indexOf('<expandRow>') !== -1) {
        desc_hashed = synergy_desc_parse(this.props.trait.patch_data);
        stat_string = this.props.trait.patch_data.desc.substring(this.props.trait.patch_data.desc.indexOf('<expandRow>') + 11, this.props.trait.patch_data.desc.length - 12);
        let effects = synergy_effect_parse(stat_string, this.props.trait.patch_data);
        for (let effect in effects) {
            bonuses_hashed.push(<tr key={effect}><td key={effect} className='white-text'>{effects[effect]}</td></tr>)
        }
    }

    return (
      <Tooltip placement="top" isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
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
            <tr>
              <td>{championDesc}</td>
            </tr>
            {bonuses_hashed}
          </tbody>
        </table>
      </Tooltip>
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

export default SynergiesTooltip
