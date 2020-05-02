import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Col, Row, Input, Popover, PopoverHeader, PopoverBody, Tooltip } from 'reactstrap';
import axios from 'axios';
//import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import './hexgrid.css'
import GameArena from './gamearena.component.js'
import { getData, postData } from '../api-helper/api.js'
import Image from 'react-image-resizer';
import '../css/colors.css';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      team: {},
      synergies: {},
      champions: [],
      classes: [],
      items: [],
      origins: [],
      activeClasses: [],
      activeOrigins: [],
      boardData: [],
      championDataOpen: false,
      searchNameChamps: "",
      searchNameItems: "",
    }
    this.clearButton = this.clearButton.bind(this);
    this.randomButton = this.randomButton.bind(this);
    this.findSynergies = this.findSynergies.bind(this);
    this.runSimulation = this.runSimulation.bind(this);
    this.createChampion = this.createChampion.bind(this);
    this.clearTeam = this.clearTeam.bind(this);
    this.handleSearchChamps = this.handleSearchChamps.bind(this);
    this.handleSearchItems = this.handleSearchItems.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    getData('champions').then(data => {
      this.setState({champions: data.filter(champion => champion.set === 1)});
    });
    getData('classes').then(data => {
      this.setState({classes: data.filter(classe => classe.set === 1)});
    });
    getData('items').then(data => {
      this.setState({items: data.filter(item => item.set === 1)});
    });
    getData('origins').then(data => {
      this.setState({origins: data.filter(origin => origin.set === 1)});
    });
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

  compareSynergy(a, b) {
    const idA = a.synergy1.tier;
    const idB = b.synergy1.tier;

    let comparison = 0;
    if (idA < idB) {
      comparison = 1;
    }
    else if (idA > idB) {
      comparison = -1;
    }
    return comparison;
  }

  addToTeam(data) {

    let team = this.state.team;
    let boardData = this.state.boardData;
    let isDupe = false;
    if (team[data.name] === data.name) {
        isDupe = true;
    }
    team[data.name] = {champion: data, tier: 1, items: [], remainingSlots: 6, isDupe: isDupe}
    //team.push({champion: data, tier: 1, items: [], remainingSlots: 6, isDupe: isDupe});
    boardData.push(data);
    this.setState({team: team});
    this.findSynergies(this.state.team);
  }

  removeFromTeam() {

  }

  clearTeam() {
    this.setState({team: {}, synergies: {}});
  }

  addItem(data) {

  }

  removeItem() {

  }

  clearButton() {
    this.clearTeam();
  }

  runSimulation() {

  }

  randomButton(e) {
    e.preventDefault();
    this.clearTeam();
    const T3_CHAMPS = 4;
    const T5_CHAMPS = 3;
    const MAX_CHAMPS = 8;
    const MIN_BASIC_ITEMS = 12;
    let t5, t4, t3, t2, t1 = 0;

    let lowTierChamps = Math.floor(Math.random() * 2);
    if (lowTierChamps === 0) lowTierChamps = 5;
    else lowTierChamps = 6;
    let highTierChamps = MAX_CHAMPS - lowTierChamps;
    let teamItems = Math.floor(Math.random() * 2);
    teamItems += MIN_BASIC_ITEMS;

    t5 = Math.floor(Math.random() * T5_CHAMPS);
    highTierChamps -= t5;
    t4 = highTierChamps;

    t3 = Math.floor(Math.random() * T3_CHAMPS);
    lowTierChamps -= t3;
    if (lowTierChamps !== 0) {
      t2 = Math.floor(Math.random() * lowTierChamps);
      lowTierChamps -= t2;
      t1 = lowTierChamps;
    }

    let t5Champs = this.state.champions.filter(champion => champion.tier === 5);
    let t4Champs = this.state.champions.filter(champion => champion.tier === 4);
    let t3Champs = this.state.champions.filter(champion => champion.tier === 3);
    let t2Champs = this.state.champions.filter(champion => champion.tier === 2);
    let t1Champs = this.state.champions.filter(champion => champion.tier === 1);
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
    team = this.randomizeItems(team, teamItems);
    this.findSynergies(team);
    this.setState({team: team}); // temporary
  }

  createChampion(champions, team) {
    let passTest = false;
    let champion = {};
    let tier = 0;
    let isDupe = false;
    while (!passTest) {
      champion = champions[Math.floor(Math.random() * champions.length)];
      tier = Math.floor(Math.random() * 6); // 0 1 2 = tier 1, 3 4 = tier 2, 5 = tier 3
      if (tier < 3) {
        tier = 1;
      }
      else if (tier < 5) {
        tier = 2;
      }
      else {
        tier = 3;
      }
      if ((team.filter(c => c.champion.name === champion.name && c.tier === tier).length < 2)
        && !((team.filter(c => c.champion.name === champion.name).length < 1 && tier === 3))) {
        passTest = true;
      }
      else if (team.filter(c => c.champion.name === champion.name).length > 0) {
        passTest = true;
        isDupe = true;
      }
    }
    let c = {champion: champion, tier: tier, items: [], remainingSlots: 6, isdupe: isDupe};
    return c;
  }

  randomizeItems(team, teamItems) {
    let teamMember;
    let items;
    while (teamItems > 0) {
      teamMember = {};
      items = [];
      let itemCount = Math.floor(Math.random() * 12); // 0-6 = 1 item, 7-9 = 2 items, 10-11 = 3 items

      if (itemCount >= 10 && teamItems >= 6) itemCount = 3;
      else if ((itemCount >= 7 && itemCount <= 9) || (itemCount >= 10 && teamItems <= 4)) itemCount = 2
      else if ((itemCount <= 6) || (itemCount >= 7 && teamItems <= 2)) itemCount = 1;
      else itemCount = 1;

      let champTest = true;
      do {
        champTest = true;
        teamMember = team[Math.floor(Math.random() * team.length)];
        if (teamMember.remainingSlots === 0 || teamMember.remainingSlots < itemCount*2) {
          champTest = false;
        }
      } while (champTest === false);

      for (let j = 0; j < itemCount && teamMember.remainingSlots > 0; j++) {
        let itemTest = true;
        let item = {};
        do {
          itemTest = true;
          item = this.state.items[Math.floor(Math.random() * this.state.items.length)];
          if (item.key === "thiefsgloves" && j !== 0) {
            itemTest = false;
          }

          else if (items.filter(i => i.key === item.key).length > 0 && item.unique) {
            itemTest = false;
          }

          else if (item.depth > teamItems) {
            item = this.state.items.filter(item => item.depth === 1)[Math.floor(Math.random()*this.state.items.filter(item => item.depth === 1).length)];
          }

          else if (teamMember.remainingSlots % 2 === 1 && item.depth === 1) {
            itemTest = false;
          }

          else {
            let itemOBonuses = item.stats.filter(b => b.name === 'origin');
            //e.x. youmuus does not equip to assassins
            for (let k = 0; k < teamMember.champion.origin.length; ++k) {
                if (teamMember.champion.origin[k] === item.cannotEquip) {
                  itemTest = false;
                }
            }

            let itemCBonuses = item.stats.filter(b => b.name === 'class');
            for (let k = 0; k < teamMember.champion.classe.length; ++k) {
              if (teamMember.champion.classe[k] === item.cannotEquip) {
                itemTest = false;
              }
            }

            if (items.filter(i => i.depth === 1).length > 0 && item.depth === 1) {
              itemTest = false;
            }
          }
        } while (!itemTest)
        items.push(item);
        if (item.key === "thiefsgloves") {
          teamMember.remainingSlots = 0;
        }
        else {
          teamMember.remainingSlots -= item.depth;
        }
        teamItems -= item.depth;
      }
      teamMember.items = items;
    }
    return team;
  }

  findSynergies(team) {
    let synergies = {};
    Object.keys(this.state.team).forEach((key, index) => {
      for (let j = 0; j < team[key].champion.origin.length; ++j) {

        if (synergies[team[key].champion.origin[j]] === undefined) {
          synergies[team[key].champion.origin[j]] = {synergy: team[key].champion.origin[j], count: 1, tier: 0};
        }
        else {
          synergies[team[key].champion.origin[j]].count++;
        }
      }
      for (let j = 0; j < team[key].champion.classe.length; ++j) {
        if (synergies[team[key].champion.classe[j]] === undefined) {
          synergies[team[key].champion.classe[j]] = {synergy: team[key].champion.classe[j], count: 1, tier: 0};
        }
        else {
          synergies[team[key].champion.classe[j]].count++;
        }
      }
    })
    this.setState({synergies: synergies});
  }

  handleSearchChamps(event) {
    this.setState({searchNameChamps: event.target.value});
  }
  handleSearchItems(event) {
    this.setState({searchNameItems: event.target.value});
  }
  handleSave(event) {
    postData('teams', this.state.team, "");
  }
  toggle(target) {
    if (!this.state[target]) {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: !this.state[target].tooltipOpen
        }
      });
    }
  }
  isToolTipOpen(target) {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }

  createGameArea() {
    let gameArea = <GameArena data={this.state.team}/>
    return gameArea;
  }

  render() {
    let champions = [];
    const classes = [];
    const items = [];
    const origins = [];
    let synergies = {};
    let synergiesUnsorted = [];
    const synergiesSorted = [];
    const team = [];
    const teamData = [];

    const BLACK_COLOR = '#404040';
    const GOLD_COLOR = '#ffd700';
    const SILVER_COLOR = '#acacac';
    const BRONZE_COLOR = '#cd7f32';
    let color = BLACK_COLOR;
    let iconColor = '';

    for (let i = 0; i < this.state.champions.length; ++i) {
      if (this.state.champions[i].key.includes(this.state.searchNameChamps.toLowerCase()) || this.state.champions[i].name.includes(this.state.searchNameChamps))
      champions.push(<img src={this.state.champions[i].icon} width={50} height={50} onClick={() => this.addToTeam(this.state.champions[i])}/>);
    }
    for (let i = 0; i < this.state.classes.length; ++i) {
      classes.push(this.state.classes[i].name);
      synergies[this.state.classes[i].key] = this.state.classes[i];
    }
    for (let i = 0; i < this.state.items.length; ++i) {
      if (this.state.items[i].key.includes(this.state.searchNameItems.toLowerCase()) || this.state.items[i].name.includes(this.state.searchNameItems))
      items.push(<img src={this.state.items[i].image} width={50} height={50} onClick={() => this.addItem(this.state.items[i])}/>);
    }
    for (let i = 0; i < this.state.origins.length; ++i) {
      origins.push(this.state.origins[i].name);
      synergies[this.state.origins[i].key] = this.state.origins[i];
    }
    Object.keys(this.state.team).forEach((key, index) => {
      let c = this.state.team[key];
      team.push(
        <Card>
          <CardBody>
            <Row>{"Name: " + c.champion.name}</Row>
            <Row>{"Tier: " + c.tier}</Row>
            <Row>{"Items: " + (c.items.length === 3 ?
            (c.items[0].name + ", " + c.items[1].name + ", " + c.items[2].name) :
            (c.items.length === 2 ? (c.items[0].name + ", " + c.items[1].name) :
            (c.items.length === 1 ? c.items[0].name : "None")))}</Row>
          </CardBody>
        </Card>);
        teamData.push({champion: c.champion, tier: c.tier, items: c.items});
    })

    Object.keys(this.state.synergies).forEach((key, index) => {
      color = BLACK_COLOR;
      let synergyTiers = synergies[key.toLowerCase()].bonuses.length;

      for (let j = synergyTiers-1; j >= 0; --j) {
        if (this.state.synergies[key].count >= synergies[key.toLowerCase()].bonuses[j].needed) {
          if (j === synergyTiers - 1) {
            color = GOLD_COLOR;
            iconColor = 'black-icon';
            this.state.synergies[key].tier = 3;
            break;
          }
          else if (j === synergyTiers - 2 && synergyTiers === 3) {
            color =  SILVER_COLOR;
            iconColor = 'black-icon';
            this.state.synergies[key].tier = 2;
            break;
          }
          else {
            if ((synergies[key.toLowerCase()].mustBeExact && this.state.synergies[key].count === synergies[key.toLowerCase()].bonuses[j].needed) || !synergies[key.toLowerCase()].mustBeExact) {
              color = BRONZE_COLOR;
              iconColor = 'black-icon';
              this.state.synergies[key].tier = 1;
              break;
            }
          }
        }
        else {
          color = BLACK_COLOR;
          iconColor = '';
          this.state.synergies[key].tier = 0;
        }
      }
      synergiesUnsorted.push({synergy1: this.state.synergies[key], synergy2: synergies[key.toLowerCase()], color: color, iconcolor: iconColor});
    })

    synergiesUnsorted.sort(this.compareSynergy);
    for (let i = 0; i < synergiesUnsorted.length; i++) {
      synergiesSorted.push(<div><Card id={synergiesUnsorted[i].synergy2.key}
        inverse={synergiesUnsorted[i].color === '#404040'}
        style={{ backgroundColor: synergiesUnsorted[i].color, borderColor: synergiesUnsorted[i].color }}>
        <CardBody><img src={synergiesUnsorted[i].synergy2.image} class={synergiesUnsorted[i].iconcolor}/>{synergiesUnsorted[i].synergy2.name + ": " + synergiesUnsorted[i].synergy1.count} / {synergiesUnsorted[i].synergy1.tier >= synergiesUnsorted[i].synergy2.bonuses.length ? synergiesUnsorted[i].synergy2.bonuses[synergiesUnsorted[i].synergy2.bonuses.length - 1].needed : synergiesUnsorted[i].synergy2.bonuses[synergiesUnsorted[i].synergy1.tier].needed}</CardBody>
        </Card>
        <Tooltip placement="right" isOpen={this.isToolTipOpen(synergiesUnsorted[i].synergy2.key)} target={synergiesUnsorted[i].synergy2.key} toggle={() => this.toggle(synergiesUnsorted[i].synergy2.key)}>
          <div>
          {synergiesUnsorted[i].synergy2.name}
          <br/>
          {synergiesUnsorted[i].synergy2.description ? synergiesUnsorted[i].synergy2.description : ""}
          {synergiesUnsorted[i].synergy2.description ? <br/> : ""}
          {synergiesUnsorted[i].synergy2.bonuses[0].needed + ": " + synergiesUnsorted[i].synergy2.bonuses[0].effect}
          {synergiesUnsorted[i].synergy2.bonuses.length > 0 ? <br/> : ""}
          {synergiesUnsorted[i].synergy2.bonuses.length > 1 ? synergiesUnsorted[i].synergy2.bonuses[1].needed + ": " + synergiesUnsorted[i].synergy2.bonuses[1].effect : ""}
          {synergiesUnsorted[i].synergy2.bonuses.length > 1 ? <br/> : ""}
          {synergiesUnsorted[i].synergy2.bonuses.length > 2 ? synergiesUnsorted[i].synergy2.bonuses[2].needed + ": " + synergiesUnsorted[i].synergy2.bonuses[2].effect : ""}
          {synergiesUnsorted[i].synergy2.bonuses.length > 2 ? <br/> : ""}
          {synergiesUnsorted[i].synergy2.bonuses.length > 3 ? synergiesUnsorted[i].synergy2.bonuses[3].needed + ": " + synergiesUnsorted[i].synergy2.bonuses[3].effect : ""}
          </div>
        </Tooltip>
        </div>);
    }
    // let gameArena = null;
    // if (teamData.length > 0) {
    //   gameArena = <GameArena data={teamData}/>
    // }
    // else {
    //   gameArena = null;
    // }

      return (
        <div>
        <Row>
        <Col sm={1}></Col>
        <Col sm={2}>
              <Col>{synergiesSorted}</Col>
        </Col>
        <Col sm={4}>
          {/*<Card name="activeTraits">
            <CardBody>
              <Row>{synergies}</Row>
            </CardBody>
          </Card>*/}
          {/*<Card>
            <CardBody>
              <HexGrid width={1400} height={600} viewBox="-50 -50 100 100">
                {this.createGameArea()}
              </HexGrid>
            </CardBody>
          </Card>*/}
          <Card name="pool">
            <CardBody>
              <Row>{team}</Row>
            </CardBody>
          </Card>
          </Col>
          <Col sm={4}>
          <Row>
            <Card>
              <CardHeader style={{backgroundColor: '#ffffff'}}>
                <strong>Champions</strong>
              </CardHeader>
              <CardBody>
                <Input type="text" id="search" name="search" onChange={this.handleSearchChamps} placeholder="Champion Name" />
                {champions}
              </CardBody>
            </Card>
          </Row>
          <Row>
            <Card>
              <CardHeader style={{backgroundColor: '#ffffff'}}>
                <strong>Items</strong>
              </CardHeader>
              <CardBody>
              <Input type="text" id="search" name="search" onChange={this.handleSearchItems} placeholder="Item Name" />
                {items}
              </CardBody>
            </Card>
          </Row>
          </Col>
          <Col sm={1}></Col>
          </Row>
          <Row>
          <Button type="button" color="primary" onClick={this.randomButton}>Random</Button>
          <Button type="button" color="primary" onClick={this.clearTeam}>Clear</Button>
          </Row>
        </div>
      )
  }
}
