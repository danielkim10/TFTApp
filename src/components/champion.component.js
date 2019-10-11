import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Collapse, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import Select from 'react-select';
import {ToastsContainer, ToastsStore} from 'react-toasts';


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
          stats: {
            type: "",
            value: 0,
          }
        }
    }
  }
  this.handleChampions = this.handleChampions.bind(this);
  this.handleJsonInput = this.handleJsonInput.bind(this);
  this.handleSelect = this.handleSelect.bind(this);
}
  componentDidMount() {
    this.autoLoad();
  }

  async autoLoad() {

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
    else if (event.target.name === "type") {
      let champion = Object.assign({}, this.state.champion);
      let abilityStats = JSON.parse(event.target.value);
      for (let i = 0; i < abilityStats.length; i++) {
        champion.ability.stats[i].type = abilityStats[i].type;
      }
      this.setState({champion: champion});
    }
    else if (event.target.name === "value") {
      let champion = Object.assign({}, this.state.champion);
      let abilityStats = JSON.parse(event.target.value);
      for (let i = 0; i < abilityStats.length; i++) {
        champion.ability.stats[i].value = parseInt(abilityStats[i].value);
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

  handleSelect(event, choose) {
    let champion = Object.assign({}, this.state.champion);
    if (choose === 0) {
      champion.origin = [];
      for (let i = 0; i < event.length; i++) {
        champion.origin.push(event[i].label);
      }
    }
    else if (choose === 1) {
      champion.class = [];
      for (let i = 0; i < event.length; i++) {
        champion.class.push(event[i].label);
      }
    }
    this.setState({champion: champion});
  }

  renderFormGroup(label, type, id, name, handler) {
    return (
      <Fragment>
        <FormGroup>
          <Label>{label}</Label>
          <Input type={type} id={id} name={name} onChange={handler} value={this.state.value} />
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
                {this.renderFormGroup("ID: ", "number", "id", "id", this.handleChampions)}
                {this.renderFormGroup("Key: ", "text", "key", "key", this.handleChampions)}
                {this.renderFormGroup("Name: ", "text", "name", "name", this.handleChampions)}
                {this.renderFormGroup("Cost: ", "text", "cost", "cost", this.handleJsonInput)}
                {this.renderFormGroup("Ability Name: ", "text", "ability", "name", this.handleChampions)}
                {this.renderFormGroup("Ability Description: ", "text", "ability", "description", this.handleChampions)}
                {this.renderFormGroup("Ability Type: ", "text", "ability", "type", this.handleChampions)}
                {this.renderFormGroup("Mana Cost: ", "number", "ability", "manaCost", this.handleChampions)}
                {this.renderFormGroup("Mana Start: ", "number", "ability", "manaStart", this.handleChampions)}
                {this.renderFormGroup("Ability Stat Type: ", "text", "abilityStats", "type", this.JsonInput)}
                {this.renderFormGroup("Ability Stat Value: ", "text", "abilityStats", "value", this.JsonInput)}
                {/*<FormGroup>
                  <Label>Origin: </Label>
                  <Select options={origins} className="basic-multi-select" classNamePrefix="select" isMulti id="origin" name="origin" onChange={event => this.handleSelect(event, 0)}/>
                </FormGroup>
                <FormGroup>
                  <Label>Class: </Label>
                  <Select options={classes} className="basic-multi-select" classNamePrefix="select" isMulti id="class" name="class" onChange={event => this.handleSelect(event, 1)}/>
                </FormGroup>*/}-
                </Col>
                <Col md={6}>
                {this.renderFormGroup("Damage: ", "text", "offense", "damage", this.handleJsonInput)}
                {this.renderFormGroup("Attack Speed: ", "number", "offense", "attackSpeed", this.handleChampions)}
                {this.renderFormGroup("Spell Power: ", "number", "offense", "spellPower", this.handleChampions)}
                {this.renderFormGroup("Crit Chance: ", "number", "offense", "critChance", this.handleChampions)}
                {this.renderFormGroup("Dodge Chance: ", "number", "defense", "dodgeChance", this.handleChampions)}
                {this.renderFormGroup("Range: ", "number", "offense", "range", this.handleChampions)}
                {this.renderFormGroup("Health: ", "text", "defense", "health", this.handleJsonInput)}
                {this.renderFormGroup("Armor: ", "number", "defense", "armor", this.handleChampions)}
                {this.renderFormGroup("Magic Resist: ", "number", "defense", "magicResist", this.handleChampions)}
                </Col>
                </Row>
            </Form>
            </CardBody>
            <CardFooter>
              <Button type="button" color="primary" onClick={this.handleChampionSubmit}>Submit</Button>
            </CardFooter>
          </Card>
      </div>
    )
  }
}


export default Champion;
