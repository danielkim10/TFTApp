import React, { useState, useEffect } from 'react';
import TraitCard from '../../../sub-components/trait-card/trait-card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { patch_data_url } from '../../../helper/urls';
import { SET_NUMBER, champions_fetch, traits_fetch, champion_patch_combine, trait_patch_combine } from '../../../helper/variables';

import './traits-cheatsheet.component.css';
import '../../base.css';

const TraitsCheatSheet = (props) => {
  const [traits, setTraits] = useState({});
  const [champions, setChampions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorSeverity, setErrorSeverity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      let champions_arr = champions_fetch();
      let traits_arr = traits_fetch();
      try {
        let patchData = await fetch(patch_data_url()).then(res => res.json());
        let thisSet = patchData.setData[SET_NUMBER];
  
        champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
        traits_arr = trait_patch_combine(traits_arr, thisSet.traits);
        setChampions(champions_arr);
        setTraits(traits_arr);
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

  const createTrait = (data) => {
    return <TraitCard champions={champions} trait={data} imageError={imageError}/>
  }

  const imageError = () => {
    setError(true);
    setErrorSeverity("warning");
    setErrorMessage("Warning: Some images failed to load. Refreshing the page may solve the problem.");
  }

  let originCards = [];
    let classCards = [];

    for (let trait of Object.values(traits)) {
      if (trait.type === 'origin') {
        originCards.push(<div key={trait.key}>{createTrait(trait)}</div>);
      }
      else {
        classCards.push(<div key={trait.key}>{createTrait(trait)}</div>);
      }
    }

    return (
      <div className='page-grid'>
        <div></div>
        <div>
            <h1 className='title'>Traits Cheatsheet</h1>
            {error && <Alert severity={errorSeverity}>{errorMessage}</Alert>}
            <div className='content-grid-traits'>
              {loading && <CircularProgress className='circular-progress'/>}
              { !loading && 
                  <div>{originCards}</div>
              }
              <div></div>
              { !loading && 
                <div>{classCards}</div>
              }
          </div>
        </div>
        <div></div>
      </div>
    );
}

export default TraitsCheatSheet;
