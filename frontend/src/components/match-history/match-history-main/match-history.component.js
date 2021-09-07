import React, { Component } from 'react';
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

class MatchHistory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      summonerName: "",
      platform: "na1",
      region: "americas",
      gamedata: {},
      matches: [],
      loading: false,
      error: false,
      errorMessage: '',
      apiKey: '',
    }

    this.search = this.search.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleRegionSelect = this.handleRegionSelect.bind(this);
  }

  componentDidMount = () => {
  }

  search = async (e) => {
    //e.preventDefault()
    this.setState({loading: true});

    let error = false;

    let callsObj = { 'platform': this.state.platform, platformCount: 2, 'region': this.state.region, regionCount: 1 }

    let rateLimitCheck_1 = await Promise.resolve(checkRateLimit(callsObj));
    if (rateLimitCheck_1 < 0) {
        this.setState({error: true, loading: false, errorMessage: 'You are being rate limited'});
    }
    else {
        let summonerData = await fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.state.platform)}${summoner_by_name_url(this.state.summonerName)}`, {
            method: 'GET',
            headers: {
                'Accept-Charset': 'application/json;charset=utf-8',
                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
            } 
        })
        .then(res => {
            if (!res.ok) {
                let errorStr = errorHandler(res.status);
                this.setState({error: true, loading: false, errorMessage: errorStr});
                error = true;
                setTimeout(() => {
                    this.setState({error: false});
                }, 3000);
            }
            return res.json();
        });

        if (error) { return; }

        let leagueData = await fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.state.platform)}${ranked_league_url(summonerData.id)}`, {
            method: `GET`,
            headers: {
                'Accept-Charset': 'application/json;charset=utf-8',
                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
            }
        }).then(res => {
            if (!res.ok) {
                let errorStr = errorHandler(res.status);
                this.setState({error: true, loading: false, errorMessage: errorStr});
                error = true;
                setTimeout(() => {
                    this.setState({error: false});
                }, 3000);
            }
            return res.json();
        });

        if (error) { return; }

        let matchListData = await fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.state.region)}${match_list_url(summonerData.puuid)}`, {
            method: `GET`,
            headers: {
                'Accept-Charset': 'application/json;charset=utf-8',
                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
            }
        }).then(res => {
            if (!res.ok) {
                let errorStr = errorHandler(res.status);
                this.setState({error: true, loading: false, errorMessage: errorStr});
                error = true;
                setTimeout(() => {
                    this.setState({error: false});
                }, 3000);
            }
            return res.json();
        });

        if (error) { return; }
        

        let path = `/profile`;
        this.props.history.push({
            pathname: path, 
            search: `?platform=${this.state.platform}&summonerName=${this.state.summonerName.replaceAll(' ', '').toLowerCase()}`, 
            state: { 
                summonerData: summonerData,
                leagueData: leagueData,
                matchListData: matchListData,
                platform: this.state.platform,
                region: this.state.region
            }});
    }
  }
  
  handleName = (event) => {
    this.setState({summonerName: event.target.value});
  }

  parseDataVersion = (dataVersion, patch) => {
    let dataVersionCut = dataVersion.substring(dataVersion.indexOf(' ' + 1));
    dataVersionCut = dataVersionCut.substring(1, dataVersion.indexOf(' ') - 1);
    return dataVersionCut;
  }

  handleRegionSelect = (e) => {
    let regionApi = 'americas';
    if (e.target.value === 'euw1') {
        regionApi = 'europe';
    }

    this.setState({platform: e.target.value, region: regionApi});
  }

  loadSampleData = (e) => {
    let path = `/sampledata`;
      this.props.history.push({
        pathname: path,
      });
  }

  render = () => {
    require('./match-history.component.css');
    require('../../base.css');

    return (
        <div className="page-grid">
            <div></div>
            <div>
                <h1 className='title'>Summoner Search</h1>
                {this.state.error && <Alert severity="error">{this.state.errorMessage}</Alert>}
                <div className='content-grid'>
                <FormControl variant="filled" disabled={this.state.loading} className='region-select'>
                    <InputLabel id="platform-select-label">Platform</InputLabel>
                    <Select 
                        labelId="platform-select-label" 
                        id="platform-select"
                        value={this.state.platform}
                        onChange={this.handleRegionSelect}
                    >
                    <MenuItem value="na1">NA</MenuItem>
                    <MenuItem value="euw1">EUW</MenuItem>
                    </Select>
                </FormControl>
                <TextField id="nameSearch" className="summoner-search" placeholder="Summoner Name" variant="outlined" onChange={this.handleName} disabled={this.state.loading}/>
                <Button type="button" className='buttons' onClick={this.search} disabled={this.state.loading}>
                    <span className='button-text'>Search</span>
                </Button>
                </div>
                
                {this.state.loading && <CircularProgress className='circular-progress'/>}
            </div>
            <div></div>
            <Button type="button" className='sample-button' onClick={this.loadSampleData} disabled={this.state.loading}>
            <span className='button-text'>Load Sample Data</span>
            </Button>
        </div>
        
    );
  }
}

export default MatchHistory;
