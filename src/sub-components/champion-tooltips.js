import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

class ChampionTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
//
    }
  }

  render = () => {
    let abilityVariables = [];
    let champiopnTraitsSmall = [];
    for (let variable in this.props.champion.patch_data.ability.variables) {

    }

    for (let trait in this.props.champion.traits) {

    }

    return (
       <Tooltip placement="top" isOpen={this.props.isOpen} target={this.props.target} toggle={this.props.toggle}>
         <table>
           <tbody>
             <tr>
               <td><p className='tooltipTitle'>{this.props.champion.name}</p></td>
               <td><p className='tooltipTitle'>{this.props.champion.cost}</p></td>
             </tr>
             <tr>

             </tr>
           </tbody>
         </table>
        
       </Tooltip>
    )
  }
}

export default ChampionTooltip
