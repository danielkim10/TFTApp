import React, { Component } from 'react';
import {Button, Row, Col, Card, CardHeader,
        CardBody, CardFooter } from 'reactstrap';
import { renderFormGroup } from '../../sub-components/formgroup.js'
import { updateData } from '../../api-helper/api.js'

class Champion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempStrings: {
          origin: "",
          classe: "",
          statsType: "",
          statsValue: "",
          statsUnit: "",
          damage: "",
          health: "",
          set: "",
      },
      origins: [],
      classes: [],
      champion: {
        id: 0,
        key: "",
        name: "",
        origin: [],
        classe: [],
        cost: 0,
        ability: {
          name: "",
          description: "",
          type: "",
          manaCost: 0,
          manaStart: 0,
          stats: []
        },
        stats: {
          offense: {
            damage: [],
            attackSpeed: 0,
            spellPower: 0,
            critChance: 0,
            critDamage: 0,
            range: 0,
          },
          defense: {
            health: [],
            armor: 0,
            magicResist: 0,
            dodgeChance: 0,
          },
        },
        set: [],
        image: "",
        icon: "",
        abilityIcon: "",
    }
  }
  this.handleChampions = this.handleChampions.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}
  componentDidMount() {
    // getDataFromId('champions', this.props.match.params.id).then(data => {
      let champion = Object.assign({}, this.props.location.state.data);
      let tempStrings = Object.assign({}, this.state.tempStrings);
      let abilityStatType = [];
      let abilityStatValue = [];
      let _abilityStatValue = "";
      let abilityStatUnit = [];
      for (let i = 0; i < champion.ability.stats.length; i++) {
        abilityStatType.push(champion.ability.stats[i].type);
        abilityStatValue.push(champion.ability.stats[i].value);
        abilityStatUnit.push(champion.ability.stats[i].unit);
      }
      // tempStrings.cost = champion.cost.join();
      tempStrings.origin = champion.origin.join();
      tempStrings.classe = champion.classe.join();
      tempStrings.statsType = abilityStatType.join();
      for (let i = 0; i < abilityStatValue.length; i++) {
        _abilityStatValue += abilityStatValue[i].join();
        if (i < abilityStatValue.length -1) {
          _abilityStatValue += '/';
        }
      }
      tempStrings.statsValue = _abilityStatValue;
      tempStrings.statsUnit = abilityStatUnit.join();
      tempStrings.damage = champion.stats.offense.damage.join();
      tempStrings.health = champion.stats.defense.health.join();
      tempStrings.set = champion.set.join();
      champion.ability.statsType = abilityStatType;
      champion.ability.statsValue = abilityStatValue;
      this.setState({
        champion: champion, tempStrings: tempStrings
      });
    // });
  }

  handleChampions(event) {
    if (event.target.name === "cost" || event.target.name === "damage" || event.target.name === "health" || event.target.name === "set" ||
        event.target.name === "origin" || event.target.name === "classe" || event.target.name === "statsType" || event.target.name === "statsValue" || event.target.name === "statsUnit") {
        let tempStrings = Object.assign({}, this.state.tempStrings);
        tempStrings[event.target.name] = event.target.value;
        this.setState({tempStrings: tempStrings});
    }
    else {
      let champion = Object.assign({}, this.state.champion);
      if (event.target.id === "ability") {
        champion.ability[event.target.name] = event.target.value;
      }
      else if (event.target.id === "offense") {
        champion.stats.offense[event.target.name] = event.target.value;
      }
      else if (event.target.id === "defense") {
        champion.stats.defense[event.target.name] = event.target.value;
      }
      else {
        champion[event.target.name] = event.target.value;
      }
      this.setState({ champion: champion });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    let champion = Object.assign({}, this.state.champion);
    // let cost = this.state.tempStrings.cost.split(',');
    // for (let h in cost) {
    //   cost[h] = parseInt(cost[h]);
    // }
    let origin = this.state.tempStrings.origin.split(',');
    let classe = this.state.tempStrings.classe.split(',');
    let damage = this.state.tempStrings.damage.split(',');
    for (let i in damage) {
      damage[i] = parseInt(damage[i]);
    }
    let health = this.state.tempStrings.health.split(',');
    for (let j in health) {
      health[j] = parseInt(health[j]);
    }
    let stats = [];
    let statsType = this.state.tempStrings.statsType.split(',');
    let statsUnit = this.state.tempStrings.statsUnit.split(',');
    let _statsValue = this.state.tempStrings.statsValue.split('/');
    let statsValue = [];
    for (let k in _statsValue) {
      let __statsValue = _statsValue[k].split(',');
      for (let l in __statsValue) {
          __statsValue[l] = parseFloat(__statsValue[l]);
      }
      statsValue.push(__statsValue);
      stats.push({type: statsType[k], value: statsValue[k], unit: statsUnit[k]});
    }

    // champion.cost = cost;
    champion.origin = origin;
    champion.classe = classe;
    champion.stats.offense.damage = damage;
    champion.stats.defense.health = health;
    champion.ability.stats = stats;
    champion.set = this.state.tempStrings.set.split(',');
    this.setState({champion: champion}, function() {
      const _champion = {
       id: this.state.champion.id,
       key: this.state.champion.key,
       name: this.state.champion.name,
       origin: this.state.champion.origin,
       classe: this.state.champion.classe,
       cost: this.state.champion.cost,
       ability: this.state.champion.ability,
       stats: this.state.champion.stats,
       set: this.state.champion.set,
       image: this.state.champion.image,
       icon: this.state.champion.icon,
       abilityIcon: this.state.champion.abilityIcon
      }
      updateData('champions', this.props.match.params.id, _champion, '/edit');
    });
  }

  render() {
    // let fields = [
    //   { label: "ID: ", type: "number", id: "id", name: "id", handler: this.handleChampions, state: this.state.champion.id },
    //   { label: "Key: ", type: "text", id: "key", name: "key", handler: this.handleChampions, state: this.state.champion.key },
    //   { label: "Name: ", type: "text", id: "name", name: "name", handler: this.handleChampions, state: this.state.champion.name },
    //   { label: "Cost: ", type: "text", id: "cost", name: "cost", handler: this.handleChampions, state: this.state.tempStrings.cost },
    //   { label: "Tier: ", type: "number", id: "tier", name: "tier", handler: this.handleChampions, state: this.state.champion.tier },
    //   { label: "Origin: ", type: "text", id: "origin", name: "origin", handler: this.handleChampions, state: this.state.tempStrings.origin },
    //   { label: "Class: ", type: "text", id: "classe", name: "classe", handler: this.handleChampions, state: this.state.tempStrings.classe },
    //   { label: "Ability Name: ", type: "text", id: "ability", name: "name", handler: this.handleChampions, state: this.state.champion.ability.name },
    //   { label: "Ability Description: ", type: "text", id: "ability", name: "description", handler: this.handleChampions, state: this.state.champion.ability.description },
    //   { label: "Ability Type: ", type: "text", id: "ability", name: "type", handler: this.handleChampions, state: this.state.champion.ability.type },
    //   { label: "Mana Cost: ", type: "number", id: "ability", name: "manaCost", handler: this.handleChampions, state: this.state.champion.ability.manaCost },
    //   { label: "Mana Start: ", type: "number", id: "ability", name: "manaStart", handler: this.handleChampions, state: this.state.champion.ability.manaStart },
    //   { label: "Ability Stat Type: ", type: "text", id: "abilityStats", name: "statsType", handler: this.handleChampions, state: this.state.tempStrings.statsType },
    //   { label: "Ability Stat Value: ", type: "text", id: "abilityStats", name: "statsValue", handler: this.handleChampions, state: this.state.tempStrings.statsValue },
    //   { label: "Damage: ", type: "text", id: "offense", name: "damage", handler: this.handleChampions, state: this.state.tempStrings.damage },
    //   { label: "Attack Speed: ", type: "number", id: "offense", name: "attackSpeed", handler: this.handleChampions, state: this.state.champion.stats.offense.attackSpeed },
    //   { label: "Spell Power: ", type: "number", id: "offense", name: "spellPower", handler: this.handleChampions, state: this.state.champion.stats.offense.spellPower },
    //   { label: "Crit Chance: ", type: "number", id: "offense", name: "critChance", handler: this.handleChampions, state: this.state.champion.stats.offense.critChance },
    //   { label: "Dodge Chance: ", type: "number", id: "defense", name: "dodgeChance", handler: this.handleChampions, state: this.state.champion.stats.defense.dodgeChance },
    //   { label: "Range: ", type: "number", id: "offense", name: "range", handler: this.handleChampions, state: this.state.champion.stats.offense.range },
    //   { label: "Health: ", type: "text", id: "defense", name: "health", handler: this.handleChampions, state: this.state.tempStrings.health },
    //   { label: "Armor: ", type: "number", id: "defense", name: "armor", handler: this.handleChampions, state: this.state.champion.stats.defense.armor },
    //   { label: "Magic Resist: ", type: "number", id: "defense", name: "magicResist", handler: this.handleChampions, state: this.state.champion.stats.defense.magicResist },
    //   { label: "Set: ", type: "number", id: "set", name: "set", handler: this.handleChampions, state: this.state.champion.set },
    //   { label: "Image: ", type: "text", id: "image", name: "image", handler: this.handleChampions, state: this.state.champion.image },
    //   { label: "Icon: ", type: "text", id: "icon", name: "icon", handler: this.handleChampions, state: this.state.champion.icon },
    // ];

    return (
      <div>
        <Card style={{width: "100%"}}>
          <CardHeader>
            <i class="fa-fa-align-justify"></i><strong>Champions</strong>
          </CardHeader>
          <CardBody>
              <Row>
              <Col md={6}>
                {renderFormGroup("ID: ", "number", "id", "id", this.handleChampions, this.state.champion.id)}
                {renderFormGroup("Key: ", "text", "key", "key", this.handleChampions, this.state.champion.key)}
                {renderFormGroup("Name: ", "text", "name", "name", this.handleChampions, this.state.champion.name)}
                {renderFormGroup("Cost: ", "text", "cost", "cost", this.handleChampions, this.state.champion.cost)}
                {renderFormGroup("Origin: ", "text", "origin", "origin", this.handleChampions, this.state.tempStrings.origin)}
                {renderFormGroup("Class: ", "text", "classe", "classe", this.handleChampions, this.state.tempStrings.classe)}
                {renderFormGroup("Ability Name: ", "text", "ability", "name", this.handleChampions, this.state.champion.ability.name)}
                {renderFormGroup("Ability Description: ", "text", "ability", "description", this.handleChampions, this.state.champion.ability.description)}
                {renderFormGroup("Ability Type: ", "text", "ability", "type", this.handleChampions, this.state.champion.ability.type)}
                {renderFormGroup("Mana Cost: ", "number", "ability", "manaCost", this.handleChampions, this.state.champion.ability.manaCost)}
                {renderFormGroup("Mana Start: ", "number", "ability", "manaStart", this.handleChampions, this.state.champion.ability.manaStart)}
                {renderFormGroup("Ability Stat Type: ", "text", "abilityStats", "statsType", this.handleChampions, this.state.tempStrings.statsType)}
                {renderFormGroup("Ability Stat Value: ", "text", "abilityStats", "statsValue", this.handleChampions, this.state.tempStrings.statsValue)}
                {renderFormGroup("Ability Stat Unit: ", "text", "abilityStats", "statsUnit", this.handleChampions, this.state.tempStrings.statsUnit)}
                </Col>
                <Col md={6}>
                {renderFormGroup("Damage: ", "text", "offense", "damage", this.handleChampions, this.state.tempStrings.damage)}
                {renderFormGroup("Attack Speed: ", "number", "offense", "attackSpeed", this.handleChampions, this.state.champion.stats.offense.attackSpeed)}
                {renderFormGroup("Spell Power: ", "number", "offense", "spellPower", this.handleChampions, this.state.champion.stats.offense.spellPower)}
                {renderFormGroup("Crit Chance: ", "number", "offense", "critChance", this.handleChampions, this.state.champion.stats.offense.critChance)}
                {renderFormGroup("Crit Damage: ", "number", "offense", "critDamage", this.handleChampions, this.state.champion.stats.offense.critDamage)}
                {renderFormGroup("Dodge Chance: ", "number", "defense", "dodgeChance", this.handleChampions, this.state.champion.stats.defense.dodgeChance)}
                {renderFormGroup("Range: ", "number", "offense", "range", this.handleChampions, this.state.champion.stats.offense.range)}
                {renderFormGroup("Health: ", "text", "defense", "health", this.handleChampions, this.state.tempStrings.health)}
                {renderFormGroup("Armor: ", "number", "defense", "armor", this.handleChampions, this.state.champion.stats.defense.armor)}
                {renderFormGroup("Magic Resist: ", "number", "defense", "magicResist", this.handleChampions, this.state.champion.stats.defense.magicResist)}
                {renderFormGroup("Set: ", "text", "set", "set", this.handleChampions, this.state.tempStrings.set)}
                {renderFormGroup("Image: ", "text", "image", "image", this.handleChampions, this.state.champion.image)}
                {renderFormGroup("Icon: ", "text", "icon", "icon", this.handleChampions, this.state.champion.icon)}
                {renderFormGroup("Ability Icon: ", "text", "abilityIcon", "abilityIcon", this.handleChampions, this.state.champion.abilityIcon)}
                </Col>
                </Row>
            </CardBody>
            <CardFooter>
              <Button type="button" color="primary" onClick={this.handleSubmit}>Submit</Button>
            </CardFooter>
          </Card>
      </div>
    )
  }
}


export default Champion;
