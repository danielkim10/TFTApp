import React, { Component } from 'react';
import { assets_url, trait_bg_url } from '../../helper/urls';

class TraitEmblem extends Component {
    constructor(props) {
        super(props);
        this.state = {
 
        }
    }

    render = () => {
        require('./trait-emblem.css');
        require('../../components/base.css');

        return (
            <>
                {this.props.traitStyle !== '' && <img src={trait_bg_url(this.props.traitStyle)} alt={this.props.traitStyle} className={this.props.background} onError={this.props.imageError}/>}
                <img src={assets_url(this.props.image)} alt={this.props.name} onError={this.props.imageError} className={this.props.iconClassName}/>
            </>
        );
    }
}

export default TraitEmblem;