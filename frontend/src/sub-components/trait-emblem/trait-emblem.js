import React from 'react';
import { assets_url, trait_bg_url } from '../../helper/urls';

import './trait-emblem.css';
import '../../components/base.css';

const TraitEmblem = (props) => {
    return (
        <>
            {props.traitStyle !== '' && <img src={trait_bg_url(props.traitStyle)} alt={props.traitStyle} className={props.background} onError={props.imageError}/>}
            <img src={assets_url(props.image)} alt={props.name} onError={props.imageError} className={props.iconClassName}/>
        </>
    );
}

export default TraitEmblem;