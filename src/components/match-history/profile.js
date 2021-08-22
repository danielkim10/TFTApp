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
                    for (let i = 0; i < 5; i++) {
                        fetch(`https://infinite-anchorage-43166.herokuapp.com/https://americas.api.riotgames.com/tft/match/v1/matches/${this.props.location.state.matchListData[i]}`, {
                            method: 'GET',
                            headers: {
                                'Accept-Charset': 'application/json;charset=utf-8',
                                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                            }
                        }).then(res => res.json()).then(match => {
                            let matches = this.state.matches;
                            matches.push(match);
                            matches.sort(sortGametimeDescending);
                            console.log(matches);
                            this.setState({matches: matches});
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
            
            this.setState({champions: champions_arr, items: items_arr, traits: traits_arr, loading: false});
        });
    }

    createRank = () => {
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

    createMatches = () => {
        console.log('creating matches');
        let matches = [];
        for (let match in this.state.matches) {
            matches.push(
                <tr>
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
                                        <td style={{width: '33%'}}>
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
                                        <td style={{width: '66%'}}>
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