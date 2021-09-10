import React, { useState, useEffect } from 'react';
import { errorHandler, checkRateLimit, postData } from '../../../helper/api';
import { sortGametimeDescending } from '../../../helper/sorting';
import { companion_parse } from '../../../helper/string-parsing';
import { patch_data_url, match_url, summoner_by_puuid_url, host_url, companion_bin_url, companion_icon_url, profile_icon_url, rank_face_url, rank_crown_url } from '../../../helper/urls';
import MatchBasic from '../match-basic/match-basic.component.js';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SET_NUMBER, champions_fetch, items_fetch, traits_fetch, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../../helper/variables';

import './profile.css';
import '../../base.css';

const Profile = (props) => {
    const [champions, setChampions] = useState({});
    const [traits, setTraits] = useState({});
    const [items, setItems] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(1);
    const [error, setError] = useState(false);
    const [errorSeverity, setErrorSeverity] = useState("error");
    const [errorMessage, setErrorMessage] = useState("");
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
        let champions_arr = champions_fetch();
        let items_arr = items_fetch();
        let traits_arr = traits_fetch();

        try {
            let error_int = false;
            let patchData = await fetch(patch_data_url()).then(res => res.json());

            let thisSet = patchData.setData[SET_NUMBER];

            champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
            items_arr = item_patch_combine(items_arr, patchData.items);
            traits_arr = trait_patch_combine(traits_arr, thisSet.traits);
            setChampions(champions_arr);
            setItems(items_arr);
            setTraits(traits_arr);

            if (props.location.search) {
                if (props.location.state) {
                    const matchCount = 5;
                    let matchList = props.location.state.matchListData.slice(0, Math.min(props.location.state.matchListData.length, matchCount));

                    let callsObj = { 'platform': props.location.state.platform, platformCount: 8*matchList.length, 'region': props.location.state.region, regionCount: matchList.length }

                    let rateLimitCheck_1 = await Promise.resolve(checkRateLimit(callsObj));
                    if (rateLimitCheck_1 < 0) {
                        setError(true);
                        setErrorSeverity("error");
                        setErrorMessage("You are being rate limited.");
                    }
                    else {
                        let matchListUrls = matchList.map((m) => {
                            let request = new Request(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(props.location.state.region)}${match_url(m)}`, {
                                method: 'GET',
                                headers: {
                                    'Accept-Charset': 'application/json;charset=utf-8',
                                    'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                                }
                            });
                            return fetch(request).then(res => {
                                    if (!res.ok) {
                                        let errorStr = errorHandler(res.status);
                                        setError(true);
                                        setErrorSeverity("error");
                                        setLoading(false);
                                        setErrorMessage(errorStr);
                                        error_int = true;
                                    }
                                    return res.json();
                                }).catch(matchErr => console.error("Error retrieving match:" + matchErr));
                            });

                        if (error_int) { return; }

                        let ms = await Promise.all(matchListUrls);

                        if (!matchCount || !ms.length) {
                            setLoading(false);
                            return;
                        }

                        for (let i = 0; i < ms.length; i++) {
                            let playersUrls = [];
                            for (let j = 0; j < ms[i].info.participants.length; j++) {
                                
                                let request = new Request(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(props.location.state.platform)}${summoner_by_puuid_url(ms[i].info.participants[j].puuid)}`, {
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
                                            setError(true);
                                            setErrorSeverity("error");
                                            setLoading(false);
                                            setErrorMessage(errorStr);
                                            if (res.status === 429) {
                                                return;
                                            }
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
                                        setError(true);
                                        setErrorSeverity("error");
                                        setLoading(false);
                                        setErrorMessage(errorStr);
                                    }
                                    return res.json();
                                }).catch(companionErr => console.error("Error retrieving companion: " + companionErr));
                            });


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
                            let matches_m = matches;
                            matches_m.push(ms[i]);
                            matches_m.sort(sortGametimeDescending);
                            setMatches(matches_m);
                            setLoading(!(i === ms.length - 1));
                            setLoadingProgress(i+1);
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

        fetchData();
    }, [props, matches]);

    const createRank = () => {
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

        let rankedData = props.location.state.leagueData;
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
                <div className='ranked-card' key={0}>
                    <div>Ranked</div>
                    <div>{rankedData[rankedIndex].tier} {rankedData[rankedIndex].rank} / {rankedData[rankedIndex].leaguePoints} LP</div>
                    <div>
                        <img src={rank_face_url(tier, ranks[tier])} alt={tier} className='ranked-face' onError={imageError}/>
                        <img src={rank_crown_url(tier, ranks[tier], rank)} alt={rank} className='ranked-crown' onError={imageError}/>
                    </div>
                    <div>{rankedData[rankedIndex].wins} Wins / {rankedData[rankedIndex].losses} Losses</div>
                </div>
            );
        }

        else {
            rankedCards.push(
                <div className='ranked-card' key={1}>
                    <div>Ranked</div>
                    <div>Unranked</div>
                </div>
            );
        }
        rankedIndex = rankedData.findIndex(r => r.queueType === 'RANKED_TFT_TURBO');
        if (rankedIndex > -1) {
            rankedCards.push(
                <div className='ranked-card' key={2}>
                    <div>Hyper Roll</div>
                    <div>{rankedData[rankedIndex].ratedTier} / {rankedData[rankedIndex].ratedRating} Rating</div>
                    <div>{rankedData[rankedIndex].wins} Wins / {rankedData[rankedIndex].losses} Losses</div>
                </div>
            );
        }
        else {
            rankedCards.push(
                <div className='ranked-card' key={3}>
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

    const createMatches = () => {
        let matches_m = [];
        for (let match in matches) {
            matches_m.push(
                <div key={match} className='match'>
                    <MatchBasic 
                        puuid={props.location.state.summonerData.puuid} 
                        gamedata={matches[match]} 
                        champions={champions} 
                        items={items} 
                        traits={traits} 
                        imageError={imageError}
                        save={save}
                    />
                </div>
            );
        }

        return matches_m;
    }

    const imageError = () => {
        setError(true);
        setErrorSeverity("warning");
        setErrorMessage("Warning: Some images failed to load. Refreshing the page may solve the problem.");
    }

    const playerPlacement = (rank) => {
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

    const save = (e, player_p, traits_t, champions_c) => {
        let team = [];
        for (let i = 0; i < champions_c.length; i++) {
            let championTraits = champions[champions_c[i].character_id].traits;

            let items_i = [];
            for (let item of champions_c[i].items) {
                if (items[item].isElusive ||
                    (items[item].isUnique && item.toString().includes('8'))) {
                        let traitFromItem = items[item].name.substring(0, items[item].name.indexOf('Emblem')-1);
                        let trait = 'Set5_' + traitFromItem.replace(' ', '');
                        championTraits.push(trait);
                }
                else if (item === 99 || item === 2099) {
                    items_i = [item];
                    break;
                }
                items_i.push(item);
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

            team.push({champion: {championId: champions_c[i].character_id, traits: championTraits}, items: items_i, tier: champions_c[i].tier, hexSlot: i});
        }

        let color_arr = ['', 'bronze', 'silver', 'gold', 'chromatic'];
        let traits_arr = [];
        for (let i of traits_t) {
            traits_arr.push({key: i.name, champions: i.champions, count: i.num_units, color: color_arr[i.style], tier: i.style});
        }

        let teamName = `${player_p.name} - ${playerPlacement(player_p.placement)}`;
        let teamObj = {name: teamName, team: team, traits: traits_arr, date: new Date(), set: 5};
        postData('teams', teamObj, "");
        setError(true);
        setErrorSeverity("success");
        setErrorMessage(`Successfully saved team ${teamName}`);
        setTimeout(() => {
            setError(false);
        }, 3000);
    }

    return (
        <div>
            <div className='page-grid'>
                <div></div>
                    <div className='summoner-grid'>
                        {loading && <CircularProgress size={24}/>}
                        { !loading && 
                        <>
                            <img src={profile_icon_url(props.location.state.summonerData.profileIconId)} alt={props.location.state.summonerData.profileIconId} className='profile-icon' onError={imageError}/>
                            <div className='summoner-name'>{props.location.state.summonerData.name}</div>
                            <div className='level'>{props.location.state.summonerData.summonerLevel}</div>
                        </>
                        }
                    </div>
                <div></div>
            </div>
            <div className='page-grid'>
                <div></div>
                <div className='section'>
                    {error && <Alert severity={errorSeverity}>{errorMessage}</Alert>}
                    {!loading && createRank()}
                </div>
                <div></div>
            </div>
            <div className='page-grid-wide'>
                <div></div>
                <div>
                    {!loading && matches.length === 0 &&
                        <div className='no-match'>
                            No matches found
                        </div>
                    }
                    {loading && 
                        <div className='no-match'>
                            <CircularProgress size={24}/>
                            {`Loading match ${loadingProgress}`}
                        </div>
                    }
                    {!loading && createMatches()}
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default Profile;