import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Input, Button} from 'reactstrap';
import { Link } from 'react-router-dom';

class MatchHistory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      summonerName: "",
      region: "",
      gamedata: {},
      matchesId: [],

    }

    this.search = this.search.bind(this);
    this.handleName = this.handleName.bind(this);
    this.generateMatches = this.generateMatches.bind(this);
  }

  componentDidMount() {

  }

  search(e) {
    //e.preventDefault()
    const NA1 = 'https://na1.api.riotgames.com';
    const REGION_AMERICA='https://americas.api.riotgames.com';
    const EUW1 = 'https://euw1.api.riotgames.com';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const summonerUrl = `${NA1}/tft/summoner/v1/summoners/by-name/Shabu%20Shabu?api_key=${process.env.REACT_APP_RIOT_KEY}`;

    let matchesId;
    let data = fetch(proxyUrl+summonerUrl).then
      (res => res.json()).then(res => {
        let puuid = res.puuid;
        let matchesUrl = `${REGION_AMERICA}/tft/match/v1/matches/by-puuid/${puuid}/ids?count=5&api_key=${process.env.REACT_APP_RIOT_KEY}`;
        let matches = fetch(proxyUrl+matchesUrl).then
            (res2 => res2.json()).then(res2 => {
              let match0 = res2[0];
              let matchUrl = `${REGION_AMERICA}/tft/match/v1/matches/${match0}?api_key=${process.env.REACT_APP_RIOT_KEY}`;
              let match = fetch(proxyUrl+matchUrl).then
                (res3 => res3.json()).then(res3 => {console.log(res3)})
            }
        )
      }
    )
    // let data = fetch(proxyUrl + summonerUrl)
    //   .then(res => res.json())
    //   .then(async data => {
    //     const matchesUrl = `${REGION_AMERICA}/tft/match/v1/matches/by-puuid/${data.puuid}/ids?count=20&api_key=${process.env.REACT_APP_RIOT_KEY}`;
    //     let data2 = await fetch(proxyUrl + matchesUrl)
    //       .then(res2 => res2.json())
    //
    //       matchesId = data2;
    //   })
    //this.generate();
  }

  handleName(event) {
    this.setState({summonerName: event.target.value});
  }

//   info:
// game_datetime: 1593024241760
// game_length: 2248.906982421875
// game_variation: "TFT3_GameVariation_None"
// game_version: "Version 10.13.325.7485 (Jun 19 2020/17:19:54) [PUBLIC] <Releases/10.13>"
// participants: Array(8)
// 0:
// companion:
// content_ID: "9f756223-fe56-4ea1-9221-f5011bad94fe"
// skin_ID: 22
// species: "PetGriffin"
// __proto__: Object
// gold_left: 2
// last_round: 40
// level: 7
// placement: 1
// players_eliminated: 3
// puuid: "V1gNL_t3KZS9AfJfQ4ltRwD7lJ8pZbjixSSk79CTHO2uxjb6Z6v9_V-L_AJ2eUCHQ48JbdvCx0AisA"
// time_eliminated: 2240.522705078125
// total_damage_to_players: 160
// traits: Array(6)
// 0:
// name: "Battlecast"
// num_units: 1
// style: 0
// tier_current: 0
// tier_total: 4
// __proto__: Object
// 1:
// name: "Protector"
// num_units: 1
// style: 0
// tier_current: 0
// tier_total: 3
// __proto__: Object
// 2:
// name: "Set3_Mystic"
// num_units: 1
// style: 0
// tier_current: 0
// tier_total: 2
// __proto__: Object
// 3:
// name: "Set3_Sorcerer"
// num_units: 4
// style: 2
// tier_current: 2
// tier_total: 3
// __proto__: Object
// 4:
// name: "StarGuardian"
// num_units: 7
// style: 3
// tier_current: 2
// tier_total: 3
// __proto__: Object
// 5:
// name: "Vanguard"
// num_units: 1
// style: 0
// tier_current: 0
// tier_total: 3
// __proto__: Object
// length: 6
// __proto__: Array(0)
// units: Array(7)
// 0:
// character_id: "TFT3_Poppy"
// items: []
// name: ""
// rarity: 0
// tier: 2
// __proto__: Object
// 1:
// character_id: "TFT3_Zoe"
// items: [67]
// name: ""
// rarity: 0
// tier: 3
// __proto__: Object
// 2:
// character_id: "TFT3_Ahri"
// items: (3) [37, 34, 44]
// name: ""
// rarity: 1
// tier: 3
// __proto__: Object
// 3:
// character_id: "TFT3_Neeko"
// items: (3) [99, 77, 56]
// name: ""
// rarity: 2
// tier: 3
// __proto__: Object
// 4:
// character_id: "TFT3_Syndra"
// items: (3) [2, 39, 14]
// name: ""
// rarity: 2
// tier: 2
// __proto__: Object
// 5:
// character_id: "TFT3_Soraka"
// items: []
// name: ""
// rarity: 3
// tier: 2
// __proto__: Object
// 6:
// character_id: "TFT3_Viktor"
// items: (3) [48, 15, 23]
// name: ""
// rarity: 3
// tier: 2
// __proto__: Object
// length: 7
// __proto__: Array(0)
// __proto__: Object
// 1: {companion: {…}, gold_left: 0, last_round: 40, level: 8, placement: 3, …}
// 2: {companion: {…}, gold_left: 54, last_round: 24, level: 6, placement: 8, …}
// 3: {companion: {…}, gold_left: 8, last_round: 30, level: 7, placement: 6, …}
// 4: {companion: {…}, gold_left: 4, last_round: 34, level: 9, placement: 4, …}
// 5: {companion: {…}, gold_left: 5, last_round: 40, level: 9, placement: 2, …}
// 6: {companion: {…}, gold_left: 30, last_round: 31, level: 8, placement: 5, …}
// 7: {companion: {…}, gold_left: 6, last_round: 27, level: 8, placement: 7, …}
// length: 8
// __proto__: Array(0)
// queue_id: 1090
// tft_set_number: 3
// __proto__: Object
// metadata:
// data_version: "4"
// match_id: "NA1_3472622128"
// participants: Array(8)
// 0: "V1gNL_t3KZS9AfJfQ4ltRwD7lJ8pZbjixSSk79CTHO2uxjb6Z6v9_V-L_AJ2eUCHQ48JbdvCx0AisA"
// 1: "6cD4rbOarQO-zlERBTZk0pGq8UZXV649XHqVjKAUt6VNI_3lWM3Sfg8hYXS4BV-UAT-Qi5JKEoBzmA"
// 2: "DOVFPtCgN0CwG2NQEO5aR3xiatN5kOZvX6plLmi_qSuR3SzwAP9sbpQ9epqNCOxfTUnLd0WvoujdtQ"
// 3: "etIMuyqF2FWEACYzzUSaFv6c_AkT94j2cBDd3pKtZDrw9jOi-YWm3SyouPrJ4O8m09VaZtq2WJ0hNw"
// 4: "0p3xI7yMMCFM6Wb66V8HJkYw5WVyqRV8RxmnVGW1Xg0T0ML8tAzo9KVCl6MUkV_JTTHqdKhINkjP5w"
// 5: "51EPEvBrPqq24i2rjQ7tAxIbYL5vUIUhs3Qz4xv4KsGDCws1qWVe-yWe9jKW3ViHqQgEBIKWCwvpdg"
// 6: "Yr8AtAorW7O2n55ckFSzGqn0XggQACW-j8XrwDmVA7LOKsowoWRT-cnk-PSjuiY35aMWz0g7XMvD7w"
// 7: "OlhSqsujJQx34PIzIxrlfPF18DGaLjKSXDkjIDRch8HJWJIHAPrZLnKRhDRIn8VLLly5V2QEpxt9ug"

  parseSummonerName() {

  }

  generateMatches(id) {
    const REGION_AMERICA='https://americas.api.riotgames.com';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const matchUrl = `${REGION_AMERICA}/tft/match/v1/matches/${id}?api_key=${process.env.REACT_APP_RIOT_KEY}`;
    //let gamedata = this.state.gamedata;
    let data = fetch(proxyUrl + matchUrl)
      .then(res => res.json())

    this.setState({gamedata: data});
    //return(<Card><CardBody>{data.info.participants[i].placement}</CardBody></Card>);
  }

  render() {
    let matches = [];
    // for (let i = 0; i < this.state.matchesId.length; ++i) {
    //   let pathname="/matchhistory/" + this.state.matchesId[i];
    //   matches.push(<div><Button outline color="transparent" onClick={this.generateMatches(this.state.matchesId[i])}>{this.state.matchesId[i]}</Button></div>)
    // }
    // let placement = 0;
    // if (this.state.gamedata.info !== undefined) {
    //   placement = this.state.gamedata.info.participants[0].placement;
    // }

      return (
        <div>
        <Card>
          <CardHeader><strong>Search</strong></CardHeader>
          <CardBody>
            <Input type="text" id="nameSearch" onChange={this.handleName}/>
            <Button type="button" color="primary" onClick={this.search}>Search</Button>
          </CardBody>
        </Card>
        <Row>
          <Col sm={3}>
            <Card>
              <CardBody>
                {matches}
              </CardBody>
            </Card>
          </Col>
          <Col sm={9}>
            <Card>
              <CardBody>
                {/*placement*/}
              </CardBody>
            </Card>
          </Col>
          </Row>
        </div>
      )
  }
}

export default MatchHistory;
