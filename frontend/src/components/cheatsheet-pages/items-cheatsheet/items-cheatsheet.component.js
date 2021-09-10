import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { item_desc_parse } from '../../../helper/string-parsing';
import { patch_data_url, assets_url } from '../../../helper/urls';
import { items_fetch, item_patch_combine } from '../../../helper/variables';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

import './items-cheatsheet.component.css';
import '../../base.css';

const ItemsCheatSheet = (props) => {
  const [items, setItems] = useState({});
  const [selectedItem, setSelectedItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorSeverity, setErrorSeverity] = useState("error");
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      let items_arr = items_fetch();
      try {
        let patchData = await fetch(patch_data_url()).then(res => res.json());
  
        items_arr = item_patch_combine(items_arr, patchData.items);
        let item = {};
        let keys = Object.keys(items_arr);
        item = items_arr[keys[keys.length * Math.random() << 0]];
        setItems(items_arr);
        setSelectedItem(item);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(true);
        setErrorSeverity("error");
        setErrorMessage(`Error retrieving patch data: ${err}. Try refreshing the page.`);
      }
    }

    fetchData();
  }, []);

  const selectItem = (e, item) => {
    e.preventDefault();
    setSelectedItem(item);
  }

  const clear = () => {
    setSelectedItem({});
  }

  const imageError = () => {
    setError(true);
    setErrorSeverity("warning");
    setErrorMessage("Warning: Some images failed to load. Refreshing the page may solve the problem.");
  }

  const showItemDetail = (item) => {
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
      
      for (let effect of Object.keys(item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={effect+item.id}>+{item.patch_data.effects[effect]} {basicStats[effect]}</p>);
        }
      }

      itemStats.push(<p className='item-desc-text' key='Radiant'>Radiant - Cannot be crafted</p>);

      return (
        <div className='item-category-margins'>
          <div className='grid-desc'>
            <div className='portrait'>
              <img src={assets_url(image)} alt={item.name} className='portrait-border item' onError={imageError}/>
            </div>
            <div className='item-title'>
              {item.name}
            </div>
            <div className='button'>
              <Button onClick={clear}><span className='button-text'>Clear</span></Button>
            </div>
          </div>
          <div className='item-category-content'>
            <p className='item-desc-text'>{item_desc_parse(item)}</p>
            {itemStats}
          </div>
        </div>
      );
    }
    else if (item.isElusive) {
      let itemStats = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();

      for (let effect of Object.keys(item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={effect+item.id}>+{item.patch_data.effects[effect]} {basicStats[effect]}</p>);
        }
      }

      itemStats.push(<p className='item-desc-text' key='Elusive'>Elusive - Cannot be crafted</p>);

      return (
        <div className='item-category-margins'>
          <div className='grid-desc'>
            <div className='portrait'>
              <img src={assets_url(image)} alt={item.name} className='portrait-border item' onError={imageError}/>
            </div>
            <div className='item-title'>
              {item.name}
            </div>
            <div className='button'>
              <Button onClick={clear}><span className='button-text'>Clear</span></Button>
            </div>
          </div>
          <div className='item-category-content'>
            <p className='item-desc-text'>{item_desc_parse(item)}</p>
            {itemStats}
          </div>
        </div>
      );
    }

    else if (item.id < 10) {
      let itemRecipes = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();
      
      for (let i = 1; i < 10; i++) {
        let secondItem = items[i];
        let secondItemImage = secondItem.patch_data.icon.substring(0, secondItem.patch_data.icon.indexOf('dds')).toLowerCase();
        let advancedItem = items[Math.min(item.id*10 + i, i*10 + item.id)];
        let advancedItemImage = advancedItem.patch_data.icon.substring(0, advancedItem.patch_data.icon.indexOf('dds')).toLowerCase();
        itemRecipes.push(
          <div key={i} className='grid-recipe'>
            <img src={assets_url(image)} alt={item.name} className='item-dimensions-small' onError={imageError}/>
            <p className='recipe-operator-text'>+</p>
            <img src={assets_url(secondItemImage)} alt={item.name} className='item-dimensions-small' onError={imageError}/>
            <p className='recipe-operator-text'>=</p>
            <img src={assets_url(advancedItemImage)} alt={item.name} className='item-dimensions-small' onError={imageError}/>
          </div>
        );
      }

      return (
        <div className='item-category-margins'>
          <div className='grid-desc'>
            <div className='portrait'>
              <img src={assets_url(image)} alt={item.name} className='portrait-border item' onError={imageError}/>
            </div>
            <div className='item-title'>
              {item.name}
            </div>
            <div className='button'>
              <Button onClick={clear}><span className='button-text'>Clear</span></Button>
            </div>
          </div>
          <div className='item-category-content'>
            <p className='item-desc-text'>{item_desc_parse(item)}</p>
            <div className="grid-basic">
              {itemRecipes}
            </div>
          </div>
        </div>
      );
    }
    else if (item.id >= 10) {
      let itemStats = [];
      let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();

      for (let effect of Object.keys(item.patch_data.effects)) {
        if (basicStats[effect] !== undefined) {
          itemStats.push(<p className='item-desc-text' key={effect+item.id}>+{item.patch_data.effects[effect]} {basicStats[effect]}</p>);
        }
      }

      let buildsFrom = [];
      for (let id in item.patch_data.from) {
        let image = items[item.patch_data.from[id]].patch_data.icon.substring(0, items[item.patch_data.from[id]].patch_data.icon.indexOf('dds')).toLowerCase();
        buildsFrom.push(
          <img src={assets_url(image)} key={id} alt={items[item.patch_data.from[id]].name} className='item-dimensions-small' onError={imageError}/>
        )
      }

      return (
        <div className='item-category-margins'>
          <div className='grid-desc'>
            <div className='portrait'>
              <img src={assets_url(image)} alt={item.name} className='portrait-border item' onError={imageError}/>
            </div>
            <div className='item-title'>
              {item.name}
            </div>
            <div className='button'>
              <Button onClick={clear}><span className='button-text'>Clear</span></Button>
            </div>
          </div>
          <div className='item-category-content'>
            <p className='item-desc-text'>{item_desc_parse(item)}</p>
            {itemStats}
            <p className='item-desc-text'>Builds from</p>
            <div className='builds-from-items'>
              {buildsFrom}
            </div>
          </div>
        </div>
      );
    }
  }

  const basicItems = [];
  const advancedItems = [];
  const radiantItems = [];
  const otherItems = [];
  for (let item of Object.values(items)) {
    let image = item.patch_data.icon.substring(0, item.patch_data.icon.indexOf('dds')).toLowerCase();

    if (item.isRadiant) {
      radiantItems.push(
        <div className='portrait-spacing item' key={item.id.toString()} onClick={(e) => selectItem(e, item)}>
          <img src={assets_url(image)} alt={item.name} className={`portrait-border item`} onError={imageError}/>
          <p className='item-name'>{item.name}</p>
        </div>
      );
    }

    else if (item.isElusive) {
      otherItems.push(
        <div className='portrait-spacing item' key={item.id.toString()} onClick={(e) => selectItem(e, item)}>
          <img src={assets_url(image)} alt={item.name} className={`portrait-border item`} onError={imageError}/>
          <p className='item-name'>{item.name}</p>
        </div>
      );
    }

    else if (item.id < 10) {
      basicItems.push(
        <div className='portrait-spacing item' key={item.id.toString()} onClick={(e) => selectItem(e, item)}>
          <img src={assets_url(image)} alt={item.name} className={`portrait-border item`} onError={imageError}/>
          <p className='item-name'>{item.name}</p>
        </div>
      );
    }
    else if (item.id >= 10) {
      advancedItems.push(
        <div className='portrait-spacing item' key={item.id.toString()} onClick={(e) => selectItem(e, item)}>
          <img src={assets_url(image)} alt={item.name} className={`portrait-border item`} onError={imageError}/>
          <p className='item-name'>{item.name}</p>
        </div>
      );
    }
  }

  return (
    <div className='grid'>
      <div></div>
      <div>
        <h1 className='title'>Items Cheatsheet</h1>
          {loading && <CircularProgress className='circular-progress'/>}
          {error && <Alert severity={errorSeverity}>{errorMessage}</Alert>}
          { !loading && <div>
            {
              selectedItem !== undefined ? showItemDetail(selectedItem) : <div/> 
            }
            <div className='item-category-margins'>
              <div className='item-category-title'>Basic</div>
              <div className='item-category-content'>
                {basicItems}
              </div>
            </div>
            <div className='item-category-margins'>
              <div className='item-category-title'>Advanced</div>
              <div className='item-category-content'>
                {advancedItems}
              </div>
            </div>
            <div className='item-category-margins'>
              <div className='item-category-title'>Radiant</div>
              <div className='item-category-content'>
                {radiantItems}
              </div>
            </div>
            <div className='item-category-margins'>
              <div className='item-category-title'>Elusive</div>
              <div className='item-category-content'>
                {otherItems}
              </div>
            </div>
          </div>
          }
        </div>
        <div></div>
    </div>
  );
}

export default ItemsCheatSheet;
