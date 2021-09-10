import React from 'react';
import { sortCostAscending } from '../../helper/sorting';
import { withRouter } from 'react-router';
import { trait_desc_parse, trait_effect_parse } from '../../helper/string-parsing';
import { assets_url } from '../../helper/urls';

import './trait-card.css';
import '../../components/base.css';

const TraitCard = (props) => {
    const championRedirect = (championId) => {
        let path = '/cheatsheet/champions';
        props.history.push({pathname: path, search: `?champion=${championId}`, state: {data: championId}});
    }

    let championDesc = [];
    let champions = [];
    for (let champion of Object.values(props.champions)) {
        if (champion.traits.includes(props.trait.key)) {
            champions.push(champion);
        }
    }

    champions.sort(sortCostAscending);
    for (let champion of Object.values(champions)) {
        championDesc.push(
            <div className='portrait-spacing' onClick={() => championRedirect(champion.championId)} key={champion.championId}>
                <img src={champion.patch_data.icon} alt={champion.name} className={`portrait-border cost${champion.cost}`} onError={props.imageError}/>
                <p className='champion-name'>{champion.name}</p>
                <p className='cost'>${champion.cost}</p>
            </div>);
    }

    let bonuses_hashed = [];
    let stat_string = "";
    let desc_hashed = "";

    if (props.trait.patch_data.desc.indexOf('<expandRow>') !== -1) {
        if (props.trait.name === 'Assassin') {
            desc_hashed = props.trait.patch_data.desc.substring(props.trait.patch_data.desc.indexOf('<br><br>')+8, props.trait.patch_data.desc.indexOf('<br><br>', props.trait.patch_data.desc.indexOf('<br><br>')+9));
        }
        else {
            desc_hashed = trait_desc_parse(props.trait.patch_data);
        }

        stat_string = props.trait.patch_data.desc.substring(props.trait.patch_data.desc.indexOf('<expandRow>') + 11, props.trait.patch_data.desc.indexOf('</expandRow>', props.trait.patch_data.desc.indexOf('<expandRow>') + 12));
        let effects = trait_effect_parse(stat_string, props.trait.patch_data);
        for (let effect in effects) {
            bonuses_hashed.push(<div key={effect}>{effects[effect]}</div>);
        }
    }

    else {
        if (props.trait.name === 'Draconic') {
            let description = props.trait.patch_data.desc.replaceAll('<row>', '');
            description = description.replaceAll('</row>', '');
            description = description.replaceAll('<tftitemrules>', '');
            description = description.replaceAll('</tftitemrules>', '');
            
            stat_string = description.substring(0, description.indexOf('<br>'));
            stat_string = stat_string.replace('@MinUnits@', '3');
            bonuses_hashed.push(<div key={'0'}>{stat_string}</div>);
            
            let stat_string_2 = description.substring(description.indexOf('<br>') + 4, description.indexOf('<br><br>'));
            stat_string_2 = stat_string_2.replace('@MinUnits@', '5');
            bonuses_hashed.push(<div key={'1'}>{stat_string_2}</div>);
            bonuses_hashed.push(<div key={'2'}>{description.substring(description.indexOf('<br><br>')+8)}</div>)
        }
        else {
            let description = props.trait.patch_data.desc.replaceAll('<br>', '');
            let effects = trait_effect_parse(description, props.trait.patch_data);
            for (let effect in effects) {
                bonuses_hashed.push(<div key={effect}>{effects[effect]}</div>);
            }
        }
    }

    let image = props.trait.patch_data.icon.substring(0, props.trait.patch_data.icon.indexOf('dds')).toLowerCase();

    return(
        <div className='trait-style'>
            <div className='trait-header'>
                <div className='trait-card-icon'>
                    <img src={assets_url(image)} alt={props.trait.name} onError={props.imageError}/>
                </div>
                <div className='trait-title'>
                    {props.trait.patch_data.name}
                </div>
            </div>
            <div className='card-row'>
                {props.trait.innate}
            </div>
            <div className='card-row'>
                {desc_hashed}
            </div>
            <div className='card-row'>
                {championDesc}
            </div>
            <div className='card-row list'>
                {bonuses_hashed}
            </div>   
        </div>
    );
}

export default withRouter(TraitCard)