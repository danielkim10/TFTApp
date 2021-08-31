import React, { Component } from 'react';
import { item_desc_parse } from '../../helper/string-parsing';

import './item-tooltips.css';

class ItemTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  renderTooltipContent = () => {
    let basicStats = {
      'AD': 'Attack Damage', 
      'AS': '% Attack Speed', 
      'AP': 'Ability Power', 
      'Mana': 'Mana', 
      'Armor': 'Armor', 
      'MagicResist': 'Magic Resist', 
      'Health': 'Health', 
      'CritChance': '% Critical Strike Chance', 
      '{c4b5579c}': '% Dodge Chance'
    };

    let itemStats = [];

    if (this.props.item.isRadiant) {
      Object.keys(this.props.item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={key+this.props.item.id}>+{this.props.item.patch_data.effects[key]} {basicStats[key]}</p>);
        }
      });
      itemStats.push(<p className='item-desc-text' key='Radiant'>Radiant - Cannot be crafted</p>);

      return (
        <div className='item-category-margins'>
          <span className='item-desc-text'>{this.props.item.name}</span>
          <p className='item-desc-text'>{item_desc_parse(this.props.item)}</p>
          {itemStats}
        </div>
      );
    }

    else if (this.props.item.isElusive) {
      Object.keys(this.props.item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={key+this.props.item.id}>+{this.props.item.patch_data.effects[key]} {basicStats[key]}</p>)
        }
      });

      itemStats.push(<p className='item-desc-text' key='Elusive'>Elusive - Cannot be crafted</p>);
    
      return (
        <div className='item-category-margins'>
          <span className='item-desc-text'>{this.props.item.name}</span>
          <p className='item-desc-text'>{item_desc_parse(this.props.item)}</p>
          {itemStats}
        </div>
      );
    }

    else if (this.props.item.id < 10) {
      return (
        <div className='item-category-margins'>
          <p className='item-desc-text'>{this.props.item.name}</p>
          <span className='item-desc-text'>{item_desc_parse(this.props.item)}</span>
        </div>
      );
    }

    else if (this.props.item.id >= 10) {
      Object.keys(this.props.item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={key+this.props.item.id}>+{this.props.item.patch_data.effects[key]} {basicStats[key]}</p>)
        }
      });

      // let buildsFrom = [];
      // for (let id in this.props.item.patch_data.from) {
      //   let image = this.props.items['i'+this.props.item.patch_data.from[id]].patch_data.icon.substring(0, this.state.items['i'+item.patch_data.from[id]].patch_data.icon.indexOf('dds'));
      //   buildsFrom.push(
      //     <td><img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} key={id} alt={this.state.items['i'+item.patch_data.from[id]].name} className='item-dimensions-small'/></td>
      //   )
      // }

      return (
        <div className='item-category-margins'>
          <span className='item-desc-text'>{this.props.item.name}</span>
          <p className='item-desc-text'>{item_desc_parse(this.props.item)}</p>
          {itemStats}
          <p className='item-desc-text'>Builds from</p>
          <table>
            <tbody>
              <tr>
                {/* {buildsFrom} */}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  render = () => {
    return (
      this.renderTooltipContent()
    );
  }
}

export default ItemTooltip
