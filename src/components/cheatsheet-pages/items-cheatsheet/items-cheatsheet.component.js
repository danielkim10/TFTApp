import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { item_desc_parse } from '../../../api-helper/string-parsing';
import { patch_data_url, assets_url } from '../../../api-helper/urls';
import CircularProgress from '@material-ui/core/CircularProgress';

import './items-cheatsheet.component.css'

class ItemsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      selectedItem: {},
      loading: false,
      error: false,
    };
    this.clear = this.clear.bind(this);
  }

  componentDidMount = () => {
    this.setState({loading: true});
    let items = require("../../../data/items.json");
    let items_arr = {};
    for (let item in items) {
      items_arr['i' + items[item].id] = items[item];
    }

    fetch(patch_data_url()).then(res => res.json()).then(res => {
      console.log(res);
      for (let item in res.items) {
        if (items_arr['i' + res.items[item].id] !== undefined) {
          if (items_arr['i' + res.items[item].id].name.replaceAll(' ', '').toLowerCase() === res.items[item].name.replaceAll(' ', '').toLowerCase()) {
            items_arr['i' + res.items[item].id].patch_data = res.items[item];
          }
          else {
            if (items_arr['i' + res.items[item].id].patch_data === undefined) {
              items_arr['i' + res.items[item].id].patch_data = res.items[item];
            }
          }
        }
      }

      let item = {};
      let keys = Object.keys(items_arr);
      item = items_arr[keys[keys.length * Math.random() << 0]];

      this.setState({items: items_arr, selectedItem: item, loading: false});
    }).catch((err) => {
      this.setState({loading: false, error: true});
      console.error('Error retrieving patch data:' + err);
    });
    console.log(items_arr);
  }

  selectItem = (e, item) => {
    e.preventDefault();
    this.setState({selectedItem: item});
  }

  showItemDetail = (item) => {
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

    if (item.isRadiant) {
      let itemStats = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();
      Object.keys(item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={key+item.id}>+{item.patch_data.effects[key]} {basicStats[key]}</p>)
        }
      });

      itemStats.push(<p className='item-desc-text' key='Radiant'>Radiant - Cannot be crafted</p>);
      
      return (
        <div className='item-category-margins'>
          <img src={assets_url(image)} alt={item.name} className='item-dimensions'/>
          <span className='item-desc-text'>{item.name}</span>
          <Button onClick={this.clear} className='item-desc-text'>Clear</Button>
          <p className='item-desc-text'>{item_desc_parse(item)}</p>
          {itemStats}
        </div>
      );
    }
    else if (item.isElusive) {
      let itemStats = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();
      Object.keys(item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={key+item.id}>+{item.patch_data.effects[key]} {basicStats[key]}</p>)
        }
      });

      itemStats.push(<p className='item-desc-text' key='Elusive'>Elusive - Cannot be crafted</p>);

      return (
        <div className='item-category-margins'>
          <img src={assets_url(image)} alt={item.name} className='item-dimensions'/>
          <span className='item-desc-text'>{item.name}</span>
          <Button onClick={this.clear} className='item-desc-text'>Clear</Button>
          <p className='item-desc-text'>{item_desc_parse(item)}</p>
          {itemStats}
          
        </div>
      );
    }

    else if (item.id < 10) {
      let itemRecipesRow = [];
      let itemRecipes = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();
      
      for (let i = 1; i < 10; i++) {
        let secondItem = this.state.items['i'+i];
        let secondItemImage = secondItem.patch_data.icon.substring(0, secondItem.patch_data.icon.indexOf('dds')).toLowerCase();
        let advancedItem = this.state.items['i'+Math.min(item.id*10 + i, i*10 + item.id)];
        let advancedItemImage = advancedItem.patch_data.icon.substring(0, advancedItem.patch_data.icon.indexOf('dds')).toLowerCase();
        itemRecipes.push(
          <td key={i}>
            <table>
              <tbody>
                <tr>
                  <td><img src={assets_url(image)} alt={item.name} className='item-dimensions-small'/></td>
                  <td><p className='recipe-operator-text'>+</p></td>
                  <td><img src={assets_url(secondItemImage)} alt={item.name} className='item-dimensions-small'/></td>
                  <td><p className='recipe-operator-text'>=</p></td>
                  <td><img src={assets_url(advancedItemImage)} alt={item.name} className='item-dimensions-small-right'/></td>
                </tr>
              </tbody>
            </table>
          </td>
        );
        if (i % 3 === 0) {
          itemRecipesRow.push(<tr key={i}>{itemRecipes}</tr>);
          itemRecipes = [];
        }
      }

      return (
        <div className='item-category-margins'>
          <img src={assets_url(image)} alt={item.name} className='item-dimensions'/>
          <p className='item-desc-text'>{item.name}</p>
          <Button onClick={this.clear} className='item-desc-text'>Clear</Button>
          <span className='item-desc-text'>{item_desc_parse(item)}</span>
          <table>
            <tbody>
              <tr className='item-desc-text'><td>Recipes</td></tr>
              {itemRecipesRow}
            </tbody>
          </table>
        </div>
      );
    }
    else if (item.id >= 10) {
      let itemStats = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();
      Object.keys(item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={key+item.id}>+{item.patch_data.effects[key]} {basicStats[key]}</p>)
        }
      });

      let buildsFrom = [];
      for (let id in item.patch_data.from) {
        let image = this.state.items['i'+item.patch_data.from[id]].patch_data.icon.substring(0, this.state.items['i'+item.patch_data.from[id]].patch_data.icon.indexOf('dds')).toLowerCase();
        buildsFrom.push(
          <td key={id}><img src={assets_url(image)} key={id} alt={this.state.items['i'+item.patch_data.from[id]].name} className='item-dimensions-small'/></td>
        )
      }

      return (
        <div className='item-category-margins'>
          <img src={assets_url(image)} alt={item.name} className='item-dimensions'/>
          <span className='item-desc-text'>{item.name}</span>
          <Button onClick={this.clear} className='item-desc-text'>Clear</Button>
          <p className='item-desc-text'>{item_desc_parse(item)}</p>
          {itemStats}
          <p className='item-desc-text'>Builds from</p>
          <table>
            <tbody>
              <tr>
                {buildsFrom}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    

  }

  clear = () => {
    this.setState({ selectedItem: {} });
  }

  render = () => {
    let loading = true;
    const basicItems = [];
    const advancedItems = [];
    const radiantItems = [];
    const otherItems = [];
    Object.keys(this.state.items).forEach((key, index) => {
      let image = this.state.items[key].patch_data.icon.substring(0, this.state.items[key].patch_data.icon.indexOf('dds')).toLowerCase();

      if (this.state.items[key].isRadiant) {
        radiantItems.push(
          <div className='item-spacing' key={key} onClick={(e) => this.selectItem(e, this.state.items[key])}>
            <img src={assets_url(image)} alt={this.state.items[key].name} className='item-dimensions' />
            <p className='item-name'>{this.state.items[key].name}</p>
          </div>
        );
      }

      else if (this.state.items[key].isElusive) {
        otherItems.push(
          <div className='item-spacing' key={key} onClick={(e) => this.selectItem(e, this.state.items[key])}>
            <img src={assets_url(image)} alt={this.state.items[key].name} className='item-dimensions' />
            <p className='item-name'>{this.state.items[key].name}</p>
          </div>
        );
      }

      else if (this.state.items[key].id < 10) {
        basicItems.push(
          <div className='item-spacing' key={key} onClick={(e) => this.selectItem(e, this.state.items[key])}>
            <img src={assets_url(image)} alt={this.state.items[key].name} className='item-dimensions' />
            <p className='item-name'>{this.state.items[key].name}</p>
          </div>
        );
      }
      else if (this.state.items[key].id >= 10) {
        advancedItems.push(
          <div className='item-spacing' key={key} onClick={(e) => this.selectItem(e, this.state.items[key])}>
            <img src={assets_url(image)} alt={this.state.items[key].name} className='item-dimensions' />
            <p className='item-name'>{this.state.items[key].name}</p>
          </div>
        );
      }
    });

    loading = false;

    return (
      <table className='backgrounds'>
        <tbody>
          <tr>
            <td className='side-margins'></td>
            <td className='main-content'>
              <h1 className='title'>Items Cheatsheet</h1>
              {this.state.loading && loading && <CircularProgress size={24}/>}
              { !this.state.loading && !loading && <div>
                {
                  this.state.selectedItem !== undefined ? this.showItemDetail(this.state.selectedItem) : <div/> 
                }
                <div className='item-category-margins'>
                  <div className='item-category-title'>Basic</div>
                  <div>
                    {basicItems}
                  </div>
                </div>
                <div className='item-category-margins'>
                  <div className='item-category-title'>Advanced</div>
                  <div>
                    {advancedItems}
                  </div>
                </div>
                <div className='item-category-margins'>
                  <div className='item-category-title'>Radiant</div>
                  <div>
                    {radiantItems}
                  </div>
                </div>
                <div className='item-category-margins'>
                  <div className='item-category-title'>Elusive</div>
                  <div>
                    {otherItems}
                  </div>
                </div>
              </div>}
            </td>
            <td className='side-margins'></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ItemsCheatSheet;
