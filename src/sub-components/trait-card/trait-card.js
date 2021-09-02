import React, { Component } from 'react';
import { sortCostAscending } from '../../helper/sorting';
import { withRouter } from 'react-router';
import { trait_desc_parse, trait_effect_parse } from '../../helper/string-parsing';
import './trait-card.css';
import { assets_url } from '../../helper/urls';

class TraitCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    championRedirect(championId) {
        let path = '/cheatsheet/champions';
        this.props.history.push({pathname: path, search: `?champion=${championId}`, state: {data: championId}});
    }

    render() {
        let championDesc = [];
        let champions = [];
        for (let champion of Object.values(this.props.champions)) {
            if (champion.traits.includes(this.props.trait.key)) {
                champions.push(champion);
            }
        }

        champions.sort(sortCostAscending);
        for (let champion of Object.values(champions)) {
            championDesc.push(
                <div className='champion-spacing' onClick={() => this.championRedirect(champion.championId)} key={champion.championId}>
                    <img src={champion.patch_data.icon} alt={champion.name} className={`cost${champion.cost}champion`}/>
                    <p className='champion-name'>{champion.name}</p>
                    <p className='cost'>${champion.cost}</p>
                </div>);
        }

        let bonuses_hashed = [];
        let stat_string = "";
        let desc_hashed = "";
        if (this.props.trait.patch_data.desc.indexOf('<expandRow>') !== -1) {
            desc_hashed = trait_desc_parse(this.props.trait.patch_data);
            stat_string = this.props.trait.patch_data.desc.substring(this.props.trait.patch_data.desc.indexOf('<expandRow>') + 11, this.props.trait.patch_data.desc.length - 12);
            let effects = trait_effect_parse(stat_string, this.props.trait.patch_data);
            for (let effect in effects) {
                bonuses_hashed.push(<tr key={effect}><td key={effect} className='white-text'>{effects[effect]}</td></tr>)
            }
        }

        let image = this.props.trait.patch_data.icon.substring(0, this.props.trait.patch_data.icon.indexOf('dds')).toLowerCase();

        return(
            <div className='div-margins'>
                <table>
                    <tbody>
                        <tr>
                            <td style={{width: '70px'}}>
                            <img src={assets_url(image)} alt={this.props.trait.name} className='white-icon'/>
                            </td>
                            <td className='white-text'>{this.props.trait.patch_data.name}</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td className='white-text'>{this.props.trait.innate}</td>
                        </tr>
                        <tr>
                            <td className='white-text'>{desc_hashed}</td>
                        </tr>
                        <tr>
                            <td>{championDesc}</td>
                        </tr>
                        {bonuses_hashed}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withRouter(TraitCard)