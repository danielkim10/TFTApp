import React, { Component } from 'react';
import { errorHandler, checkRateLimit } from '../../../helper/api';
import { sortGametimeDescending } from '../../../helper/sorting';
import { companion_parse, champion_icon_parse } from '../../../helper/string-parsing';
import { patch_data_url, match_url, summoner_by_puuid_url, host_url, companion_bin_url, companion_icon_url, profile_icon_url, rank_face_url, rank_crown_url } from '../../../helper/urls';
import MatchBasic from '../match-basic/match-basic.component.js';
import Alert from '@material-ui/lab/Alert';

import './profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            champions: {},
            traits: {},
            items: {},
            loading: false,
            error: false,
            errorMessage: "",
            matches: [],
        }
    }

    componentDidMount = () => {
        this.setState({loading: true});
        let champions = require("../../../data/champions.json");
        let items = require("../../../data/items.json");
        let traits = require("../../../data/traits.json");

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

        fetch(patch_data_url()).then(res => {
            if (!res.ok) {
                let errorStr = errorHandler(res.status);
                this.setState({error: true, loading: false, errorMessage: errorStr});
                throw Error(errorStr);
            }
            return res.json();
        }).then(res => {
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
            
            if (this.props.location.search) {
                if (this.props.location.state) {
                    const matchCount = 1;
                    let matchList = this.props.location.state.matchListData.slice(0, matchCount);
                    
                    Promise.resolve(checkRateLimit(this.props.location.state.region, 1)).then(rlc1 => {
                        if (rlc1 < 0) {
                            this.setState({error: true, loading: false, errorMessage: 'You are being rate limited'});
                            throw Error('Rate limiting in effect');
                        }
                        else {
                            let matchListUrls = matchList.map((m) => {
                                let request = new Request(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.props.location.state.region)}${match_url(m)}`, {
                                    method: 'GET',
                                    headers: {
                                        'Accept-Charset': 'application/json;charset=utf-8',
                                        'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                                    }
                                });
                                return fetch(request).then(res => {
                                        if (!res.ok) {
                                            let errorStr = errorHandler(res.status);
                                            this.setState({error: true, loading: false, errorMessage: errorStr});
                                            throw Error(errorStr);
                                        }
                                        return res.json();
                                    }).catch(matchErr => console.error("Error retrieving match:" + matchErr));
                                });
                            

                            Promise.all(matchListUrls).then(ms => {
                                console.log(ms);
                                for (let i = 0; i < ms.length; i++) {
                                    let playersUrls = [];
                                    
                                    Promise.resolve(checkRateLimit(this.props.location.state.platform, 8*ms.length)).then(rlc2 => {
                                        if (rlc2 < 0) {
                                            this.setState({error: true, loading: false, errorMessage: 'You are being rate limited'});
                                            throw Error('Rate limiting in effect');
                                        }
                                        else {
                                            for (let j = 0; j < ms[i].info.participants.length; j++) {
                                                let request = new Request(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.props.location.state.platform)}${summoner_by_puuid_url(ms[i].info.participants[j].puuid)}`, {
                                                    method: 'GET',
                                                    headers: {
                                                        'Accept-Charset': 'application/json;charset=utf-8',
                                                        'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                                                    }
                                                });
                                                let promise = new Promise(resolve => setTimeout(resolve, 125*((i+1)*j+1))).then(() => 
                                                    fetch(request).then(res => {
                                                        if (!res.ok) {
                                                            let errorStr = errorHandler(res.status);
                                                            this.setState({error: true, loading: false, errorMessage: errorStr});
                                                            throw Error(errorStr);
                                                        }
                                                        return res.json();
                                                    }).catch(playerErr => console.error("Error retrieving player: " + playerErr)));
                                                playersUrls.push(promise);
                                            }
    
                                            let companionsUrls = [];
                                            let companionSpecies = [];
                                            let companionSkinIDs = [];
                                            companionsUrls = ms[i].info.participants.map((participant) => {
                                                let request = new Request(companion_bin_url(participant.companion.species.toLowerCase(), participant.companion.skin_ID));
                                                companionSpecies.push(participant.companion.species);
                                                companionSkinIDs.push(participant.companion.skin_ID);
                                                return fetch(request).then(res => {
                                                    if (!res.ok) {
                                                        let errorStr = errorHandler(res.status);
                                                        this.setState({error: true, loading: false, errorMessage: errorStr});
                                                        throw Error(errorStr);
                                                    }
                                                    return res.json();
                                                }).catch(companionErr => console.error("Error retrieving companion: " + companionErr));
                                            });
    
                                            Promise.all(playersUrls).then(players => {
                                                Promise.all(companionsUrls).then(companions => {
                                                    for (let j = 0; j < players.length; j++) {
                                                        ms[i].info.participants[j].name = players[j].name;
                                                    
                                                        let companionData = companions[j][`Characters/${companionSpecies[j]}/Skins/Skin${companionSkinIDs[j]}`];
                                                        if (companionData === undefined) {
                                                            companionData = companions[j][companion_parse(`Characters/${companionSpecies[j]}/Skins/Skin${companionSkinIDs[j]}`.toLowerCase())];
                                                        }
                                                        let iconCircle = companionData.iconCircle.substring(0, companionData.iconCircle.indexOf('dds')).toLowerCase();
                                                        ms[i].info.participants[j].companion.image_source = companion_icon_url(iconCircle);
                                                    }
                                                    let matches = this.state.matches;
                                                    matches.push(ms[i]);
                                                    matches.sort(sortGametimeDescending);
                                                    this.setState({matches: matches});
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {

                }
            }
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
                <td key='0'>
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
                                    <img src={rank_face_url(tier, ranks[tier])} alt={tier} className='ranked-face'/>
                                    <img src={rank_crown_url(tier, ranks[tier], rank)} alt={rank} className='ranked-crown'/>
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
                <td key='1'>
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
                <td key='2'>
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
                <td key='3'>
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
            <table className='text'>
                <tbody>
                    <tr>
                        <td className='side-margins'></td>
                        <td className='main-content'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <img src={profile_icon_url(this.props.location.state.summonerData.profileIconId)} alt={this.props.location.state.summonerData.profileIconId} className='profile-icon'/>
                                                        </td>
                                                        <td className='summoner-name'>{this.props.location.state.summonerData.name}</td>
                                                        <td className='level'>{this.props.location.state.summonerData.summonerLevel}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            
                                        </td>
                                        
                                    </tr>
                                    <tr>
                                        {this.state.error && <Alert severity="error">{this.state.errorMessage}</Alert>}
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
                                        <td>
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
                        <td className='side-margins'></td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Profile;