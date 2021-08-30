import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { patch_data_url, host_url, summoner_by_name_url, ranked_league_url, match_list_url } from '../../../api-helper/urls';
import { errorHandler, checkRateLimit } from '../../../api-helper/api';

import './match-history.component.css';

class MatchHistory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      summonerName: "",
      platform: "na1",
      region: "americas",
      gamedata: {},
      matches: [],
      champions: {},
      items: {},
      traits: {},
      setNumber: 5,
      loading: false,
      error: false,
      errorMessage: '',
      apiKey: '',
    }

    this.search = this.search.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleRegionSelect = this.handleRegionSelect.bind(this);
  }

  componentDidMount() {
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

    fetch(patch_data_url()).then(res => res.json()).then(res => {
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
      this.setState({champions: champions_arr, items: items_arr, traits: traits_arr});
    });
  }

  search(e) {
    //e.preventDefault()
    this.setState({loading: true});

    Promise.resolve(checkRateLimit(this.state.platform, 1)).then(rlc1 => {
        if (rlc1 < 0) {
            this.setState({error: true, loading: false, errorMessage: 'You are being rate limited'});
            throw Error('Rate limiting in effect');
        }
        else {
            fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.state.platform)}${summoner_by_name_url(this.state.summonerName)}`, {
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
                    throw Error(errorStr);
                }
                return res.json();
            })
            .then(summonerData => {
                console.log(summonerData);

                Promise.resolve(checkRateLimit(this.state.platform, 1)).then(rlc2 => {
                    if (rlc2 < 0) {
                        this.setState({error: true, loading: false, errorMessage: 'You are being rate limited'});
                        throw Error('Rate limiting in effect');
                    }
                    else {
                        fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.state.platform)}${ranked_league_url(summonerData.id)}`, {
                            method: `GET`,
                            headers: {
                                'Accept-Charset': 'application/json;charset=utf-8',
                                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                            }
                        }).then(res => {
                            if (!res.ok) {
                                let errorStr = errorHandler(res.status);
                                this.setState({error: true, loading: false, errorMessage: errorStr});
                                throw Error(errorStr);
                            }
                            return res.json();
                        }).then(leagueData => {
                            Promise.resolve(checkRateLimit(this.state.region, 1)).then(rlc3 => {
                                if (rlc3 < 0) {
                                    this.setState({error: true, loading: false, errorMessage: 'You are being rate limited'});
                                    throw Error('Rate limiting in effect');
                                }
                                else {
                                    fetch(`${process.env.REACT_APP_CORS_PREFIX_URL}${host_url(this.state.region)}${match_list_url(summonerData.puuid)}`, {
                                        method: `GET`,
                                        headers: {
                                            'Accept-Charset': 'application/json;charset=utf-8',
                                            'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                                        }
                                    }).then(res => {
                                        if (!res.ok) {
                                            let errorStr = errorHandler(res.status);
                                            this.setState({error: true, loading: false, errorMessage: errorStr});
                                            throw Error(errorStr);
                                        }
                                        return res.json();
                                    }).then(matchListData => {
                                        console.log(summonerData);
                                        console.log(leagueData);
                                        console.log(matchListData);
        
                                        let path = `/profile`
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
                                    }).catch((matchListErr) => {
                                        console.error('Match List Error: ' + matchListErr);
                                    });
                                }
                            });
                        })
                        .catch((leagueErr) => {
                            console.error('Ranked League Error: ' + leagueErr);
                        });
                    }
                });
            })
            .catch((summonerErr) => {
                console.error('Summoner Error: ' + summonerErr);
            });
        }
    });
  }

  handleName(event) {
    this.setState({summonerName: event.target.value});
  }

  handleKey(event) {
    this.setState({apiKey: event.target.value});
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

  render() {

    let rank = {
        "leagueId": "83b9dd01-6753-4081-aa66-b4e503ae0e8b",
        "queueType": "RANKED_TFT",
        "tier": "GOLD",
        "rank": "IV",
        "summonerId": "EseeFAsed8-yv9dEOjUvpDYSAiZ_RxQ2G-r3_j6il6TtDIo",
        "summonerName": "Dice Jar",
        "leaguePoints": 39,
        "wins": 3,
        "losses": 23,
        "veteran": false,
        "inactive": false,
        "freshBlood": false,
        "hotStreak": false
    }


    return (
        <table style={{width: '100%'}}>
            <tbody>
                <tr style={{height: '33%'}}><td></td></tr>
                <tr style={{height: '66%'}}>
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
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <h1 className='title'>Summoner Search</h1>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        {this.state.error && <Alert severity="error">{this.state.errorMessage}</Alert>}
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
                                                                <tr>
                                                                    <td>
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
                                                                    </td>
                                                                    <td className='summoner-search'>
                                                                        <TextField id="nameSearch" placeholder="Summoner Name" variant="outlined" onChange={this.handleName} disabled={this.state.loading}/>
                                                                    </td>
                                                                    <td>
                                                                        <Button type="button" className='buttons' onClick={this.search} disabled={this.state.loading}>
                                                                            <span className='button-text'>Search</span>
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td className="summoner-search">
                                                                        <TextField id="api-key" placeholder="API-Key" variant="outlined" onChange={this.handleKey} disabled={this.state.loading} type="password"
                                                                        helperText="To be used while a personal api key is pending"/>
                                                                    </td>
                                                                    <td>
                                                                        <Button type="button" className='buttons' onClick={this.loadSample} disabled={this.state.loading}>
                                                                            <span className='button-text'>Load Sample Data</span>
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        {this.state.loading && <CircularProgress className='circular-progress'/>}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </td>
                    <td className='side-margins'></td>
                </tr>
                <tr style={{height: '16%'}}><td></td></tr>
            </tbody>
        </table>
    )
  }
}

export default MatchHistory;
