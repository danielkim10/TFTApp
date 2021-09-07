import React, { Component } from 'react';
import { postData } from '../../../helper/api';
import { patch_data_url, profile_icon_url, rank_face_url, rank_crown_url } from '../../../helper/urls';
import MatchBasic from '../match-basic/match-basic.component.js';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SET_NUMBER, champions, items, traits, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../../helper/variables';

class SampleData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            champions: {},
            traits: {},
            items: {},
            profileIconId: "",
            summonerName: "",
            summonerLevel: 0,
            puuid: "",
            leagueData: [],
            loading: true,
            loadingProgress: 1,
            error: false,
            errorSeverity: "",
            errorMessage: "",
            matches: [],
        }
    }

    componentDidMount = async () => {
        this.setState({loading: true});

        let champions_arr = champions();
        let items_arr = items();
        let traits_arr = traits();

        try {
            let error = false;
            let patchData = await fetch(patch_data_url()).then(res => res.json());

            if (error) { return; }

            let thisSet = patchData.setData[SET_NUMBER];

            champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
            items_arr = item_patch_combine(items_arr, patchData.items);
            traits_arr = trait_patch_combine(traits_arr, thisSet.traits);
            let summoner = require('../../../data/sample-data/sample-summoner.json');
            let sample_matches = require('../../../data/sample-data/sample-matches.json');
            let rank = require('../../../data/sample-data/sample-rank.json');
            this.setState({
                champions: champions_arr, 
                items: items_arr, 
                traits: traits_arr,
                matches: sample_matches,
                leagueData: rank, 
                loading: false, 
                summonerName: summoner.name,
                summonerLevel: summoner.summonerLevel,
                puuid: summoner.puuid,
                profileIconId: summoner.profileIconId,
            });
        } catch (err) {
            console.error('Error retrieving patch data: ' + err);
        }
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

        let rankedData = this.state.leagueData;
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
                <div className='ranked-card'>
                    <div>Ranked</div>
                    <div>{rankedData[rankedIndex].tier} {rankedData[rankedIndex].rank} / {rankedData[rankedIndex].leaguePoints} LP</div>
                    <div>
                        <img src={rank_face_url(tier, ranks[tier])} alt={tier} className='ranked-face' onError={this.imageError}/>
                        <img src={rank_crown_url(tier, ranks[tier], rank)} alt={rank} className='ranked-crown' onError={this.imageError}/>
                    </div>
                    <div>{rankedData[rankedIndex].wins} Wins / {rankedData[rankedIndex].losses} Losses</div>
                </div>
            );
        }

        else {
            rankedCards.push(
                <div className='ranked-card'>
                    <div>Ranked</div>
                    <div>Unranked</div>
                </div>
            );
        }
        rankedIndex = rankedData.findIndex(r => r.queueType === 'RANKED_TFT_TURBO');
        if (rankedIndex > -1) {
            rankedCards.push(
                <div className='ranked-card'>
                    <div>Hyper Roll</div>
                    <div>{rankedData[rankedIndex].ratedTier} / {rankedData[rankedIndex].ratedRating} Rating</div>
                    <div>{rankedData[rankedIndex].wins} Wins / {rankedData[rankedIndex].losses} Losses</div>
                </div>
            );
        }
        else {
            rankedCards.push(
                <div className='ranked-card'>
                    <div>Hyper Roll</div>
                    <div>Unranked</div>
                </div>
            );
        }


        return (
            <div className='ranked-card-grid'>
                {rankedCards}
            </div>        
        );
    }

    createMatches = () => {
        let matches = [];
        for (let match in this.state.matches) {
            matches.push(
                <div key={match} className='match'>
                    <MatchBasic 
                        puuid={this.state.puuid} 
                        gamedata={this.state.matches[match]} 
                        champions={this.state.champions} 
                        items={this.state.items} 
                        traits={this.state.traits} 
                        imageError={this.imageError}
                        save={this.save}
                        copy={this.copy}
                    />
                </div>
            );
        }

        return matches;
    }

    imageError = () => {
        this.setState({
          error: true, 
          errorSeverity: "warning", 
          errorMessage: "Warning: Some images failed to load. Refreshing the page may solve the problem."
        });
    }

    playerPlacement = (rank) => {
        let placement = '';
        switch (rank) {
          case 1:
            placement = '1st';
            break;
          case 2:
            placement = '2nd';
            break;
          case 3:
            placement = '3rd';
            break;
          case 4:
            placement = '4th';
            break;
          default:
            placement = rank + 'th';
            break;
        }
        return (placement);
      }

    save = (e, player_p, traits_t, champions_c) => {
        let team = [];
        for (let i = 0; i < champions_c.length; i++) {
            let championTraits = this.state.champions[champions_c[i].character_id].traits;

            let items = [];
            for (let item of champions_c[i].items) {
                if (this.state.items[item].isElusive ||
                    (this.state.items[item].isUnique && item.toString().includes('8'))) {
                        let traitFromItem = this.state.items[item].name.substring(0, this.state.items[item].name.indexOf('Emblem')-1);
                        let trait = 'Set5_' + traitFromItem.replace(' ', '');
                        championTraits.push(trait);
                }
                else if (item === 99 || item === 2099) {
                    items = [item];
                    break;
                }
                items.push(item);
            }

            for (let trait of championTraits) {
                let index = traits_t.findIndex(t => t.name === trait);
                if (traits_t[index].champions === undefined) {
                    traits_t[index].champions = [champions_c[i].character_id];
                }
                else {
                    traits_t[index].champions.push(champions_c[i].character_id);
                }
            }

            team.push({champion: {championId: champions_c[i].character_id, traits: championTraits}, items: items, tier: champions_c[i].tier, hexSlot: i});
        }

        let color_arr = ['', 'bronze', 'silver', 'gold', 'chromatic'];
        let traits = [];
        for (let i of traits_t) {
            traits.push({key: i.name, champions: i.champions, count: i.num_units, color: color_arr[i.style], tier: i.style});
        }

        let teamName = `${player_p.name} - ${this.playerPlacement(player_p.placement)}`;
        let teamObj = {name: teamName, team: team, traits: traits, date: new Date(), set: 5};
        postData('teams', teamObj, "");
        this.setState({error: true, errorSeverity: 'success', errorMessage: `Successfully saved team ${teamName}`});
        setTimeout(() => {
            this.setState({error: false});
        }, 3000);
    }

    render = () => {
        require('../profile/profile.css');
        require('../../base.css');

        return (
            <div>
                <div className='page-grid'>
                    <div></div>
                        <div className='summoner-grid'>
                            {this.state.loading && <CircularProgress size={24}/>}
                            { !this.state.loading && 
                            <>
                                <img src={profile_icon_url(this.state.profileIconId)} alt={this.state.profileIconId} className='profile-icon' onError={this.imageError}/>
                                <div className='summoner-name'>{this.state.summonerName}</div>
                                <div className='level'>{this.state.summonerLevel}</div>
                                <div>This page is for users that want to see the end product without using the API. Summoner names and IDs are changed and/or hidden</div>
                            </>
                            }
                        </div>
                    <div></div>
                </div>
                <div className='page-grid'>
                    <div></div>
                    <div className='section'>
                        {this.state.error && <Alert severity={this.state.errorSeverity}>{this.state.errorMessage}</Alert>}
                        {!this.state.loading && this.createRank()}
                    </div>
                    <div></div>
                </div>
                <div className='page-grid-wide'>
                    <div></div>
                    <div>
                        {!this.state.loading && this.state.matches.length === 0 &&
                            <div className='no-match'>
                                No matches found
                            </div>
                        }
                        {this.state.loading && 
                            <div className='no-match'>
                                <CircularProgress size={24}/>
                                {`Loading match ${this.state.loadingProgress}`}
                            </div>
                        }
                        {!this.state.loading && this.createMatches()}
                    </div>
                    <div></div>
                </div>
            </div>
        );
    }
}

export default SampleData;