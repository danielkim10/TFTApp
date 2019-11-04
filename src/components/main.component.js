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
    this.runSimulation = this.runSimulation.bind(this);
    this.createChampion = this.createChampion.bind(this);
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

  runSimulation() {

  }

  randomButton() {
    this.fillArrays();
    this.setState({team: [], synergies: []});
    const T1_CHAMPS = 4;
    const T2_CHAMPS = 5;
    const T3_CHAMPS = 4;
    const T4_CHAMPS = 3;
    const T5_CHAMPS = 3;
    const MAX_CHAMPS = 9;
    const MAX_3_AND_UNDER = 7; // roll between 5 and 7 low tier
    const MAX_4_AND_UP = 4; // roll between 2 and 4 high tier
    const MIN_BASIC_ITEMS = 12;
    const MAX_BASIC_ITEMS = 16;
    let t5, t4, t3, t2, t1 = 0;

    let lowTierChamps = Math.floor(Math.random() * 3);
    let highTierChamps = Math.floor(Math.random() * 2);
    let items = Math.floor(Math.random() * 4);
    items += MIN_BASIC_ITEMS;

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
    let synergies = this.state.synergies;
    let team = [];

    /* PROCESS */
    /*
      1. Determine a random champion
      2. Check team array to see if champion has already been added
      3. Check team array to see if 2 of the same tier champ has already been added
      4. Check team array to ensure that a tier 3 version of the champ doesnt already exist
      5. Check if champ is a dupe. If it is, do not increment origins or classes
      6. Check if origin has already been added
      7. Check if class has already been added
      8. Update synergies display and sort based on level
      9. Randomize number of items for each champion
      10. Randomize items for each champion one by one. If first item is thief's gloves, end
      11. Check if item is restriction on champion (i.e. bork on yasuo)
      12. Check if item is 'globally unique' (i.e. recurve bow)
      13. Check if item is unique (i.e. Guardian Angel)
      14. Add item bonuses to champion stats
      15. Generate title for new team comp (e.g. wild assassins)
      16. Generate string holding all information for user to copy paste
    */

    for (let i = 0; i < t5; i++) {
      let champion = this.createChampion(t5Champs, team);
      team.push(champion);
    }
    for (let i = 0; i < t4; i++) {
      let champion = this.createChampion(t4Champs, team);
      team.push(champion);
    }
    for (let i = 0; i < t3; i++) {
      let champion = this.createChampion(t3Champs, team);
      team.push(champion);
    }
    for (let i = 0; i < t2; i++) {
      let champion = this.createChampion(t2Champs, team);
      team.push(champion);
    }
    for (let i = 0; i < t1; i++) {
      let champion = this.createChampion(t1Champs, team);
      team.push(champion);
    }
  }

  createChampion(champions, team) {
    let passTest = false;
    let champion;
    let tier;
    let items;
    while (!passTest) {
      champion = champions[Math.floor(Math.random() * champions.length)];
      tier = Math.floor(Math.random() * 6); // 0 1 2 = tier 1, 3 4 = tier 2, 5 = tier 3
      if ((team.filter(c => c.champion.name === champion.name && c.tier === tier).length < 2)
        && !team.filter(c => c.champion.name === champion.name && c.tier === 3)) {
        passTest = true;
      }
    }

    let itemCount = Math.floor(Math.random() * 12); // 0-6 = 1 item, 7-9 = 2 items, 10-11 = 3 items
    if (itemCount < 7) itemCount = 1;
    else if (itemCount > 6 && itemCount < 10) itemCount = 2;
    else itemCount = 3;


    let synergies = this.state.synergies;
    for (let j = 0; j < champion.origin.length; j++) {
      for (let k = 0; k < synergies.length; k++) {
        if (synergies[k].name === champion.origin[j]) {
          synergies[k].count++;
          break;
        }
        if (k === synergies.length -1) {
          synergies.push({name: champion.origin[j], count: 1});
        }
      }
    }
    for (let j = 0; j < champion.classe.length; j++) {
      for (let k = 0; k < synergies.length; k++) {
        if (synergies[k].name === champion.classe[j]) {
          synergies[k].count++;
          break;
        }
        if (k === synergies.length -1) {
          synergies.push({name: champion.classe[j], count: 1});
        }
      }
    }

    let remainingSlots = itemCount;
    for (let j = 0; j < itemCount && remainingSlots != 0; j++) {
      let itemTest = true;
      let item;
      do {
        itemTest = true;
        item = this.state.items[Math.floor(Math.random() * this.state.items.length)];
        if (item.key === "thiefsgloves" && j !== 0) {
          itemTest = false;
        }
        else if (item.key === "thiefsgloves" && j == 0) {
            remainingSlots = 0;
        }

        else if (items.filter(i => i.key === item.key).length > 0 && item.unique) {
          itemTest = false;
        }

        else {
          let itemOBonuses = item.bonuses.filter(b => b.name === 'origin');
          //e.x. youmuus does not equip to assassins
          for (let k = 0; k < champion.origin.length; k++) {
              if (champion.origin[k] === item.cannotEquip) {
                itemTest = false;
              }
          }

          let itemCBonuses = item.bonuses.filter(b => b.name === 'class');
          for (let k = 0; k < champion.classe.length; k++) {
            if (champion.classe[k] === item.cannotEquip) {
              itemTest = false;
            }
          }
        }
      } while (!itemTest)
      items.push(item);
    }

    let c = {champion: champion, tier: tier}
    return c;
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
