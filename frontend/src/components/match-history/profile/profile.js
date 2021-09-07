import React, { Component } from 'react';
import { errorHandler, checkRateLimit, postData } from '../../../helper/api';
import { sortGametimeDescending } from '../../../helper/sorting';
import { companion_parse } from '../../../helper/string-parsing';
import { patch_data_url, match_url, summoner_by_puuid_url, host_url, companion_bin_url, companion_icon_url, profile_icon_url, rank_face_url, rank_crown_url } from '../../../helper/urls';
import MatchBasic from '../match-basic/match-basic.component.js';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SET_NUMBER, champions, items, traits, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../../helper/variables';

class Profile extends Component {
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
            loading: false,
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

            let thisSet = patchData.setData[SET_NUMBER];

            champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
            items_arr = item_patch_combine(items_arr, patchData.items);
            traits_arr = trait_patch_combine(traits_arr, thisSet.traits);
            this.setState({champions: champions_arr, items: items_arr, traits: traits_arr});

            if (this.props.location.search) {
                if (this.props.location.state) {
                    const matchCount = 5;
                    let matchList = this.props.location.state.matchListData.slice(0, Math.min(this.props.location.state.matchListData.length, matchCount));

                    let callsObj = { 'platform': this.props.location.state.platform, platformCount: 8*matchList.length, 'region': this.props.location.state.region, regionCount: matchList.length }

                    let rateLimitCheck_1 = await Promise.resolve(checkRateLimit(callsObj));
                    if (rateLimitCheck_1 < 0) {
                        this.setState({error: true, errorSeverity: "error", loading: false, errorMessage: 'You are being rate limited'});
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
                                        this.setState({error: true, errorSeverity: "error", loading: false, errorMessage: errorStr});
                                        error = true;
                                    }
                                    return res.json();
                                }).catch(matchErr => console.error("Error retrieving match:" + matchErr));
                            });

                        if (error) { return; }

                        let ms = await Promise.all(matchListUrls);

                        if (!matchCount || !ms.length) {
                            this.setState({
                                summonerLevel: this.props.location.state.summonerData.summonerLevel, 
                                summonerName: this.props.location.state.summonerData.name, 
                                profileIconId: this.props.location.state.summonerData.profileIconId,
                                puuid: this.props.location.state.summonerData.puuid,
                                leagueData: this.props.location.state.leagueData,
                                loading: false
                            });
                            return;
                        }

                        for (let i = 0; i < ms.length; i++) {
                            let playersUrls = [];

                            // let rateLimitCheck_2 = await Promise.resolve(checkRateLimit(this.props.location.state.platform, 8*ms.length));
                            // if (rateLimitCheck_2 < 0) {
                            //     this.setState({error: true, errorSeverity: "error", loading: false, errorMessage: 'You are being rate limited'});
                            // }
                            // else {
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
                                                this.setState({error: true, errorSeverity: "error", loading: false, errorMessage: errorStr});
                                                if (res.status === 429) {
                                                    return;
                                                }
                                            }
                                            return res.json();
                                        }).catch(playerErr => console.error("Error retrieving player: " + playerErr)));
                                    playersUrls.push(promise);
                                }

                                if (this.state.error) { return; }

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
                                            this.setState({error: true, errorSeverity: "error", loading: false, errorMessage: errorStr});
                                        }
                                        return res.json();
                                    }).catch(companionErr => console.error("Error retrieving companion: " + companionErr));
                                });

                                if (this.state.error) { return; }

                                let players = await Promise.all(playersUrls);
                                let companions = await Promise.all(companionsUrls);
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
                                this.setState({
                                    matches: matches, 
                                    summonerLevel: this.props.location.state.summonerData.summonerLevel, 
                                    summonerName: this.props.location.state.summonerData.name, 
                                    profileIconId: this.props.location.state.summonerData.profileIconId,
                                    puuid: this.props.location.state.summonerData.puuid,
                                    leagueData: this.props.location.state.leagueData,
                                    loading: !(i === ms.length - 1),
                                    loadingProgress: i+1
                                });
                            // }
                        }
                    }
                }
                else {
                    window.location.href = `${process.env.REACT_APP_SITE}matchhistory`;
                }
            }
            else {
                window.location.href = `${process.env.REACT_APP_SITE}matchhistory`;
            }
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
        require('./profile.css');
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

export default Profile;