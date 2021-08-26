import React, { Component } from 'react';
import { sortCostAscending } from '../api-helper/sorting.js';
import { withRouter } from 'react-router';
import { trait_desc_parse, trait_effect_parse } from '../api-helper/string-parsing.js';
import './trait-card.css';

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
        Object.keys(this.props.champions).forEach((key, index) => {
            if (this.props.champions[key].traits.includes(this.props.trait.key)) {
                champions.push(this.props.champions[key]);
            }
        });

        champions.sort(sortCostAscending);
        for (let champion in champions) {
            championDesc.push(
                <div className='champion-spacing' onClick={() => this.championRedirect(champions[champion].championId)} key={champions[champion].championId}>
                    <img src={champions[champion].patch_data.icon} alt={champions[champion].name} className={champions[champion].cost === 1 ? 'cost1champion' : champions[champion].cost === 2 ? 'cost2champion' : champions[champion].cost === 3 ? 'cost3champion' : champions[champion].cost === 4 ? 'cost4champion' : 'cost5champion'}/>
                    <p className='champion-name'>{champions[champion].name}</p>
                    <p className='cost'>${champions[champion].cost}</p>
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
                            <img src={`https://raw.communitydragon.org/latest/game/${image}png`} alt={this.props.trait.name} className='white-icon'/>
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