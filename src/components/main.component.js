import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Col, Collapse, Row, Input, Popover, PopoverHeader, PopoverBody, Tooltip } from 'reactstrap';
//import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import './hexgrid.css'
import GameArena from './gamearena.component.js'
import { getData, postData } from '../api-helper/api.js'
import Image from 'react-image-resizer';
import '../css/colors.css';
import '../css/fonts.css';
import '../css/margins.css';
import '../css/main.css';

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
      draggedItem: {},
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
  toggleCollapse(target) {
    if (!this.state[target]) {
      this.setState({
        ...this.state,
        [target]: {
          collapseOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [target]: {
          collapseOpen: !this.state[target].collapseOpen
        }
      });
    }
  }
  isToolTipOpen(target) {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }
  isCollapseOpen(target) {
    return this.state[target] ? this.state[target].collapseOpen : false;
  }

  createGameArea() {
    let gameArea = <GameArena data={this.state.team}/>
    return gameArea;
  }

  allowDrop(e) {
    e.preventDefault();
  }
  drag(e, item) {
    e.dataTransfer.setData("text", e.target.id);
    this.setState({draggedItem: item});
  }
  drop(e, key) {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");

    if (this.state.team[key].items.length === 0) {
      this.state.team[key].items[0] = this.state.draggedItem;
      this.applyItemEffects(this.state.draggedItem, key);
    }
    else if (this.state.team[key].items.length === 1) {
      this.state.team[key].items[1] = this.state.draggedItem;
      this.applyItemEffects(this.state.draggedItem, key);
    }
    else if (this.state.team[key].items.length === 2) {
      this.state.team[key].items[2] = this.state.draggedItem;
      this.applyItemEffects(this.state.draggedItem, key);
    }
    else {
    }
    this.setState({draggedItem: {}});
  }

  applyItemEffects(item, key) {
    for (let i = 0; i < item.stats.length; ++i) {
      if (item.stats[i].name === 'attackdamage') {
        this.state.team[key].champion.stats.offense.damage[0] += item.stats[i].value;
        this.state.team[key].champion.stats.offense.damage[1] += item.stats[i].value;
        this.state.team[key].champion.stats.offense.damage[2] += item.stats[i].value;
      }
      else if (item.stats[i].name === 'abilitypower') {
        this.state.team[key].champion.stats.offense.spellPower += item.stats[i].value;
      }
      else if (item.stats[i].name === 'critchance') {
        this.state.team[key].champion.stats.offense.critChance += item.stats[i].value;
      }
      else if (item.stats[i].name === 'dodgechance') {
        this.state.team[key].champion.stats.defense.dodgeChance += item.stats[i].value;
      }
      else if (item.stats[i].name === 'attackspeed') {
        this.state.team[key].champion.stats.offense.attackSpeed += item.stats[i].value * this.state.team[key].champion.stats.offense.attackSpeed / 100;
      }
      else if (item.stats[i].name === 'armor') {
        this.state.team[key].champion.stats.defense.armor += item.stats[i].value;
      }
      else if (item.stats[i].name === 'magicresist') {
        this.state.team[key].champion.stats.defense.magicResist += item.stats[i].value;
      }
      else if (item.stats[i].name === 'startingmana') {
        if (this.state.team[key].champion.ability.manaCost != 0) {
          this.state.team[key].champion.ability.manaStart += item.stats[i].value;
          if (this.state.team[key].champion.ability.manaStart > this.state.team[key].champion.ability.manaCost) {
            this.state.team[key].champion.ability.manaStart = this.state.team[key].champion.ability.manaCost
          }
        }
      }
      else if (item.stats[i].name === 'health') {
        this.state.team[key].champion.stats.defense.health[0] += item.stats[i].value;
        this.state.team[key].champion.stats.defense.health[1] += item.stats[i].value;
        this.state.team[key].champion.stats.defense.health[2] += item.stats[i].value;
      }
      else if (item.stats[i].name === 'class') {
        if (!this.state.team[key].champion.classe.includes(item.stats[i].label)) {
          this.state.team[key].champion.classe.push(item.stats[i].label);
        }
      }
      else if (item.stats[i].name === 'origin') {
        if (!this.state.team[key].champion.origin.includes(item.stats[i].label)) {
          this.state.team[key].champion.origin.push(item.stats[i].label);
        }
      }
    }
  }

  /*
    Relevant synergies: Sorcerer, assassin, Cybernetic, Brawler, Warden, Mystic
  */
  applySynergyEffects(key) {

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
      champions.push(<div style={{display: 'inline-block'}}>
      <img src={this.state.champions[i].icon} draggable="true" onDragStart={this.drag} className='icon50 cost3border' onClick={() => this.addToTeam(this.state.champions[i])} id={this.state.champions[i].key} />
      <Tooltip placement="top" isOpen={this.isToolTipOpen(this.state.champions[i].key)} target={this.state.champions[i].key} toggle={() => this.toggle(this.state.champions[i].key)}>
        <p className='tooltipTitle'>{this.state.champions[i].name}</p>
        <p>{this.state.champions[i].cost} cost unit</p>
        <p>{this.state.champions[i].origin[0]}{this.state.champions[i].origin.length === 2 ? ' / ' + this.state.champions[i].origin[1] : ""}</p>
        <p>{this.state.champions[i].classe[0]}{this.state.champions[i].classe.length === 2 ? ' / ' + this.state.champions[i].classe[1] : ""}</p>
      </Tooltip>
      </div>);
    }
    for (let i = 0; i < this.state.classes.length; ++i) {
      classes.push(this.state.classes[i].name);
      synergies[this.state.classes[i].key] = this.state.classes[i];
    }
    for (let i = 0; i < this.state.items.length; ++i) {
      if (this.state.items[i].key.includes(this.state.searchNameItems.toLowerCase()) || this.state.items[i].name.includes(this.state.searchNameItems)) {
        let str = "";
        for (let j = 0; j < this.state.items[i].stats.length; ++j) {
          if (this.state.items[i].depth !== 1 && (this.state.items[i].stats[j].name !== 'class' && this.state.items[i].stats[j].name !== 'origin') && this.state.items[i].key != 'forceofnature') {
            if (j != 0)
              str += ', '
            str += this.state.items[i].stats[j].label;
          }
        }

        items.push(<div style={{display: 'inline-block'}}>
        <img src={this.state.items[i].image} draggable="true" onDragStart={(e) => this.drag(e, this.state.items[i])} className='icon50' onClick={() => this.addItem(this.state.items[i])} id={this.state.items[i].key}/>
        <Tooltip placement="top" isOpen={this.isToolTipOpen(this.state.items[i].key)} target={this.state.items[i].key} toggle={() => this.toggle(this.state.items[i].key)}>
          <p className='tooltipTitle'>{this.state.items[i].name}</p>
          <p>{this.state.items[i].bonus}</p>
          <p>{str}</p>
          </Tooltip>
        </div>);
      }
    }
    for (let i = 0; i < this.state.origins.length; ++i) {
      origins.push(this.state.origins[i].name);
      synergies[this.state.origins[i].key] = this.state.origins[i];
    }
    Object.keys(this.state.team).forEach((key, index) => {
      let c = this.state.team[key];
      team.push(
        <Card onDrop={(e) => this.drop(e, key)} onDragOver={this.allowDrop} id="hello" inverse='#404040' style={{backgroundColor: '#404040', borderColor: 'black'}}>
          <CardBody className='marginLeft14'>
            <Row>{c.champion.name}</Row>
            <Row>
              <img src={c.champion.icon} className='icon60'/>
              <p>{c.champion.origin[0]}</p>
              <p>{c.champion.origin.length > 1 ? c.champion.origin[1] : ""}</p>
              <p>{c.champion.classe[0]}</p>
              <p>{c.champion.classe.length > 1 ? c.champion.classe[1] : ""}</p>
              <img src={c.items.length > 0 ? c.items[0].image : ""} className='itemMargins'/>
              <img src={c.items.length > 1 ? c.items[1].image : ""} className='itemMargins'/>
              <img src={c.items.length > 2 ? c.items[2].image : ""} className='itemMargins'/>
              <Button type="button" color="primary" style={{marginLeft: '90px'}} onClick={() => this.toggleCollapse(`team-${c.champion.name}`)}>Expand</Button>
            </Row>
            <Collapse isOpen={this.isCollapseOpen(`team-${c.champion.name}`)}>
              <Row style={{marginTop: '10px'}}>
                <Col>
                  <p className='statText'>Health: {c.champion.stats.defense.health[0]}/{c.champion.stats.defense.health[1]}/{c.champion.stats.defense.health[2]}</p>
                  <p className='statText'>Attack Damage: {c.champion.stats.offense.damage[0]}/{c.champion.stats.offense.damage[1]}/{c.champion.stats.offense.damage[2]}</p>
                  <p className='statText'>Attack Speed: {c.champion.stats.offense.attackSpeed}</p>
                  <p className='statText'>Attack Range: {c.champion.stats.offense.range === 1 ? 125 : (c.champion.stats.offense.range === 2 ? 420 : (c.champion.stats.offense.range === 3 ? 680 : (c.champion.stats.offense.range === 4 ? 890 : 1130)))}</p>
                  <p className='statText'>Armor: {c.champion.stats.defense.armor}</p>
                  <p className='statText'>Magic Resist: {c.champion.stats.defense.magicResist}</p>
                </Col>
                <Col>
                  <p className='statText'>Spell Power: {c.champion.stats.offense.spellPower} %</p>
                  <p className='statText'>Crit Chance: {c.champion.stats.offense.critChance} %</p>
                  <p className='statText'>Crit Damage: {c.champion.stats.offense.critDamage} %</p>
                  <p className='statText'>Dodge Chance: {c.champion.stats.defense.dodgeChance} %</p>
                </Col>
              </Row>
              <Row style={{marginTop: '10px'}}>
                <Col sm={1}>
                  <img src={c.champion.abilityIcon} className='icon40'/>
                </Col>
                <Col>
                  <p className='statText'>{c.champion.ability.name}</p>
                  <p className='statText'>Mana: {c.champion.ability.manaStart}/{c.champion.ability.manaCost}</p>
                </Col>
              </Row>
              <Row>
                <p className='abilityMargin1'>{c.champion.ability.description}</p>
              </Row>
              <Row>
                <p className='abilityMargin2'>{c.champion.ability.stats[0].type}: {c.champion.ability.stats[0].value[0]} / {c.champion.ability.stats[0].value[1]} / {c.champion.ability.stats[0].value[2]}</p>
              </Row>
              <Row>
                <p className='abilityMargin2'>{c.champion.ability.stats.length > 1 ? c.champion.ability.stats[1].type + ': ' + c.champion.ability.stats[1].value[0] + ' / ' + c.champion.ability.stats[1].value[1] + ' / ' + c.champion.ability.stats[1].value[2] : ""}</p>
              </Row>
              <Row>
                <p className='abilityMargin2'>{c.champion.ability.stats.length > 2 ? c.champion.ability.stats[2].type + ': ' + c.champion.ability.stats[2].value[0] + ' / ' + c.champion.ability.stats[2].value[1] + ' / ' + c.champion.ability.stats[2].value[2] : ""}</p>
              </Row>
            </Collapse>
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
        <CardBody><img src={synergiesUnsorted[i].synergy2.image} className={synergiesUnsorted[i].iconcolor}/>{synergiesUnsorted[i].synergy2.name + ": " + synergiesUnsorted[i].synergy1.count} / {synergiesUnsorted[i].synergy1.tier >= synergiesUnsorted[i].synergy2.bonuses.length ? synergiesUnsorted[i].synergy2.bonuses[synergiesUnsorted[i].synergy2.bonuses.length - 1].needed : synergiesUnsorted[i].synergy2.bonuses[synergiesUnsorted[i].synergy1.tier].needed}</CardBody>
        </Card>
        <Tooltip placement="right" isOpen={this.isToolTipOpen(synergiesUnsorted[i].synergy2.key)} target={synergiesUnsorted[i].synergy2.key} toggle={() => this.toggle(synergiesUnsorted[i].synergy2.key)}>
          <div>
            <p className='tooltipTitle'>{synergiesUnsorted[i].synergy2.name}</p>
            <p>{synergiesUnsorted[i].synergy2.description ? synergiesUnsorted[i].synergy2.description : ""}</p>
            <p className={synergiesUnsorted[i].synergy1.tier < 1 ? 'tooltipLocked' : ''}>{synergiesUnsorted[i].synergy2.bonuses[0].needed + ": " + synergiesUnsorted[i].synergy2.bonuses[0].effect}</p>
            <p className={synergiesUnsorted[i].synergy1.tier < 2 ? 'tooltipLocked' : ''}>{synergiesUnsorted[i].synergy2.bonuses.length > 1 ? synergiesUnsorted[i].synergy2.bonuses[1].needed + ": " + synergiesUnsorted[i].synergy2.bonuses[1].effect : ""}</p>
            <p className={synergiesUnsorted[i].synergy1.tier < 3 ? 'tooltipLocked' : ''}>{synergiesUnsorted[i].synergy2.bonuses.length > 2 ? synergiesUnsorted[i].synergy2.bonuses[2].needed + ": " + synergiesUnsorted[i].synergy2.bonuses[2].effect : ""}</p>
            <p className={synergiesUnsorted[i].synergy1.tier < 4 ? 'tooltipLocked' : ''}>{synergiesUnsorted[i].synergy2.bonuses.length > 3 ? synergiesUnsorted[i].synergy2.bonuses[3].needed + ": " + synergiesUnsorted[i].synergy2.bonuses[3].effect : ""}</p>
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
          {/*<Card>
            <CardBody>
              <HexGrid width={1400} height={600} viewBox="-50 -50 100 100">
                {this.createGameArea()}
              </HexGrid>
            </CardBody>
          </Card>*/}
          <Card name="pool" style={{borderColor: 'white'}}>
            <CardBody>
              {team}
            </CardBody>
          </Card>
          </Col>
          <Col sm={4}>
          <Row>
            <Card>
              <CardHeader className='whitebg'>
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
              <CardHeader className='whitebg'>
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
          <Button type="button" color="primary" onClick={this.handleSave}>Save</Button>
          </Row>
        </div>
      )
  }
}
