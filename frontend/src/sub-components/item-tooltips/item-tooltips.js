import React from 'react';
import { item_desc_parse } from '../../helper/string-parsing';

import './item-tooltips.css';
import '../../components/base.css';

const ItemTooltip = (props) => {
  const renderTooltipContent = () => {
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

    if (props.item.isRadiant) {
      for (let effect of Object.values(props.item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<div className='tooltip-row' key={effect+props.item.id}>+{props.item.patch_data.effects[effect]} {basicStats[effect]}</div>);
        }
      }

      itemStats.push(<div key='Radiant'>Radiant - Cannot be crafted</div>);

      return (
        <div className='tooltip-wrapper-item font'>
          <div className='tooltip-title tooltip-row'>{props.item.name}</div>
          <div className='tooltip-row'>{item_desc_parse(props.item)}</div>
          {itemStats}
        </div>
      );
    }

    else if (props.item.isElusive) {
      for (let effect of Object.values(props.item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<div className='tooltip-row' key={effect+props.item.id}>+{props.item.patch_data.effects[effect]} {basicStats[effect]}</div>)
        }
      }

      itemStats.push(<div key='Elusive'>Elusive - Cannot be crafted</div>);
    
      return (
        <div className='tooltip-wrapper-item font'>
          <div className='tooltip-title tooltip-row'>{props.item.name}</div>
          <div className='tooltip-row'>{item_desc_parse(props.item)}</div>
          {itemStats}
        </div>
      );
    }

    else if (props.item.id < 10) {
      return (
        <div className='tooltip-wrapper-item font'>
          <div className='tooltip-title tooltip-row'>{props.item.name}</div>
          <div className='tooltip-row'>{item_desc_parse(props.item)}</div>
        </div>
      );
    }

    else if (props.item.id >= 10) {
      for (let effect of Object.values(props.item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<div className='tootip-row' key={effect+props.item.id}>+{props.item.patch_data.effects[effect]} {basicStats[effect]}</div>);
        }
      }

      return (
        <div className='tooltip-wrapper-item font'>
          <div className='tooltip-title tooltip-row'>{props.item.name}</div>
          <div className='tooltip-row'>{item_desc_parse(props.item)}</div>
          {itemStats}
          <div></div>
        </div>
      );
    }
  }

  return (
    renderTooltipContent()
  );
}

export default ItemTooltip;
