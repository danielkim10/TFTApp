import React, { Component } from 'react';
import { Alert, Button, Card, CardHeader, CardBody, Col, Collapse, Row, Input, Tooltip } from 'reactstrap';
import { getData, postData } from '../../api-helper/api.js';
import ChampionPanel from './champion-panel.js';
import ItemPanel from './item-panel.js';
import SynergiesPanel from './synergies-panel.js';
import TeamPanel from './team-panel.js';
import '../../css/colors.css';
import '../../css/fonts.css';
import '../../css/margins.css';
import '../../css/main.css';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team: {},
      teamString: "",
      synergies: {},
      champions: {},
      classes: [],
      items: {},
      origins: [],
      draggedItem: {},
      showAlert: false,
      alertVariant: "danger",
      alertMessage: "",
      text: {
        teamName: "",
        searchNameChamps: "",
        searchNameItems: "",
      },
    }
    this.randomButton = this.randomButton.bind(this);
    this.findSynergies = this.findSynergies.bind(this);
    this.createChampion = this.createChampion.bind(this);
    this.clearTeam = this.clearTeam.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.copy = this.copy.bind(this);
    this.toggle = this.toggle.bind(this);
    this.addToTeam = this.addToTeam.bind(this);
    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
  }

  componentDidMount() {
    getData('champions').then(data => {
      let championsA = data.filter(champion => champion.set === 1);
      let champions = Object.assign({}, this.state.champions);
      for (let i = 0; i < championsA.length; i++) {
        champions[championsA[i].key] = championsA[i];
      }
      this.setState({champions: champions});
    });
    getData('classes').then(data => {
      this.setState({classes: data.filter(classe => classe.set === 1)});
    });
    getData('items').then(data => {
      let itemsA = data.filter(item => item.set.includes(1));
      let items = Object.assign({}, this.state.items);
      for (let i = 0; i < itemsA.length; i++) {
        items[itemsA[i].key] = itemsA[i];
      }
      this.setState({items: items});
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

  addToTeam(data) {

    let team = this.state.team;
    let isDupe = team[data.name] === data.name;
    team[data.name] = {champion: data, tier: 1, items: [], remainingSlots: 6, isDupe: isDupe}
    //team.push({champion: data, tier: 1, items: [], remainingSlots: 6, isDupe: isDupe});
    this.setState({team: team});
    this.findSynergies(this.state.team);
  }

  removeFromTeam() {

  }

  clearTeam() {
    this.setState({team: {}, synergies: {}, draggedItem: {}});
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

  handleChanges(e) {
    let text = Object.assign({}, this.state.text);
    text[e.target.name] = e.target.value;
    this.setState({text: text});
  }
  copy(event) {

  }
  handleSave(event) {
    let teamObj = {name: this.state.text.teamName, team: this.state.team, synergies: this.state.synergies, teamString: this.state.teamString, set: 1, patch: "10.10"};
    postData('teams', teamObj, "");
    this.setState({showAlert: true, alertVariant: 'success', alertMessage: `Successfully saved team ${this.state.text.teamName}`})
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

  drag(e, item) {
    e.dataTransfer.setData("text", e.target.id);
    this.setState({draggedItem: item});
  }
  drop(e, key) {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");

    if (this.state.team[key].items.length === 0) {
      if (this.applyItemEffects(this.state.draggedItem, key)) {
        this.state.team[key].items[0] = this.state.draggedItem;
      }
    }
    else if (this.state.team[key].items.length === 1) {
      if (this.applyItemEffects(this.state.draggedItem, key)) {
        this.state.team[key].items[1] = this.state.draggedItem;
      }
    }
    else if (this.state.team[key].items.length === 2) {
      if (this.applyItemEffects(this.state.draggedItem, key)) {
        this.state.team[key].items[2] = this.state.draggedItem;
      }
    }
    else {
    }
    this.setState({draggedItem: {}});
  }

  applyItemEffects(item, key) {
    if (this.state.team[key].items.includes(item) && item.unique) {
      this.setState({showAlert: true, alertVariant: 'danger', alertMessage: `${item.name} is a unique item - only one can be equipped per champion`});
      window.setTimeout(() => {
        this.setState({showAlert: false, alertMessage: ""});
      }, 5000);
      return false;
    }

    for (let i = 0; i < item.stats.length; ++i) {
      if (item.stats[i].name === 'class') {
        if (!this.state.team[key].champion.classe.includes(item.stats[i].label)) {
          this.state.team[key].champion.classe.push(item.stats[i].label);
          this.findSynergies(this.state.team);
        }
        else {
          this.setState({showAlert: true, alertVariant: 'danger', alertMessage: `${item.stats[i].label} units cannot equip ${item.name}`});
          window.setTimeout(() => {
            this.setState({showAlert: false, alertMessage: ""});
          }, 5000);
          return false;
        }
      }
      else if (item.stats[i].name === 'origin') {
        if (!this.state.team[key].champion.origin.includes(item.stats[i].label)) {
          this.state.team[key].champion.origin.push(item.stats[i].label);
          this.findSynergies(this.state.team);
        }
        else {
          this.setState({showAlert: true, alertVariant: 'danger', alertMessage: `${item.stats[i].label} units cannot equip ${item.name}`});
          window.setTimeout(() => {
            this.setState({showAlert: false, alertMessage: ""});
          }, 5000);
          return false;
        }
      }
      else if (item.stats[i].name === 'attackdamage') {
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
    }
    return true;
  }

  /*
    Relevant synergies: Sorcerer, assassin, Cybernetic, Brawler, Warden, Mystic, 6 berserkers, 6 mages
  */
  applySynergyEffects(key) {

  }

  render() {
      return (
        <div>
          <Row>
            <Col sm={1}></Col>
            <Col sm={2}>
              <SynergiesPanel classes={this.state.classes} origins={this.state.origins} synergies={this.state.synergies}/>
            </Col>
            <Col sm={4}>
              <div>
                <Alert color={this.state.alertVariant} isOpen={this.state.showAlert}>{this.state.alertMessage}</Alert>
              </div>
              <Row>
                <Button type="button" color="primary" style={{width: '23%', height: '5%', marginLeft: '22px'}} onClick={this.randomButton}>Random</Button>
                <Button type="button" color="primary" style={{width: '23%', height: '5%'}} onClick={this.clearTeam}>Clear</Button>
                <Button type="button" color="primary" style={{width: '23%', height: '5%'}} onClick={this.copy}>Copy</Button>
                <Button type="button" color="primary" style={{width: '23%', height: '5%'}} onClick={this.handleSave}>Save</Button>
              </Row>
              <Input type="text" id="search" name="teamName" style={{height: '5%'}} onChange={this.handleChanges} placeholder="Team Name"/>
              <TeamPanel team={this.state.team} champions={this.state.champions}/>
            </Col>
            <Col sm={4}>
              <Row>
                <ChampionPanel champions={this.state.champions} addToTeam={this.addToTeam} drag={this.drag}/>
              </Row>
              <Row>
                <ItemPanel items={this.state.items} drag={this.drag}/>
              </Row>
            </Col>
            <Col sm={1}></Col>
          </Row>
        </div>
      )
  }
}
