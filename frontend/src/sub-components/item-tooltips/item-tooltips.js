import React, { Component } from 'react';
import { item_desc_parse } from '../../helper/string-parsing';

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
      for (let effect of Object.values(this.props.item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<div className='tooltip-row' key={effect+this.props.item.id}>+{this.props.item.patch_data.effects[effect]} {basicStats[effect]}</div>);
        }
      }

      itemStats.push(<div key='Radiant'>Radiant - Cannot be crafted</div>);

      return (
        <div className='tooltip-wrapper-item font'>
          <div className='tooltip-title tooltip-row'>{this.props.item.name}</div>
          <div className='tooltip-row'>{item_desc_parse(this.props.item)}</div>
          {itemStats}
        </div>
      );
    }

    else if (this.props.item.isElusive) {
      for (let effect of Object.values(this.props.item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<div className='tooltip-row' key={effect+this.props.item.id}>+{this.props.item.patch_data.effects[effect]} {basicStats[effect]}</div>)
        }
      }

      itemStats.push(<div key='Elusive'>Elusive - Cannot be crafted</div>);
    
      return (
        <div className='tooltip-wrapper-item font'>
          <div className='tooltip-title tooltip-row'>{this.props.item.name}</div>
          <div className='tooltip-row'>{item_desc_parse(this.props.item)}</div>
          {itemStats}
        </div>
      );
    }

    else if (this.props.item.id < 10) {
      return (
        <div className='tooltip-wrapper-item font'>
          <div className='tooltip-title tooltip-row'>{this.props.item.name}</div>
          <div className='tooltip-row'>{item_desc_parse(this.props.item)}</div>
        </div>
      );
    }

    else if (this.props.item.id >= 10) {
      for (let effect of Object.values(this.props.item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<div className='tootip-row' key={effect+this.props.item.id}>+{this.props.item.patch_data.effects[effect]} {basicStats[effect]}</div>);
        }
      }

      return (
        <div className='tooltip-wrapper-item font'>
          <div className='tooltip-title tooltip-row'>{this.props.item.name}</div>
          <div className='tooltip-row'>{item_desc_parse(this.props.item)}</div>
          {itemStats}
          <div></div>
        </div>
      );
    }
  }

  render = () => {
    require('./item-tooltips.css');
    require('../../components/base.css');
    return (
      this.renderTooltipContent()
    );
  }
}

export default ItemTooltip
