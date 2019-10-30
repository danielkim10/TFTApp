import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Row} from 'reactstrap';
import axios from 'axios';
import Hexagon from 'react-hexagon';
import HexagonGrid from 'react-hexagon-grid';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      team: [],
      synergies: [],
      champions: [],
      classes: [],
      items: [],
      origins: [],
      activeClasses: [],
      activeOrigins: [],
      t1Champs: [],
      t2Champs: [],
      t3Champs: [],
      t4Champs: [],
      t5Champs: [],
    }
    this.clearButton = this.clearButton.bind(this);
    this.fillArrays = this.fillArrays.bind(this);
    this.randomButton = this.randomButton.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/champions/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            champions: response.data.map(champion => champion)
          })
        }
      });
      axios.get('http://localhost:5000/classes/')
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              classes: response.data.map(classe => classe)
            })
          }
        });
        axios.get('http://localhost:5000/items/')
          .then(response => {
            if (response.data.length > 0) {
              this.setState({
                items: response.data.map(item => item)
              })
            }
          });
          axios.get('http://localhost:5000/origins/')
            .then(response => {
              if (response.data.length > 0) {
                this.setState({
                  origins: response.data.map(origin => origin)
                })
              }
            });
  }

  fillArrays() {
    if (this.state.t1Champs.length == 0) {
      let t1Champs = (this.state.champions.filter(champion => champion.cost[0] == 1));
      let t2Champs = (this.state.champions.filter(champion => champion.cost[0] == 2));
      let t3Champs = (this.state.champions.filter(champion => champion.cost[0] == 3));
      let t4Champs = (this.state.champions.filter(champion => champion.cost[0] == 4));
      let t5Champs = (this.state.champions.filter(champion => champion.cost[0] == 5));

      this.setState({t1Champs: t1Champs, t2Champs: t2Champs, t3Champs: t3Champs, t4Champs: t4Champs, t5Champs: t5Champs});
    }
  }

  addToTeam() {

  }

  removeFromTeam() {

  }

  addItem() {

  }

  removeItem() {

  }

  clearButton() {

  }

  randomButton() {
    this.fillArrays();
    const T1_CHAMPS = 4;
    const T2_CHAMPS = 5;
    const T3_CHAMPS = 4;
    const T4_CHAMPS = 3;
    const T5_CHAMPS = 3;
    const MAX_CHAMPS = 9;
    const MAX_3_AND_UNDER = 7; // roll between 5 and 7 low tier
    const MAX_4_AND_UP = 4; // roll between 2 and 4 high tier
    let t5, t4, t3, t2, t1 = 0;

    let lowTierChamps = Math.floor(Math.random() * 3);
    let highTierChamps = Math.floor(Math.random() * 2);

    t5 = Math.floor(Math.random() * T5_CHAMPS);
    highTierChamps -= t5;
    t4 = highTierChamps;

    t3 = Math.floor(Math.random() * T3_CHAMPS);
    lowTierChamps -= t3;
    if (lowTierChamps != 0) {
      t2 = Math.floor(Math.random() * lowTierChamps);
      lowTierChamps -= t2;
      t1 = lowTierChamps;
    }
    else {
      t2 = 0;
      t1 = 0;
    }
    let t5Champs = this.state.t5Champs;
    let t4Champs = this.state.t4Champs;
    let t3Champs = this.state.t3Champs;
    let t2Champs = this.state.t2Champs;
    let t1Champs = this.state.t1Champs;
    for (let i = 0; i < t5; i++) {
      team.push(t5Champs[Math.floor(Math.random() * t5Champs.length)]);
    }
    for (let i = 0; i < t4; i++) {
      team.push(t4Champs[Math.floor(Math.random() * t4Champs.length)]);
    }
    for (let i = 0; i < t3; i++) {
      team.push(t3Champs[Math.floor(Math.random() * t3Champs.length)]);
    }
    for (let i = 0; i < t2; i++) {
      team.push(t2Champs[Math.floor(Math.random() * t2Champs.length)]);
    }
    for (let i = 0; i < t1; i++) {
      team.push(t1Champs[Math.floor(Math.random() * t1Champs.length)]);
    }


    //let t1 = Math.floor(Math.random() * t1Champs);
    //let t2 = Math.floor(Math.random() * t2Champs);
    //let t3 = Math.floor(Math.random() * t3Champs);
    //let t4 = Math.floor(Math.random() * t4Champs);
    //let t5 = Math.floor(Math.random() * t5Champs);



    console.log("button clicked");
  }

  render() {
    const champions = [];
    const classes = [];
    const items = [];
    const origins = [];

    for (let i = 0; i < champions.length; i++) {
      champions.push(this.state.champions[i].name)
    }
    for (let i = 0; i < classes.length; i++) {
      classes.push(this.state.classes[i].name)
    }
    for (let i = 0; i < items.length; i++) {
      items.push(this.state.items[i].name)
    }
    for (let i = 0; i < origins.length; i++) {
      origins.push(this.state.origins[i].name)
    }

      return (
        <div>
        <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <Card name="activeTraits">
            <CardBody>

            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <HexagonGrid gridWidth={700} gridHeight={600}/>
              <Row><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg></Row>
              <Row><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg><svg height="100px" width="100px"><Hexagon flatTop/></svg></Row>
            </CardBody>
          </Card>
          <Card name="pool">
            <CardBody>
            </CardBody>
          </Card>
          </Col>
          <Col sm={2}>

          </Col>
          </Row>
          <Button type="button" color="primary" onClick={this.randomButton}>Random</Button>
        </div>
      )
  }
}
