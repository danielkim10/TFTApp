import React, { Component } from 'react';
import { sortGametimeDescending } from '../../api-helper/sorting';
import { companion_parse, champion_icon_parse } from '../../api-helper/string-parsing';
import { patch_data_url, match_url, summoner_by_puuid_url, host_url, companion_bin_url, companion_icon_url, profile_icon_url, rank_face_url, rank_crown_url } from '../../api-helper/urls';
import MatchBasic from './match-basic.component.js';

import './profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            champions: {},
            traits: {},
            items: {},
            loading: false,
            matches: [],
        }
    }

    componentDidMount = () => {
        this.setState({loading: true});
        let champions = require("../../data/champions.json");
        let items = require("../../data/items.json");
        let traits = require("../../data/traits.json");

        let champions_arr = {};
        for (let champion in champions) {
            if (champions[champion].championId.startsWith("TFT5_")) {
            champions_arr[champions[champion].championId] = champions[champion]; 
            }
        }

        let items_arr = {};
        for (let item in items) {
            items_arr['i' + items[item].id] = items[item];
        }

        let traits_arr = {};
        for (let trait in traits) {
            traits_arr[traits[trait].key] = traits[trait];
        }

        fetch(patch_data_url()).then(res => res.json()).then(res => {
            console.log(res);
            for (let champion in res.setData[5].champions) {
                if (champions_arr[res.setData[5].champions[champion].apiName] !== undefined) {
                    champions_arr[res.setData[5].champions[champion].apiName].patch_data = res.setData[5].champions[champion];
                    champions_arr[res.setData[5].champions[champion].apiName].patch_data.icon = champion_icon_parse(champions_arr[res.setData[5].champions[champion].apiName].patch_data.icon);
                }
            }

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

            for (let trait in res.setData[5].traits) {
                if (traits_arr[res.setData[5].traits[trait].apiName] !== undefined) {
                    traits_arr[res.setData[5].traits[trait].apiName].patch_data = res.setData[5].traits[trait];
                    traits_arr[res.setData[5].traits[trait].apiName].count = 0;
                }

            }
            console.log(this.props.location);
            
            if (this.props.location.search) {
                if (this.props.location.state) {
                    for (let i = 0; i < 1; i++) {
                        fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.props.location.state.region)}${match_url(this.props.location.state.matchListData[i])}`, {
                            method: 'GET',
                            headers: {
                                'Accept-Charset': 'application/json;charset=utf-8',
                                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                            }
                        }).then(res => res.json()).then(match => {
                            console.log(match);


                            for (let j = 0; j < 8; j++) {
                                    fetch(companion_bin_url(match.info.participants[j].companion.species.toLowerCase(), match.info.participants[j].companion.skin_ID)).then(res => res.json()).then(companion => {
                                        let companionData = companion[`Characters/${match.info.participants[j].companion.species}/Skins/Skin${match.info.participants[j].companion.skin_ID}`];
                                        if (companionData === undefined) {
                                            companionData = companion[companion_parse(`Characters/${match.info.participants[j].companion.species}/Skins/Skin${match.info.participants[j].companion.skin_ID}`.toLowerCase())];
                                        }
                                        console.log(companionData);
                                        let iconCircle = companionData.iconCircle.substring(0, companionData.iconCircle.indexOf('dds')).toLowerCase();
                                    
                                        fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.props.location.state.platform)}${summoner_by_puuid_url(match.info.participants[j].puuid)}`, {
                                            method: 'GET',
                                            headers: {
                                                'Accept-Charset': 'application/json;charset=utf-8',
                                                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                                            }
                                        }).then(res => res.json()).then(player => {
                                            //console.log(player.name);
                                            match.info.participants[j].name = player.name;
                                            match.info.participants[j].companion.image_source = companion_icon_url(iconCircle);

                                            if (j === 7) {
                                                console.log(this.state);
                                                let matches = this.state.matches;
                                                matches.push(match);
                                                matches.sort(sortGametimeDescending);
                                                console.log(match);
                                                this.setState({matches: matches});
                                            }
                                        }).catch((playerErr) => {
                                            console.error("Error retrieving player: " + playerErr);
                                        });
                                    }).catch((companionErr) => {
                                        console.error("Error retrieving companion: " + companionErr);
                                    });
                                
                            }



                        }).catch((matchErr) => {
                            console.error("Error retrieving match: " + matchErr);
                        });
                    }
                }
                else {

                }
            }
            else {

            }
            console.log(traits_arr);
            this.setState({champions: champions_arr, items: items_arr, traits: traits_arr, loading: false});
        }).catch((patchDataErr) => {
            console.error("Error retrieving patch data: " + patchDataErr);
        });
    }

    createRank = () => {
        let ranks = {
            'iron': 1,
            'bronze': 2,
            'silver': 3,
            'gold': 4,
            'platinum': 5,
            'diamond': 6,
            'master': 7,
            'grandmaster': 8,
            'challenger': 9
        };

        let rankedData = this.props.location.state.leagueData;
        let rankedCards = [];
        let rankedIndex = rankedData.findIndex(r => r.queueType === 'RANKED_TFT');
        if (rankedIndex > -1) {
            let tier = rankedData[rankedIndex].tier.toLowerCase();
            let rank = 1;
            if (rankedData[rankedIndex].rank === 'IV') {
                rank = 4;
            }
            else if (rankedData[rankedIndex].rank === 'III') {
                rank = 3;
            }
            else if (rankedData[rankedIndex].rank === 'II') {
                rank = 2;
            }


            rankedCards.push(
                <td>
                    <table>
                        <tbody>
                            <tr>
                                <td>Ranked</td>
                            </tr>
                            <tr>
                                <td>{rankedData[rankedIndex].tier} {rankedData[rankedIndex].rank}</td>
                            </tr>
                            <tr>
                                <td>
                                    <img src={rank_face_url(tier, ranks[tier])} className='ranked-face'/>
                                    <img src={rank_crown_url(tier, ranks[tier], rank)} className='ranked-crown'/>
                                </td>
                            </tr>
                            <tr>
                                <td>{rankedData[rankedIndex].leaguePoints} LP</td>
                            </tr>
                            <tr>
                                <td>
                                    {rankedData[rankedIndex].wins} Wins / {rankedData[rankedIndex].losses} Losses
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            );
        }

        else {
            rankedCards.push(
                <td>
                    <table>
                        <tbody>
                            <tr>
                                <td>Ranked</td>
                            </tr>
                            <tr>
                                <td>Unranked</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            );
        }
        rankedIndex = rankedData.findIndex(r => r.queueType === 'RANKED_TFT_TURBO');
        if (rankedIndex > -1) {
            rankedCards.push(
                <td>
                    <table>
                        <tbody>
                            <tr>
                                <td>Hyper Roll</td>
                            </tr>
                            <tr>
                                <td>{rankedData[rankedIndex].ratedTier}</td>
                            </tr>
                            <tr>
                                <td>{rankedData[rankedIndex].ratedRating} Rating</td>
                            </tr>
                            <tr>
                                <td>
                                    {rankedData[rankedIndex].wins} Wins / {rankedData[rankedIndex].losses} Losses
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            );
        }
        else {
            rankedCards.push(
                <td>
                    <table>
                        <tbody>
                            <tr>
                                <td>Hyper Roll</td>
                            </tr>
                            <tr>
                                <td>Unrated</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            );
        }


        return (
            <table>
                <tbody>
                    <tr>
                        {rankedCards}
                    </tr>
                </tbody>
            </table>
        );
    }

    createMatches = () => {
        console.log('creating matches');
        let matches = [];
        for (let match in this.state.matches) {
            matches.push(
                <tr key={match}>
                    <td><MatchBasic puuid={this.props.location.state.summonerData.puuid} gamedata={this.state.matches[match]} champions={this.state.champions} items={this.state.items} traits={this.state.traits}/></td>
                </tr>
            );
        }
        return matches;
    }

    render = () => {
        return (
            <table>
                <tbody>
                    <tr>
                        <td style={{width: '16%'}}></td>
                        <td style={{width: '66%'}}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <img src={profile_icon_url(this.props.location.state.summonerData.profileIconId)} alt={this.props.location.state.summonerData.profileIconId} style={{width: '50px', height: '50px'}}/>
                                                        </td>
                                                        <td>{this.props.location.state.summonerData.name}</td>
                                                        <td>{this.props.location.state.summonerData.summonerLevel}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            
                                        </td>
                                        
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            {this.createRank()}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{position: 'relative'}}>
                                            <table>
                                                <tbody>
                                                    {this.createMatches()}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td style={{width: '16%'}}></td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Profile;