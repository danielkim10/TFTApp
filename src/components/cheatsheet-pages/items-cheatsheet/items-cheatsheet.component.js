import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { item_desc_parse } from '../../../api-helper/string-parsing.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../../../css/colors.css';

import './items-cheatsheet.component.css'

class ItemsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      selectedItem: {},
      loading: false,
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

    fetch("https://raw.communitydragon.org/latest/cdragon/tft/en_us.json").then(res => res.json()).then(res => {
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

      this.setState({items: items_arr, loading: false});
    });
    console.log(items_arr);
  }

  compare = (a, b) => {
    const idA = a.id;
    const idB = b.id;

    let comparison = 0;
    if (idA > idB) {
      comparison = 1;
    }
    else if (idA < idB) {
      comparison = -1;
    }
    return comparison;
  }

  selectItem = (e, item) => {
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
    if (item === undefined) return <div/>

    if (item.isRadiant) {
      let itemStats = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds'));
      Object.keys(item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p key={key+item.id}>+{item.patch_data.effects[key]} {basicStats[key]}</p>)
        }
      });
      
      return (
        <div>
          <Button onClick={this.clear}>Clear</Button>
          <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={item.name} width={50} height={50}/>
          <p className='test-whitespace'>{item_desc_parse(item)}</p>
          {itemStats}
        </div>
      );
    }
    else if (item.isElusive) {
      let itemStats = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds'));
      Object.keys(item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p key={key+item.id}>+{item.patch_data.effects[key]} {basicStats[key]}</p>)
        }
      });

      return (
        <div>
          <Button onClick={this.clear}>Clear</Button>
          <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={item.name} width={50} height={50}/>
          <p>{item_desc_parse(item)}</p>
          {itemStats}
        </div>
      );
    }

    else if (item.id < 10) {
      let itemRecipes = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds'));
      
      for (let i = 1; i < 10; i++) {
        let secondItem = this.state.items['i'+i];
        let secondItemImage = secondItem.patch_data.icon.substring(0, secondItem.patch_data.icon.indexOf('dds'));
        let advancedItem = this.state.items['i'+Math.min(item.id*10 + i, i*10 + item.id)];
        let advancedItemImage = advancedItem.patch_data.icon.substring(0, advancedItem.patch_data.icon.indexOf('dds'));
        itemRecipes.push(
          <div key={i}>
            <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={item.name} width={30} height={30}/>+
            <img src={"https://raw.communitydragon.org/latest/game/"+secondItemImage.toLowerCase()+'png'} alt={item.name} width={30} height={30}/>=
            <img src={"https://raw.communitydragon.org/latest/game/"+advancedItemImage.toLowerCase()+'png'} alt={item.name} width={30} height={30}/>
          </div>
        )
      }

      return (
        <div>
          <Button onClick={this.clear}>Clear</Button>
          <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={item.name} width={50} height={50}/>
          <p>{item_desc_parse(item)}</p>
          {itemRecipes}
        </div>
      );
    }
    else if (item.id >= 10) {
      let itemStats = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds'));
      Object.keys(item.patch_data.effects).forEach((key, index) => {
        if (basicStats[key] !== undefined) {
          itemStats.push(<p key={key+item.id}>+{item.patch_data.effects[key]} {basicStats[key]}</p>)
        }
      });

      return (
        <div>
          <Button onClick={this.clear}>Clear</Button>
          <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={item.name} width={50} height={50}/>
          <p>{item_desc_parse(item)}</p>
          {itemStats}
        </div>
      );
    }
    

  }

  clear = () => {
    this.setState({ selectedItem: {} });
  }

  toggle = (target) => {
    if (!this.state[target]) {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: !this.state[target].tooltipOpen
        }
      });
    }
  }
  isToolTipOpen = (target) => {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }

  render = () => {
    let loading = true;
    const basicItems = [];
    const advancedItems = [];
    const radiantItems = [];
    const otherItems = [];
    Object.keys(this.state.items).forEach((key, index) => {
      console.log(key);
      console.log(this.state.items[key].patch_data);
      let image = this.state.items[key].patch_data.icon.substring(0, this.state.items[key].patch_data.icon.indexOf('dds'));

      if (this.state.items[key].isRadiant) {
        let str = parseInt((key.substring(1, key.length)));
        radiantItems.push(
          <div className='champion-spacing' key={key} onClick={(e) => this.selectItem(e, this.state.items[key])}>
            <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={this.state.items[key].name} width={50} height={50} />
            <p className='item-name'>{this.state.items[key].name}</p>
          </div>
        );
      }

      else if (this.state.items[key].isElusive) {
        let str = parseInt((key.substring(1, key.length)));
        otherItems.push(
          <div className='champion-spacing' key={key} onClick={(e) => this.selectItem(e, this.state.items[key])}>
            <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={this.state.items[key].name} width={50} height={50} />
            <p className='item-name'>{this.state.items[key].name}</p>
          </div>
        );
      }

      else if (this.state.items[key].id < 10) {
        let str = '0' + key.substring(1, key.length);
        basicItems.push(
          <div className='champion-spacing' key={key} onClick={(e) => this.selectItem(e, this.state.items[key])}>
            <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={this.state.items[key].name} width={50} height={50} />
            <p className='item-name'>{this.state.items[key].name}</p>
          </div>
        );
      }
      else if (this.state.items[key].id >= 10) {
        let str = parseInt((key.substring(1, key.length)));
        advancedItems.push(
          <div className='champion-spacing' key={key} onClick={(e) => this.selectItem(e, this.state.items[key])}>
            <img src={"https://raw.communitydragon.org/latest/game/"+image.toLowerCase()+'png'} alt={this.state.items[key].name} width={50} height={50} />
            <p className='item-name'>{this.state.items[key].name}</p>
          </div>
          
        );
      }
    });

    loading = false;

    return (
      <table>
        <tbody>
          <tr>
            <td style={{width: '16%'}}></td>
            <td style={{width: '66%'}}>
              {this.state.loading && loading && <CircularProgress size={24}/>}
              { !this.state.loading && !loading && <div>
                {
                  this.state.selectedItem !== undefined ? this.showItemDetail(this.state.selectedItem) : <div/> 
                }
                <div>
                  <div style={{backgroundColor: '#ffffff'}}><strong>Basic</strong></div>
                  <div>
                    {basicItems}
                  </div>
                </div>
                <div>
                  <div style={{backgroundColor: '#ffffff'}}><strong>Advanced</strong></div>
                  <div>
                    {advancedItems}
                  </div>
                </div>
                <div>
                  <div style={{backgroundColor: '#ffffff'}}><strong>Radiant</strong></div>
                  <div>
                    {radiantItems}
                  </div>
                </div>
                <div>
                  <div style={{backgroundColor: '#ffffff'}}><strong>Elusive</strong></div>
                  <div>
                    {otherItems}
                  </div>
                </div>
              </div>}
            </td>
            <td style={{width: '16%'}}></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ItemsCheatSheet;
