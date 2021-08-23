import React, { Component } from 'react';
import { Input, Button} from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import MatchBasic from './match-basic.component.js';

class MatchHistory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      summonerName: "",
      platform: "https://na1.api.riotgames.com",
      region: "https://americas.api.riotgames.com",
      gamedata: {},
      matches: [],
      champions: {},
      items: {},
      traits: {},
      setNumber: 5,
      loading: false,
    }

    this.search = this.search.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleRegionSelect = this.handleRegionSelect.bind(this);
  }

  compare(a, b) {
    const idA = a.id;
    const idB = b.id;

    let comparison = 0;
    if (idA > idB) {
      comparison = 1;
    }
    else if (idA < idB) {
      comparison = -1;
    }
    return comparison;
  }

  componentDidMount() {
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
      this.setState({champions: champions_arr, items: items_arr, traits: traits_arr});
    });
  }

  search(e) {
    console.log('test');
    //e.preventDefault()
    const proxyUrl = 'https://infinite-anchorage-43166.herokuapp.com/';
    const summonerUrl = '/tft/summoner/v1/summoners/by-name/';
    const matchListUrl = '/tft/match/v1/matches/by-puuid/{puuid}/ids';
    const matchUrl = '/tft/match/v1/matches/{matchId}'
    const leagueUrl = '/tft/league/v1/entries/by-summoner/';

    //const americas = 'https://americas.api.riotgames.com/

    this.setState({loading: true});

    fetch(`${proxyUrl}${this.state.platform}${summonerUrl}${this.state.summonerName}`, {
        method: 'GET',
        headers: {
            'Accept-Charset': 'application/json;charset=utf-8',
            'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
        }
        
    })
    .then(res => res.json())
    .then(summonerData => {
        fetch(`${proxyUrl}${this.state.platform}${leagueUrl}${summonerData.id}`, {
            method: `GET`,
            headers: {
                'Accept-Charset': 'application/json;charset=utf-8',
                'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
            }
        }).then(res => res.json()).then(leagueData => {
            
            fetch(`${proxyUrl}${this.state.region}/tft/match/v1/matches/by-puuid/${summonerData.puuid}/ids`, {
                method: `GET`,
                headers: {
                    'Accept-Charset': 'application/json;charset=utf-8',
                    'X-Riot-Token': `${process.env.REACT_APP_RIOT_KEY}`
                }
            }).then(res => res.json()).then(matchListData => {
                console.log(summonerData);
                console.log(leagueData);
                console.log(matchListData);

                let platform = 'na';
                if (this.state.platform === 'https://euw1.api.riotgames.com') {
                    platform = 'euw';
                }

                let path = `/profile`
                this.props.history.push({
                        pathname: path, 
                        search: `?platform=${platform}&summonerName=${this.state.summonerName.replaceAll(' ', '').toLowerCase()}`, 
                        state: { 
                            summonerData: summonerData,
                            leagueData: leagueData,
                            matchListData: matchListData
                        }});
            }).catch((matchListErr) => {
                console.error('Match List Error: ' + matchListErr);
            });
            this.setState({loading: false, champions: {}});
        })
        .catch((leagueErr) => {
            console.error('Ranked League Error: ' + leagueErr);
        });
    })
    .catch((summonerErr) => {
        console.error('Summoner Error: ' + summonerErr);
    });
  }

  handleName(event) {
    this.setState({summonerName: event.target.value});
  }

  parseDataVersion = (dataVersion, patch) => {
    let dataVersionCut = dataVersion.substring(dataVersion.indexOf(' ' + 1));
    dataVersionCut = dataVersionCut.substring(1, dataVersion.indexOf(' ') - 1);
    return dataVersionCut;
  }

  /*
}*/

  parseSummonerName = () => {
    this.setState({ summonerName: this.state.summonerName.replace(" ", "")});
  }

  handleRegionSelect = (e) => {
    let regionApi = 'https://americas.api.riotgames.com/';
    if (e.target.value === 'https://euw1.api.riotgames.com') {
        regionApi = 'https://europe.api.riotgames.com/';
    }

    this.setState({platform: e.target.value, region: regionApi});
  }

  render() {
    let match = {
      "metadata": {
          "data_version": "5",
          "match_id": "NA1_4007803344",
          "participants": [
              "Vj2ExefWNq7EjOsb9nmMLPllK_8kpn4wK0TFCJ7ip7ita80AvGPNzWizIAWKAilrPMg5hrSpmknasg",
              "rykAnh3Tlfh7ggK0Hk3wlC6SfcqleuFZFIjQw-XBNBjKSM6KpDlSGTx3Hu9LFvrfmb_aIFc9Hm1gNw",
              "H84eTCnDYz8TkbekLgbUwx0MZAMZuUrJKqxSDev0xHQnqmu3BJ2pPg5UUeWJOV2JXsx5RFaaOZDqdA",
              "LJIChuMXjEeDx0cXeE0Hnp3DYgWkWCxJcwAEvFEjaprn2O9Q0UVlQm8pGCoQjW7O3uE20Cn6JBhhhA",
              "Q5rIuNWTwjrjR_Kivxxf8mZpKaX2A1pGb3W0n9pGl-GWiEJTIeIJvka0pLq7aSqJQBvd9eJJv9SRQQ",
              "87jpfnQlyO71dIA_Qzt_eprdxK4w2i8cFbvV6GiAx6qoQkuxTOe-0goB6RC3a2aHF4EjQE9cQjxOtg",
              "M8l2TY1Y8U38n9Z_bOWyWsu3MXYPnVnJsSaQ9Hl2wZhiD41wTyVlduodK9iRQB12uImtdVBDSg-MRw",
              "hrEb6SwqMkJxQnv26L_H6khdnITbcbTqHRHX6_q4zUTTpZZXe2dMV9BfJaWibWtwYZK4Bs7LGIBoyw"
          ]
      },
      "info": {
          "game_datetime": 1628698002954,
          "game_length": 2074.182373046875,
          "game_version": "Version 11.16.390.1945 (Jul 30 2021/15:25:18) [PUBLIC] ",
          "participants": [
              {
                  "companion": {
                      "content_ID": "1cf9a40e-97aa-43d5-bee6-2e2975b5f3f2",
                      "skin_ID": 35,
                      "species": "PetPenguKnight"
                  },
                  "gold_left": 16,
                  "last_round": 33,
                  "level": 8,
                  "placement": 3,
                  "players_eliminated": 1,
                  "puuid": "Vj2ExefWNq7EjOsb9nmMLPllK_8kpn4wK0TFCJ7ip7ita80AvGPNzWizIAWKAilrPMg5hrSpmknasg",
                  "time_eliminated": 1838.35791015625,
                  "total_damage_to_players": 112,
                  "traits": [
                      {
                          "name": "Set5_Assassin",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Brawler",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Draconic",
                          "num_units": 5,
                          "style": 3,
                          "tier_current": 2,
                          "tier_total": 2
                      },
                      {
                          "name": "Set5_Forgotten",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Knight",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Nightbringer",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Ranger",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Renewer",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Sentinel",
                          "num_units": 2,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Skirmisher",
                          "num_units": 3,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Spellweaver",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      }
                  ],
                  "units": [
                      {
                          "character_id": "TFT5_Udyr",
                          "items": [],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Sett",
                          "items": [],
                          "name": "",
                          "rarity": 1,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_Rakan",
                          "items": [
                              1196,
                              44
                          ],
                          "name": "",
                          "rarity": 2,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Ashe",
                          "items": [],
                          "name": "",
                          "rarity": 2,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Zyra",
                          "items": [],
                          "name": "",
                          "rarity": 2,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Galio",
                          "items": [
                              2036,
                              55,
                              57
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Aphelios",
                          "items": [
                              23,
                              23,
                              18
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Viego",
                          "items": [
                              79,
                              47,
                              23
                          ],
                          "name": "",
                          "rarity": 4,
                          "tier": 2
                      }
                  ]
              },
              {
                  "companion": {
                      "content_ID": "00a9860c-3bd5-41db-9926-f78c796a700d",
                      "skin_ID": 19,
                      "species": "PetMiniGolem"
                  },
                  "gold_left": 1,
                  "last_round": 31,
                  "level": 7,
                  "placement": 5,
                  "players_eliminated": 1,
                  "puuid": "rykAnh3Tlfh7ggK0Hk3wlC6SfcqleuFZFIjQw-XBNBjKSM6KpDlSGTx3Hu9LFvrfmb_aIFc9Hm1gNw",
                  "time_eliminated": 1740.939208984375,
                  "total_damage_to_players": 99,
                  "traits": [
                      {
                          "name": "Set5_Assassin",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Brawler",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Cannoneer",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Cavalier",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Draconic",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 2
                      },
                      {
                          "name": "Set5_Legionnaire",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Nightbringer",
                          "num_units": 4,
                          "style": 2,
                          "tier_current": 2,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Ranger",
                          "num_units": 4,
                          "style": 3,
                          "tier_current": 2,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Redeemed",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Revenant",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Sentinel",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      }
                  ],
                  "units": [
                      {
                          "character_id": "TFT5_Varus",
                          "items": [],
                          "name": "",
                          "rarity": 1,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Sejuani",
                          "items": [],
                          "name": "",
                          "rarity": 1,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Ashe",
                          "items": [
                              44,
                              2017,
                              23
                          ],
                          "name": "",
                          "rarity": 2,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_Yasuo",
                          "items": [],
                          "name": "",
                          "rarity": 2,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Lucian",
                          "items": [
                              1190,
                              23
                          ],
                          "name": "Lucian",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Diana",
                          "items": [
                              67
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Aphelios",
                          "items": [
                              34,
                              11
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Volibear",
                          "items": [
                              88,
                              89
                          ],
                          "name": "",
                          "rarity": 4,
                          "tier": 1
                      }
                  ]
              },
              {
                  "companion": {
                      "content_ID": "9c9f4ea3-da30-4478-b299-f75bb1876b46",
                      "skin_ID": 10,
                      "species": "PetDSSwordGuy"
                  },
                  "gold_left": 36,
                  "last_round": 30,
                  "level": 7,
                  "placement": 6,
                  "players_eliminated": 0,
                  "puuid": "H84eTCnDYz8TkbekLgbUwx0MZAMZuUrJKqxSDev0xHQnqmu3BJ2pPg5UUeWJOV2JXsx5RFaaOZDqdA",
                  "time_eliminated": 1678.9759521484375,
                  "total_damage_to_players": 69,
                  "traits": [
                      {
                          "name": "Set5_Abomination",
                          "num_units": 4,
                          "style": 3,
                          "tier_current": 2,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Dawnbringer",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Forgotten",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Legionnaire",
                          "num_units": 6,
                          "style": 3,
                          "tier_current": 3,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Mystic",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Nightbringer",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Redeemed",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Revenant",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Sentinel",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Skirmisher",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      }
                  ],
                  "units": [
                      {
                          "character_id": "TFT5_Aatrox",
                          "items": [
                              1189
                          ],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Kalista",
                          "items": [],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Irelia",
                          "items": [
                              57,
                              1189
                          ],
                          "name": "",
                          "rarity": 1,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_Riven",
                          "items": [
                              69,
                              2026,
                              16
                          ],
                          "name": "",
                          "rarity": 2,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Yasuo",
                          "items": [],
                          "name": "",
                          "rarity": 2,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Fiddlesticks",
                          "items": [],
                          "name": "",
                          "rarity": 3,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Draven",
                          "items": [
                              23,
                              19
                          ],
                          "name": "Draven",
                          "rarity": 3,
                          "tier": 2
                      }
                  ]
              },
              {
                  "companion": {
                      "content_ID": "f05a362e-9bc9-4279-94a1-7491533ba05a",
                      "skin_ID": 7,
                      "species": "PetDSSquid"
                  },
                  "gold_left": 2,
                  "last_round": 17,
                  "level": 7,
                  "placement": 8,
                  "players_eliminated": 0,
                  "puuid": "LJIChuMXjEeDx0cXeE0Hnp3DYgWkWCxJcwAEvFEjaprn2O9Q0UVlQm8pGCoQjW7O3uE20Cn6JBhhhA",
                  "time_eliminated": 935.37548828125,
                  "total_damage_to_players": 44,
                  "traits": [
                      {
                          "name": "Set5_Abomination",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Assassin",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Brawler",
                          "num_units": 4,
                          "style": 3,
                          "tier_current": 2,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Cavalier",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Dawnbringer",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Draconic",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 2
                      },
                      {
                          "name": "Set5_Nightbringer",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Renewer",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Sentinel",
                          "num_units": 2,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      }
                  ],
                  "units": [
                      {
                          "character_id": "TFT5_Vladimir",
                          "items": [
                              99,
                              9,
                              34
                          ],
                          "name": "Vladimir",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Gragas",
                          "items": [],
                          "name": "",
                          "rarity": 0,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Pyke",
                          "items": [],
                          "name": "",
                          "rarity": 1,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Sejuani",
                          "items": [],
                          "name": "",
                          "rarity": 1,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Sett",
                          "items": [],
                          "name": "",
                          "rarity": 1,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Rakan",
                          "items": [
                              34,
                              14,
                              2056
                          ],
                          "name": "",
                          "rarity": 2,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Nunu",
                          "items": [],
                          "name": "",
                          "rarity": 2,
                          "tier": 1
                      }
                  ]
              },
              {
                  "companion": {
                      "content_ID": "f2bcbea8-52f0-41c3-ba1d-e3ad66f73f82",
                      "skin_ID": 16,
                      "species": "PetQiyanaDog"
                  },
                  "gold_left": 0,
                  "last_round": 30,
                  "level": 7,
                  "placement": 7,
                  "players_eliminated": 0,
                  "puuid": "Q5rIuNWTwjrjR_Kivxxf8mZpKaX2A1pGb3W0n9pGl-GWiEJTIeIJvka0pLq7aSqJQBvd9eJJv9SRQQ",
                  "time_eliminated": 1682.6265869140625,
                  "total_damage_to_players": 47,
                  "traits": [
                      {
                          "name": "Set5_Cannoneer",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Cavalier",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Draconic",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 2
                      },
                      {
                          "name": "Set5_Ironclad",
                          "num_units": 4,
                          "style": 4,
                          "tier_current": 3,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Knight",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Legionnaire",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Redeemed",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Sentinel",
                          "num_units": 6,
                          "style": 3,
                          "tier_current": 2,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Skirmisher",
                          "num_units": 3,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      }
                  ],
                  "units": [
                      {
                          "character_id": "TFT5_Senna",
                          "items": [],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Olaf",
                          "items": [
                              58
                          ],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Irelia",
                          "items": [
                              58
                          ],
                          "name": "",
                          "rarity": 1,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Jax",
                          "items": [
                              26
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Lucian",
                          "items": [
                              12,
                              11,
                              49
                          ],
                          "name": "Lucian",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Rell",
                          "items": [
                              1194
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Galio",
                          "items": [
                              55,
                              2077,
                              79
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 2
                      }
                  ]
              },
              {
                  "companion": {
                      "content_ID": "56154b6c-7d47-4d09-b166-e66cac15cac0",
                      "skin_ID": 36,
                      "species": "PetPenguKnight"
                  },
                  "gold_left": 1,
                  "last_round": 37,
                  "level": 8,
                  "placement": 2,
                  "players_eliminated": 1,
                  "puuid": "87jpfnQlyO71dIA_Qzt_eprdxK4w2i8cFbvV6GiAx6qoQkuxTOe-0goB6RC3a2aHF4EjQE9cQjxOtg",
                  "time_eliminated": 2057.904296875,
                  "total_damage_to_players": 128,
                  "traits": [
                      {
                          "name": "Set5_Assassin",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Brawler",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Dawnbringer",
                          "num_units": 8,
                          "style": 4,
                          "tier_current": 4,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Invoker",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 2
                      },
                      {
                          "name": "Set5_Knight",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Legionnaire",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Renewer",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Revenant",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Skirmisher",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Victorious",
                          "num_units": 1,
                          "style": 3,
                          "tier_current": 1,
                          "tier_total": 1
                      }
                  ],
                  "units": [
                      {
                          "character_id": "TFT5_Khazix",
                          "items": [],
                          "name": "Khazix",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Gragas",
                          "items": [],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Soraka",
                          "items": [
                              37,
                              24
                          ],
                          "name": "Soraka",
                          "rarity": 1,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Riven",
                          "items": [
                              99,
                              77,
                              36
                          ],
                          "name": "",
                          "rarity": 2,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_Nidalee",
                          "items": [
                              2023,
                              67,
                              49
                          ],
                          "name": "Nidalee",
                          "rarity": 2,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_Karma",
                          "items": [
                              12,
                              19,
                              23
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Ivern",
                          "items": [
                              78
                          ],
                          "name": "Ivern",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Garen",
                          "items": [
                              28,
                              13
                          ],
                          "name": "",
                          "rarity": 4,
                          "tier": 1
                      }
                  ]
              },
              {
                  "companion": {
                      "content_ID": "2e24117d-eb2f-4eb7-875b-660c7ca682a3",
                      "skin_ID": 37,
                      "species": "PetPenguKnight"
                  },
                  "gold_left": 1,
                  "last_round": 33,
                  "level": 8,
                  "placement": 4,
                  "players_eliminated": 1,
                  "puuid": "M8l2TY1Y8U38n9Z_bOWyWsu3MXYPnVnJsSaQ9Hl2wZhiD41wTyVlduodK9iRQB12uImtdVBDSg-MRw",
                  "time_eliminated": 1840.0537109375,
                  "total_damage_to_players": 76,
                  "traits": [
                      {
                          "name": "Set5_Abomination",
                          "num_units": 3,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Assassin",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Brawler",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Cavalier",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Forgotten",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Ironclad",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Legionnaire",
                          "num_units": 4,
                          "style": 2,
                          "tier_current": 2,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Mystic",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Nightbringer",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Redeemed",
                          "num_units": 3,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Revenant",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Skirmisher",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      }
                  ],
                  "units": [
                      {
                          "character_id": "TFT5_Aatrox",
                          "items": [
                              46
                          ],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Kalista",
                          "items": [
                              25
                          ],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Sejuani",
                          "items": [],
                          "name": "",
                          "rarity": 1,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Nunu",
                          "items": [
                              2055
                          ],
                          "name": "",
                          "rarity": 2,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Rell",
                          "items": [],
                          "name": "",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Fiddlesticks",
                          "items": [
                              15
                          ],
                          "name": "",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Viego",
                          "items": [
                              14,
                              24,
                              28
                          ],
                          "name": "",
                          "rarity": 4,
                          "tier": 1
                      },
                      {
                          "character_id": "TFT5_Kayle",
                          "items": [
                              19,
                              16,
                              26
                          ],
                          "name": "",
                          "rarity": 4,
                          "tier": 1
                      }
                  ]
              },
              {
                  "companion": {
                      "content_ID": "df39e72b-c7b2-44d6-b33a-04a8d8c20414",
                      "skin_ID": 18,
                      "species": "PetUmbra"
                  },
                  "gold_left": 0,
                  "last_round": 37,
                  "level": 8,
                  "placement": 1,
                  "players_eliminated": 3,
                  "puuid": "hrEb6SwqMkJxQnv26L_H6khdnITbcbTqHRHX6_q4zUTTpZZXe2dMV9BfJaWibWtwYZK4Bs7LGIBoyw",
                  "time_eliminated": 2062.3408203125,
                  "total_damage_to_players": 159,
                  "traits": [
                      {
                          "name": "Set5_Cannoneer",
                          "num_units": 4,
                          "style": 3,
                          "tier_current": 2,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Draconic",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 2
                      },
                      {
                          "name": "Set5_Forgotten",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Hellion",
                          "num_units": 5,
                          "style": 2,
                          "tier_current": 2,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Inanimate",
                          "num_units": 1,
                          "style": 3,
                          "tier_current": 1,
                          "tier_total": 1
                      },
                      {
                          "name": "Set5_Knight",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Mystic",
                          "num_units": 2,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 4
                      },
                      {
                          "name": "Set5_Sentinel",
                          "num_units": 4,
                          "style": 1,
                          "tier_current": 1,
                          "tier_total": 3
                      },
                      {
                          "name": "Set5_Skirmisher",
                          "num_units": 1,
                          "style": 0,
                          "tier_current": 0,
                          "tier_total": 3
                      }
                  ],
                  "units": [
                      {
                          "character_id": "TFT5_Poppy",
                          "items": [],
                          "name": "",
                          "rarity": 0,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_Senna",
                          "items": [],
                          "name": "",
                          "rarity": 0,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Kennen",
                          "items": [
                              1194,
                              37,
                              15
                          ],
                          "name": "",
                          "rarity": 1,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_Tristana",
                          "items": [
                              16,
                              2026,
                              29
                          ],
                          "name": "",
                          "rarity": 1,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_Lulu",
                          "items": [
                              79,
                              34,
                              37
                          ],
                          "name": "",
                          "rarity": 2,
                          "tier": 3
                      },
                      {
                          "character_id": "TFT5_MissFortune",
                          "items": [],
                          "name": "",
                          "rarity": 2,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Lucian",
                          "items": [
                              1128,
                              1
                          ],
                          "name": "Lucian",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Galio",
                          "items": [],
                          "name": "",
                          "rarity": 3,
                          "tier": 2
                      },
                      {
                          "character_id": "TFT5_Gwen",
                          "items": [],
                          "name": "",
                          "rarity": 4,
                          "tier": 1
                      }
                  ]
              }
          ],
          "queue_id": 1100,
          "tft_game_type": "standard",
          "tft_set_number": 5
      }
    }

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
                <tr>
                    <td style={{width: '16%'}}>asdfadsf</td>
                    <td style={{width: '66%'}}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><strong>Search</strong></td>
                                </tr>
                                <tr>
                                    <td>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <FormControl variant="filled" disabled={this.state.loading}>
                                                            <InputLabel id="platform-select-label">Platform</InputLabel>
                                                            <Select 
                                                                labelId="platform-select-label" 
                                                                id="platform-select"
                                                                value={this.state.platform}
                                                                onChange={this.handleRegionSelect}
                                                            >
                                                                <MenuItem value="https://na1.api.riotgames.com">NA</MenuItem>
                                                                <MenuItem value="https://euw1.api.riotgames.com">EU</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </td>
                                                    <td><Input type="text" id="nameSearch" onChange={this.handleName} disabled={this.state.loading}/></td>
                                                    <td><Button type="button" color="primary" onClick={this.search} disabled={this.state.loading}>Search</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        {this.state.loading && <CircularProgress size={24}/>}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </td>
                    <td style={{width: '16%'}}>adsfasdf</td>
                </tr>
            </tbody>
        </table>
    )
  }
}

export default MatchHistory;
