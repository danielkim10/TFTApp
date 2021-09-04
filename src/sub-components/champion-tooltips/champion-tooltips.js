import React, { Component } from 'react';
import { ability_icon_parse, ability_desc_parse } from '../../helper/string-parsing';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import './champion-tooltips.css';
import { assets_url } from '../../helper/urls';

class ChampionTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render = () => {
    let abilityVariables = [];
    let championTraitsSmall = [];
    for (let variable of Object.values(this.props.champion.patch_data.ability.variables)) {
      if (!(variable.value[1] === variable.value[2] && variable.value[1] === variable.value[2])) {
        abilityVariables.push(
          <p key={variable.name}>{variable.name}: {Math.round(variable.value[1]*100)/100}/{Math.round(variable.value[2]*100)/100}/{Math.round(variable.value[3]*100)/100}</p>
        );
      }
    }
    console.log(this.props.traits);
    for (let trait of this.props.traits) {
      
      let image = trait.patch_data.icon.substring(0, trait.patch_data.icon.indexOf('dds')).toLowerCase();
      championTraitsSmall.push(<tr key={trait.name}>
        <td>
          <img src={assets_url(image)} alt={trait.name} className='trait-image-size'/>{trait.name}
        </td>
      </tr>
      );
    }

    return (
      <table>
        <tbody>
          <tr>
            <td><p className='tooltipTitle'>{this.props.champion.name}</p></td>
            <td><MonetizationOnIcon/></td>
            <td><p className='tooltipTitle'>{this.props.champion.cost}</p></td>
          </tr>
        {championTraitsSmall}
        <tr>
          <td>
            <table>
              <tbody>
                <tr>
                  <td style={{width: '40px'}}>
                    <img src={ability_icon_parse(this.props.champion.patch_data)} className='ability-image-size' alt={this.props.champion.patch_data.ability.name}/>
                  </td>
                  <td>
                    <table>
                      <tbody>
                        <tr>
                          <td>{this.props.champion.patch_data.ability.name}</td>
                        </tr>
                        <tr>
                          <td>Mana: {this.props.champion.patch_data.stats.initialMana}/{this.props.champion.patch_data.stats.mana}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table>
              <tbody>
                <tr>
                  <td className='test-whitespace'>{ability_desc_parse(this.props.champion.patch_data.ability)}</td>
                </tr>
                <tr>
                  <td>{abilityVariables}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default ChampionTooltip
