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
    const summonerUrl = `${NA1}/tft/summoner/v1/summoners/by-name/${this.state.summonerName}?api_key=${process.env.REACT_APP_RIOT_KEY}`;
    let matchesId;
    let data = fetch(proxyUrl + summonerUrl)
      .then(res => res.json())
      .then(async data => {
        const matchesUrl = `${REGION_AMERICA}/tft/match/v1/matches/by-puuid/${data.puuid}/ids?count=20&api_key=${process.env.REACT_APP_RIOT_KEY}`;
        let data2 = await fetch(proxyUrl + matchesUrl)
          .then(res2 => res2.json())

          matchesId = data2;
      })
    //this.generate();
  }

  handleName(event) {
    this.setState({summonerName: event.target.value});
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
    for (let i = 0; i < this.state.matchesId.length; ++i) {
      let pathname="/matchhistory/" + this.state.matchesId[i];
      matches.push(<div><Button outline color="transparent" onClick={this.generateMatches(this.state.matchesId[i])}>{this.state.matchesId[i]}</Button></div>)
    }
    let placement = 0;
    if (this.state.gamedata.info !== undefined) {
      placement = this.state.gamedata.info.participants[0].placement;
    }

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
                {placement}
              </CardBody>
            </Card>
          </Col>
          </Row>
        </div>
      )
  }
}

export default MatchHistory;
