import React, { useState, useEffect } from 'react';
import { postData } from '../../../helper/api';
import { patch_data_url, profile_icon_url, rank_face_url, rank_crown_url } from '../../../helper/urls';
import MatchBasic from '../match-basic/match-basic.component.js';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SET_NUMBER, champions_fetch, items_fetch, traits_fetch, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../../helper/variables';

import '../profile/profile.css';
import '../../base.css';

const SampleData = (props) => {
    const [champions, setChampions] = useState({});
    const [traits, setTraits] = useState({});
    const [items, setItems] = useState({});
    const [profileIconId, setProfileIconId] = useState(1);
    const [summonerName, setSummonerName] = useState("");
    const [summonerLevel, setSummonerLevel] = useState(0);
    const [puuid, setPuuid] = useState("");
    const [leagueData, setLeagueData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorSeverity, setErrorSeverity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            let champions_arr = champions_fetch();
            let items_arr = items_fetch();
            let traits_arr = traits_fetch();

            try {
                let patchData = await fetch(patch_data_url()).then(res => res.json());

                let thisSet = patchData.setData[SET_NUMBER];

                champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
                items_arr = item_patch_combine(items_arr, patchData.items);
                traits_arr = trait_patch_combine(traits_arr, thisSet.traits);
                let summoner = require('../../../data/sample-data/sample-summoner.json');
                let sample_matches = require('../../../data/sample-data/sample-matches.json');
                let rank = require('../../../data/sample-data/sample-rank.json');

                setChampions(champions_arr);
                setItems(items_arr);
                setTraits(traits_arr);
                setMatches(sample_matches);
                setLeagueData(rank);
                setLoading(false);
                setSummonerName(summoner.name);
                setSummonerLevel(summoner.summonerLevel);
                setPuuid(summoner.puuid);
                setProfileIconId(summoner.profileIconId)
            } catch (err) {
                setError(true);
                setLoading(false);
                setErrorSeverity("error");
                setErrorMessage(`Error retrieving patch data: ${err}. Try refreshing the page.`);
            }
        }

        fetchData();
    }, []);

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

        let rankedCards = [];
        let rankedIndex = leagueData.findIndex(r => r.queueType === 'RANKED_TFT');
        if (rankedIndex > -1) {
            let tier = leagueData[rankedIndex].tier.toLowerCase();
            let rank = 1;
            if (leagueData[rankedIndex].rank === 'IV') {
                rank = 4;
            }
            else if (leagueData[rankedIndex].rank === 'III') {
                rank = 3;
            }
            else if (leagueData[rankedIndex].rank === 'II') {
                rank = 2;
            }


            rankedCards.push(
                <div className='ranked-card' key={0}>
                    <div>Ranked</div>
                    <div>{leagueData[rankedIndex].tier} {leagueData[rankedIndex].rank} / {leagueData[rankedIndex].leaguePoints} LP</div>
                    <div>
                        <img src={rank_face_url(tier, ranks[tier])} alt={tier} className='ranked-face' onError={imageError}/>
                        <img src={rank_crown_url(tier, ranks[tier], rank)} alt={rank} className='ranked-crown' onError={imageError}/>
                    </div>
                    <div>{leagueData[rankedIndex].wins} Wins / {leagueData[rankedIndex].losses} Losses</div>
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
        rankedIndex = leagueData.findIndex(r => r.queueType === 'RANKED_TFT_TURBO');
        if (rankedIndex > -1) {
            rankedCards.push(
                <div className='ranked-card' key={2}>
                    <div>Hyper Roll</div>
                    <div>{leagueData[rankedIndex].ratedTier} / {leagueData[rankedIndex].ratedRating} Rating</div>
                    <div>{leagueData[rankedIndex].wins} Wins / {leagueData[rankedIndex].losses} Losses</div>
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
                        puuid={puuid} 
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
                            <img src={profile_icon_url(profileIconId)} alt={profileIconId} className='profile-icon' onError={imageError}/>
                            <div className='summoner-name'>{summonerName}</div>
                            <div className='level'>{summonerLevel}</div>
                            <div>This page is for users that want to see the end product without using the API. Summoner names and IDs are changed and/or hidden</div>
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
                            {`Loading matches`}
                        </div>
                    }
                    {!loading && createMatches()}
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default SampleData;