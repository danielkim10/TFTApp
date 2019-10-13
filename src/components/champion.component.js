import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import axios from 'axios';


class Champion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origins: [],
      classes: [],
      champion: {
        id: 0,
        key: "",
        name: "",
        origin: [],
        class: [],
        cost: [0, 0, 0],
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
            damage: [0, 0, 0],
            attackSpeed: 0,
            spellPower: 0,
            critChance: 0,
            range: 0,
          },
          defense: {
            health: [0, 0, 0],
            armor: 0,
            magicResist: 0,
            dodgeChance: 0,
          },
        },
        image: "",
    }
  }
  this.handleChampions = this.handleChampions.bind(this);
  this.handleJsonInput = this.handleJsonInput.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}
  componentDidMount() {
    axios.get('http://localhost:5000/champions/' + this.props.match.params.id)
    .then(response => {
      if (response.data.id) {
        let champion = Object.assign({}, this.state.champion);
        let abilityStatType = [];
        let abilityStatValue = [];
        champion = response.data;
        for (let i = 0; i < response.data.ability.stats.length; i++) {
          abilityStatType.push(response.data.ability.stats[i].type);
          abilityStatValue.push(response.data.ability.stats[i].value);
          console.log(response.data.ability.stats[i].type);
          console.log(response.data.ability.stats[i].value);
        }
        champion.ability.statsType = abilityStatType;
        champion.ability.statsValue = abilityStatValue;
        this.setState({
          champion: champion
        })
      }
    })
  }

  handleChampions(event) {
    let champion = Object.assign({}, this.state.champion);
    if (event.target.id === "ability") {
      champion.ability[event.target.name] = event.target.value;
    }
    else if (event.target.id === "abilityStats") {
      champion.ability.stats[event.target.name] = event.target.value;
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

  handleJsonInput(event) {
    if (event.target.name === "cost") {
      let champion = Object.assign({}, this.state.champion);
      let cost = event.target.value.split(',');
      champion.cost = [];
      for (let i = 0; i < cost.length; i++) {
        champion.cost.push(parseInt(cost[i]));
      }
      this.setState({champion: champion});
    }
    else if (event.target.name === "origin") {
      let champion = Object.assign({}, this.state.champion);
      let origin = event.target.value.split(',');
      champion.origin = [];
      for (let i = 0; i < origin.length; i++) {
        champion.origin.push(origin[i]);
      }
      this.setState({champion: champion});
    }
    else if (event.target.name === "class") {
      let champion = Object.assign({}, this.state.champion);
      let classe =  event.target.value.split(',');
      champion.class = [];
      for (let i = 0; i < classe.length; i++) {
        champion.class.push(classe[i]);
      }
      this.setState({champion: champion});
    }
    else if (event.target.name === "type") {
      let champion = Object.assign({}, this.state.champion);
      let type = event.target.value.split(',');
      for (let i = 0; i < type.length; i++) {
        champion.ability.stats[i].type = type[i];
      }
      this.setState({champion: champion});
    }
    else if (event.target.name === "value") {
      let champion = Object.assign({}, this.state.champion);
      let value = event.target.value.split(',');
      for (let i = 0; i < value.length; i++) {
        champion.ability.stats[i].value = parseInt(value[i]);
      }
      this.setState({champion: champion});
    }
    else if (event.target.name === "damage") {
      let champion = Object.assign({}, this.state.champion);
      let damage = event.target.value.split(',');
      champion.damage = [];
      for (let i = 0; i < damage.length; i++) {
        champion.damage.push(parseInt(damage[i]));
      }
      this.setState({champion: champion});
    }
    else if (event.target.name === "health") {
      let champion = Object.assign({}, this.state.champion);
      let health = event.target.value.split(',');
      champion.health = [];
      for (let i = 0; i < health.length; i++) {
        champion.health.push(parseInt(health[i]));
      }
      this.setState({champion: champion});
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const champion = {
     id: this.state.champion.id,
     key: this.state.champion.key,
     name: this.state.champion.name,
     origin: this.state.champion.origin,
     classe: this.state.champion.class,
     cost: this.state.champion.cost,
     ability: this.state.champion.ability,
     stats: this.state.champion.stats,
     image: this.state.champion.image
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
                {this.renderFormGroup("Cost: ", "text", "cost", "cost", this.handleJsonInput, this.state.champion.cost)}
                {this.renderFormGroup("Origin: ", "text", "origin", "origin", this.handleJsonInput, this.state.champion.origin)}
                {this.renderFormGroup("Class: ", "text", "class", "class", this.handleJsonInput, this.state.champion.class)}
                {this.renderFormGroup("Ability Name: ", "text", "ability", "name", this.handleChampions, this.state.champion.ability.name)}
                {this.renderFormGroup("Ability Description: ", "text", "ability", "description", this.handleChampions, this.state.champion.ability.description)}
                {this.renderFormGroup("Ability Type: ", "text", "ability", "type", this.handleChampions, this.state.champion.ability.type)}
                {this.renderFormGroup("Mana Cost: ", "number", "ability", "manaCost", this.handleChampions, this.state.champion.ability.manaCost)}
                {this.renderFormGroup("Mana Start: ", "number", "ability", "manaStart", this.handleChampions, this.state.champion.ability.manaStart)}
                {this.renderFormGroup("Ability Stat Type: ", "text", "abilityStats", "type", this.handleJsonInput, this.state.champion.ability.statsType)}
                {this.renderFormGroup("Ability Stat Value: ", "text", "abilityStats", "value", this.handleJsonInput, this.state.champion.ability.statsValue)}
                </Col>
                <Col md={6}>
                {this.renderFormGroup("Damage: ", "text", "offense", "damage", this.handleJsonInput, this.state.champion.stats.offense.damage)}
                {this.renderFormGroup("Attack Speed: ", "number", "offense", "attackSpeed", this.handleChampions, this.state.champion.stats.offense.attackSpeed)}
                {this.renderFormGroup("Spell Power: ", "number", "offense", "spellPower", this.handleChampions, this.state.champion.stats.offense.spellPower)}
                {this.renderFormGroup("Crit Chance: ", "number", "offense", "critChance", this.handleChampions, this.state.champion.stats.offense.critChance)}
                {this.renderFormGroup("Dodge Chance: ", "number", "defense", "dodgeChance", this.handleChampions, this.state.champion.stats.defense.dodgeChance)}
                {this.renderFormGroup("Range: ", "number", "offense", "range", this.handleChampions, this.state.champion.stats.offense.range)}
                {this.renderFormGroup("Health: ", "text", "defense", "health", this.handleJsonInput, this.state.champion.stats.defense.health)}
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
