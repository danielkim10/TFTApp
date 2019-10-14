import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import axios from 'axios';


class Champion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempStrings: {
          origin: "",
          class: "",
          cost: "",
          statsType: "",
          statsValue: "",
          damage: "",
          health: "",
      },
      origins: [],
      classes: [],
      champion: {
        id: 0,
        key: "",
        name: "",
        origin: [],
        class: [],
        cost: [],
        ability: {
          name: "",
          description: "",
          type: "",
          manaCost: 0,
          manaStart: 0,
          statsType: [],
          statsValue: [],
        },
        stats: {
          offense: {
            damage: [],
            attackSpeed: 0,
            spellPower: 0,
            critChance: 0,
            range: 0,
          },
          defense: {
            health: [],
            armor: 0,
            magicResist: 0,
            dodgeChance: 0,
          },
        },
        image: "",
    }
  }
  this.handleChampions = this.handleChampions.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}
  componentDidMount() {
    axios.get('http://localhost:5000/champions/' + this.props.match.params.id)
    .then(response => {
      if (response.data.id) {
        let champion = Object.assign({}, this.state.champion);
        let tempStrings = Object.assign({}, this.state.tempStrings);
        let abilityStatType = [];
        let abilityStatValue = [];
        champion = response.data;
        for (let i = 0; i < response.data.ability.stats.length; i++) {
          abilityStatType.push(response.data.ability.stats[i].type);
          abilityStatValue.push(response.data.ability.stats[i].value);
        }
        tempStrings.cost = response.data.cost.join();
        tempStrings.origin = response.data.origin.join();
        tempStrings.class = response.data.class.join();
        tempStrings.statsType = abilityStatType.join();
        tempStrings.statsValue = abilityStatValue.join();
        tempStrings.damage = response.data.stats.offense.damage.join();
        tempStrings.health = response.data.stats.defense.health.join();
        champion.ability.statsType = abilityStatType;
        champion.ability.statsValue = abilityStatValue;
        this.setState({
          champion: champion, tempStrings: tempStrings
        });
      }
    })
  }

  handleChampions(event) {
    if (event.target.name === "cost" || event.target.name === "damage" || event.target.name === "health" ||
        event.target.name === "origin" || event.target.name === "class" || event.target.name === "statsType" || event.target.name === "statsValue") {
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

    let _champion = Object.assign({}, this.state.champion);
    let cost = this.state.tempStrings.cost.split(',');
    let origin = this.state.tempStrings.origin.split(',');
    let classe = this.state.tempStrings.class.split(',');
    let damage = this.state.tempStrings.damage.split(',');
    let health = this.state.tempStrings.health.split(',');
    let statsType = this.state.tempStrings.statsType.split(',');
    let _statsValue = this.state.tempStrings.statsValue.split('/');
    let statsValue = [];
    for (let i in _statsValue) {
      statsValue[i].push(_statsValue[i].split(','));
    }

    _champion.cost = cost;
    _champion.origin = origin;
    _champion.class = classe;
    _champion.damage = damage;
    _champion.health = health;
    _champion.statsType = statsType;
    _champion.statsValue = statsValue;
    this.setState({champion: _champion});

    const champion = {
     id: this.state.champion.id,
     key: this.state.champion.key,
     name: this.state.champion.name,
     origin: this.state.champion.origin,
     classe: this.state.champion.class,
     cost: this.state.champion.cost,
     ability: this.state.champion.ability,
     stats: this.state.champion.stats,
     image: this.state.champion.image,
    }

    axios.post('http://localhost:5000/champions/update/' + this.props.match.params.id, champion)
      .then(res => console.log(res.data));
    window.location = '/edit';
  }

  renderFormGroup(label, type, id, name, handler, state) {
    return (
      <Fragment>
        <FormGroup>
          <Label>{label}</Label>
          <Input type={type} id={id} name={name} onChange={handler} value={state}/>
        </FormGroup>
      </Fragment>
    );
  }

  render() {
    return (
      <div>
        <Card style={{width: "100%"}}>
          <CardHeader>
            <i class="fa-fa-align-justify"></i><strong>Champions</strong>
          </CardHeader>
          <CardBody>
            <Form onSubmit={this.handleSubmit}>
              <Row>
              <Col md={6}>
                {this.renderFormGroup("ID: ", "number", "id", "id", this.handleChampions, this.state.champion.id)}
                {this.renderFormGroup("Key: ", "text", "key", "key", this.handleChampions, this.state.champion.key)}
                {this.renderFormGroup("Name: ", "text", "name", "name", this.handleChampions, this.state.champion.name)}
                {this.renderFormGroup("Cost: ", "text", "cost", "cost", this.handleChampions, this.state.tempStrings.cost)}
                {this.renderFormGroup("Origin: ", "text", "origin", "origin", this.handleChampions, this.state.tempStrings.origin)}
                {this.renderFormGroup("Class: ", "text", "class", "class", this.handleChampions, this.state.tempStrings.class)}
                {this.renderFormGroup("Ability Name: ", "text", "ability", "name", this.handleChampions, this.state.champion.ability.name)}
                {this.renderFormGroup("Ability Description: ", "text", "ability", "description", this.handleChampions, this.state.champion.ability.description)}
                {this.renderFormGroup("Ability Type: ", "text", "ability", "type", this.handleChampions, this.state.champion.ability.type)}
                {this.renderFormGroup("Mana Cost: ", "number", "ability", "manaCost", this.handleChampions, this.state.champion.ability.manaCost)}
                {this.renderFormGroup("Mana Start: ", "number", "ability", "manaStart", this.handleChampions, this.state.champion.ability.manaStart)}
                {this.renderFormGroup("Ability Stat Type: ", "text", "abilityStats", "statsType", this.handleChampions, this.state.tempStrings.statsType)}
                {this.renderFormGroup("Ability Stat Value: ", "text", "abilityStats", "statsValue", this.handleChampions, this.state.tempStrings.statsValue)}
                </Col>
                <Col md={6}>
                {this.renderFormGroup("Damage: ", "text", "offense", "damage", this.handleChampions, this.state.tempStrings.damage)}
                {this.renderFormGroup("Attack Speed: ", "number", "offense", "attackSpeed", this.handleChampions, this.state.champion.stats.offense.attackSpeed)}
                {this.renderFormGroup("Spell Power: ", "number", "offense", "spellPower", this.handleChampions, this.state.champion.stats.offense.spellPower)}
                {this.renderFormGroup("Crit Chance: ", "number", "offense", "critChance", this.handleChampions, this.state.champion.stats.offense.critChance)}
                {this.renderFormGroup("Dodge Chance: ", "number", "defense", "dodgeChance", this.handleChampions, this.state.champion.stats.defense.dodgeChance)}
                {this.renderFormGroup("Range: ", "number", "offense", "range", this.handleChampions, this.state.champion.stats.offense.range)}
                {this.renderFormGroup("Health: ", "text", "defense", "health", this.handleChampions, this.state.tempStrings.health)}
                {this.renderFormGroup("Armor: ", "number", "defense", "armor", this.handleChampions, this.state.champion.stats.defense.armor)}
                {this.renderFormGroup("Magic Resist: ", "number", "defense", "magicResist", this.handleChampions, this.state.champion.stats.defense.magicResist)}
                </Col>
                </Row>
            </Form>
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
