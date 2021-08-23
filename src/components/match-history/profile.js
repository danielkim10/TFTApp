import React, { Component } from 'react';
import { sortTierDescending, sortPlacementAscending, sortTierMatchDescending, sortGametimeDescending } from '../../api-helper/sorting.js';
import { companion_parse } from '../../api-helper/string-parsing.js';
import MatchBasic from './match-basic.component.js';

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
        const proxyUrl = 'https://infinite-anchorage-43166.herokuapp.com/';
        const summonerUrl = '/tft/summoner/v1/summoners/by-puuid/';
        const leagueUrl = '/tft/league/v1/entries/by-summoner/';
        const matchUrl = '/tft/match/v1/matches/';
        const americas = 'https://americas.api.riotgames.com/';
        const platform = 'https://na1.api.riotgames.com';

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

        fetch("https://raw.communitydragon.org/latest/cdragon/tft/en_us.json").then(res => res.json()).then(res => {
            console.log(res);
            for (let champion in res.setData[5].champions) {
                if (champions_arr[res.setData[5].champions[champion].apiName] !== undefined) {
                    champions_arr[res.setData[5].champions[champion].apiName].patch_data = res.setData[5].champions[champion];
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
                        fetch(`${proxyUrl}${americas}${matchUrl}${this.props.location.state.matchListData[i]}`, {
                            method: 'GET',
                            headers: {
                                'Accept-Charset': 'application/json;charset=utf-8',
                                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                            }
                        }).then(res => res.json()).then(match => {

                            for (let j = 0; j < 8; j++) {
                                fetch(`${proxyUrl}${platform}${summonerUrl}${match.info.participants[j].puuid}`, {
                                    method: 'GET',
                                    headers: {
                                        'Accept-Charset': 'application/json;charset=utf-8',
                                        'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                                    }
                                }).then(res => res.json()).then(player => {
                                    //console.log(player.name);
                                    match.info.participants[j].name = player.name;

                                    if (j === 7) {
                                        let matches = this.state.matches;
                                        matches.push(match);
                                        matches.sort(sortGametimeDescending);
                                        
                                        this.setState({matches: matches});
                                    }
                                }).catch((err) => {
                                    console.error("Error retrieving player: " + err);
                                });
                            }
                        }).catch((err) => {
                            console.error("Error retrieving match: " + err);
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
        });
    }

    createRank = () => {
        let rankedData = [];
        if (this.props.location.state.leagueData.length === 2) {

        }
        else if (this.props.location.state.leagueData.length === 1) {
                if (this.props.location.state.leagueData[0].queueType === 'RANKED_TFT') {

                }
                else {

                }
        }
        else {

        }

        return (
            <table>
                <tbody>
                    <tr>
                        <td>{this.props.location.state.leagueData[0].queueType}</td>
                    </tr>
                    <tr>
                        <td>{this.props.location.state.leagueData[0].tier} {this.props.location.state.leagueData[0].rank}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    createHyperRoll = () => {
        if (this.props.location.state.leagueData.length !== 0) {

        }

        return (
            <table>
                <tbody>
                    <tr>
                        <td>Hyper Roll</td>
                    </tr>
                    <tr>
                        <td></td>
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
                        <td style={{width: '16%'}}>asdfasdf</td>
                        <td style={{width: '66%'}}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <img src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${this.props.location.state.summonerData.profileIconId}.jpg`} style={{width: '50px', height: '50px'}}/>
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
                                                        <td>
                                                            {this.createHyperRoll()}
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
                        <td style={{width: '16%'}}>asdfasdf</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Profile;