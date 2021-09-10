import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { host_url, summoner_by_name_url, ranked_league_url, match_list_url } from '../../../helper/urls';
import { errorHandler, checkRateLimit } from '../../../helper/api';

import './match-history.component.css';
import '../../base.css';

const MatchHistory = (props) => {
    const [summonerName, setSummonerName] = useState("");
    const [platform, setPlatform] = useState("na1");
    const [region, setRegion] = useState("americas");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const search = async (e) => {
        let error_int = false;
        setLoading(true);

        let callsObj = { 'platform': platform, platformCount: 2, 'region': region, regionCount: 1 }

        let rateLimitCheck_1 = await Promise.resolve(checkRateLimit(callsObj));
        if (rateLimitCheck_1 < 0) {
            setError(true);
            setLoading(false);
            setErrorMessage("You are being rate limited.");
        }
        else {
            let summonerData = await fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(platform)}${summoner_by_name_url(summonerName)}`, {
                method: 'GET',
                headers: {
                    'Accept-Charset': 'application/json;charset=utf-8',
                    'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                } 
            })
            .then(res => {
                if (!res.ok) {
                    let errorStr = errorHandler(res.status);
                    setError(true);
                    setLoading(false);
                    setErrorMessage(errorStr);
                    error_int = true;
                    setTimeout(() => {
                        setError(false);
                    }, 3000);
                }
                return res.json();
            });

            if (error_int) { return; }

            let leagueData = await fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(platform)}${ranked_league_url(summonerData.id)}`, {
                method: `GET`,
                headers: {
                    'Accept-Charset': 'application/json;charset=utf-8',
                    'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                }
            }).then(res => {
                if (!res.ok) {
                    let errorStr = errorHandler(res.status);
                    setError(true);
                    setLoading(false);
                    setErrorMessage(errorStr);
                    error_int = true;
                    setTimeout(() => {
                        setError(false);
                    }, 3000);
                }
                return res.json();
            });

            if (error_int) { return; }

            let matchListData = await fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(region)}${match_list_url(summonerData.puuid)}`, {
                method: `GET`,
                headers: {
                    'Accept-Charset': 'application/json;charset=utf-8',
                    'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                }
            }).then(res => {
                if (!res.ok) {
                    let errorStr = errorHandler(res.status);
                    setError(true);
                    setLoading(false);
                    setErrorMessage(errorStr);
                    error_int = true;
                    setTimeout(() => {
                        setError(false);
                    }, 3000);
                }
                return res.json();
            });

            if (error_int) { return; }

            let path = `/profile`;
            props.history.push({
                pathname: path, 
                search: `?platform=${platform}&summonerName=${summonerName.replaceAll(' ', '').toLowerCase()}`, 
                state: { 
                    summonerData: summonerData,
                    leagueData: leagueData,
                    matchListData: matchListData,
                    platform: platform,
                    region: region
                }});
        }
    }
        
    const handleName = (event) => {
        setSummonerName(event.target.value);
    }

    const handleRegionSelect = (e) => {
        let regionApi = 'americas';
        if (e.target.value === 'euw1') {
            regionApi = 'europe';
        }
        setPlatform(e.target.value);
        setRegion(regionApi);
    }

    const loadSampleData = (e) => {
        let path = `/sampledata`;
        props.history.push({
            pathname: path,
        });
    }

    return (
        <div className="page-grid">
            <div></div>
            <div>
                <h1 className='title'>Summoner Search</h1>
                {error && <Alert severity="error">{errorMessage}</Alert>}
                <div className='content-grid'>
                <FormControl variant="filled" disabled={loading} className='region-select'>
                    <InputLabel id="platform-select-label">Platform</InputLabel>
                    <Select 
                        labelId="platform-select-label" 
                        id="platform-select"
                        value={platform}
                        onChange={handleRegionSelect}
                    >
                    <MenuItem value="na1">NA</MenuItem>
                    <MenuItem value="euw1">EUW</MenuItem>
                    </Select>
                </FormControl>
                <TextField id="nameSearch" className="summoner-search" placeholder="Summoner Name" variant="outlined" onChange={handleName} disabled={loading}/>
                <Button type="button" className='buttons' onClick={search} disabled={loading}>
                    <span className='button-text'>Search</span>
                </Button>
                </div>
                
                {loading && <CircularProgress className='circular-progress'/>}
            </div>
            <div></div>
            <Button type="button" className='sample-button' onClick={loadSampleData} disabled={loading}>
            <span className='button-text'>Load Sample Data</span>
            </Button>
        </div>
    );
}

export default MatchHistory;
