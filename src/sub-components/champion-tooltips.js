import React, { Component } from 'react';
import { ability_icon_parse, ability_desc_parse } from '../api-helper/string-parsing';
import { Tooltip } from 'reactstrap';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import './champion-tooltips.css';

class ChampionTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
//
    }
  }

  render = () => {
    let abilityVariables = [];
    let championTraitsSmall = [];
    for (let variable in this.props.champion.patch_data.ability.variables) {
      if (!(this.props.champion.patch_data.ability.variables[variable].value[1] === this.props.champion.patch_data.ability.variables[variable].value[2] && this.props.champion.patch_data.ability.variables[variable].value[1] === this.props.champion.patch_data.ability.variables[variable].value[2])) {
        abilityVariables.push(
          <p key={variable}>{this.props.champion.patch_data.ability.variables[variable].name}: {Math.round(this.props.champion.patch_data.ability.variables[variable].value[1]*100)/100}/{Math.round(this.props.champion.patch_data.ability.variables[variable].value[2]*100)/100}/{Math.round(this.props.champion.patch_data.ability.variables[variable].value[3]*100)/100}</p>
        );
      }
    }
    for (let trait in this.props.traits) {
      
      let image = this.props.traits[trait].patch_data.icon.substring(0, this.props.traits[trait].patch_data.icon.indexOf('dds')).toLowerCase();
      championTraitsSmall.push(<tr key={trait}>
        <td>
          <img src={`https://raw.communitydragon.org/latest/game/${image}png`} className='trait-image-size'/>{this.props.traits[trait].name}
        </td>
      </tr>
      );
    }

    return (
       <Tooltip placement="top" style={{minWidth: '500px', alignItems: 'left'}} isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
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
        
       </Tooltip>
    )
  }
}

export default ChampionTooltip
