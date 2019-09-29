import React, { Component } from 'react';
import {Button, Row, Col, Collapse, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import Select from 'react-select';
import axios from 'axios';
import Formgroups from '../sub-components/formgroups'

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      championCollapse: false,
      classCollapse: false,
      itemCollapse: false,
      originCollapse: false,

      origins: [],
      classes: [],

      champion: {
        id: 0,
        key: "",
        name: "",
        origin: [],
        class: [],
        cost: 0,
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
        },
        stats: {
          offense: {
            damage: 0,
            attackSpeed: 0,
            spellPower: 0,
            critChance: 0,
            dodgeChance: 0,
            range: 0,
          },
          defense: {
            health: 0,
            armor: 0,
            magicResist: 0,
          }
        },
        image: "",
      },
      class: {
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        image: "",
      },
      item: {
        key: "",
        name: "",
        type: "",
        bonus: "",
        depth: 0,
        stats: [],
        buildsFrom: [],
        buildsInto: [],
        unique: false,
        image: "",
      },
      origin: {
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        image: "",
      },
    }
    this.handleInputs = this.handleInputs.bind(this);
    this.handleChampions = this.handleChampions.bind(this);
    this.handleChampionSubmit = this.handleChampionSubmit.bind(this);
    this.handleClasses = this.handleClasses.bind(this)
    this.handleClassSubmit = this.handleClassSubmit.bind(this);
    this.handleItems = this.handleItems.bind(this);
    this.handleItemSubmit = this.handleItemSubmit.bind(this);
    this.handleOrigins = this.handleOrigins.bind(this);
    this.handleOriginSubmit = this.handleOriginSubmit.bind(this);
    this.championToggle = this.championToggle.bind(this);
    this.classToggle = this.classToggle.bind(this);
    this.itemToggle = this.itemToggle.bind(this);
    this.originToggle = this.originToggle.bind(this);
  }

  getOrigins() {

  }

  getClasses() {

  }

  handleInputs(event) {


  }

  handleChampions(event) {
    let champion = Object.assign({}, this.state.champion);
    champion[event.target.id] = event.target.value;
    this.setState({ champion: champion });
  }

  handleClasses(event) {
    let classe = Object.assign({}, this.state.class);
    classe[event.target.id] = event.target.value;
    this.setState({ class: classe });
  }

  handleItems(event) {
    let item = Object.assign({}, this.state.item);
    item[event.target.id] = event.target.value;
    this.setState({ item: item });
  }

  handleOrigins(event) {
    let origin = Object.assign({}, this.state.origin);
    origin[event.target.id] = event.target.value;
    this.setState({ origin: origin });
  }

  handleChampionSubmit(e) {
    // e.preventDefault();
    // const champion = {
    //  id: this.state.champion.id,
    //   key: this.state.champion.key,
    //   name: this.state.champion.name,
    //   origin: this.state.champion.origin,
    //  class: this.state.champion.class,
    //  cost: this.state.champion.cost,
    //  ability: this.state.champion.ability,
    //  stats: this.state.champion.stats,
    //  image: this.state.champion.image
    // }
    //
    // axios.post('http://localhost:5000/champions/add', champion)
    //   .then(res => console.log(res.data));
  }

  handleClassSubmit(e) {
    e.preventDefault();
    const classe = {
     key: this.state.class.key,
     name: this.state.class.name,
     description: this.state.class.description,
     bonuses: this.state.class.bonuses,
     mustBeExact: this.state.class.mustBeExact,
     image: this.state.class.image
    }

    axios.post('http://localhost:5000/classes/add', classe)
     .then(res => console.log(res.data));
  }

  handleItemSubmit(e) {
    e.preventDefault();
    const item = {
     key: this.state.item.key,
     name: this.state.item.name,
     type: this.state.item.type,
     bonus: this.state.item.bonus,
     depth: this.state.item.depth,
     stats: this.state.item.stats,
     buildsFrom: this.state.item.buildsFrom,
     buildsInto: this.state.item.buildsInto,
     unique: this.state.item.unique,
     image: this.state.item.image
    }

    axios.post('http://localhost:5000/items/add', item)
     .then(res => console.log(res.data));
  }

  handleOriginSubmit(e) {
    e.preventDefault();
    const origin = {
      key: this.state.origin.key,
      name: this.state.origin.name,
      description: this.state.origin.description,
      bonuses: this.state.origin.bonuses,
      mustBeExact: this.state.origin.mustBeExact,
      image: this.state.origin.image,
    }

    axios.post('http://localhost:5000/origins/add', origin)
      .then(res => console.log(res.data));
  }

  championToggle() {
    this.setState( {championCollapse: !this.state.championCollapse} );
  }

  classToggle() {
    this.setState( {classCollapse: !this.state.classCollapse} );
  }

  itemToggle() {
    this.setState( {itemCollapse: !this.state.itemCollapse} );
  }

  originToggle() {
    this.setState( {originCollapse: !this.state.originCollapse} );
  }

  render() {
      return (
        <div>
            <Card style={{width: "100%"}}>
              <CardHeader>
                <i class="fa-fa-align-justify"></i><strong>Champions</strong>
                <Button color="primary" onClick={this.championToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
              </CardHeader>
              <Collapse isOpen={this.state.championCollapse}>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>ID: </Label>
                      <Input type="number" id="id" name="id" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Key: </Label>
                      <Input type="text" id="key" name="key" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Name: </Label>
                      <Input type="text" id="name" name="name" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Origin: </Label>
                      <Input type="text" id="origin" name="origin" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Class: </Label>
                      <Input type="text" id="class" name="class" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Cost: </Label>
                      <Input type="number" id="cost" name="cost" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Name: </Label>
                      <Input type="text" id="ability" name="abilityName" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Description: </Label>
                      <Input type="text" id="ability" name="abilityDescription" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Type: </Label>
                      <Input type="text" id="ability" name="abilityType" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Mana Cost: </Label>
                      <Input type="number" id="ability" name="manaCost" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Mana Start: </Label>
                      <Input type="number" id="ability" name="manaStart" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Stat Type: </Label>
                      <Input type="text" id="ability" name="abilityStatType" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Stat Value: </Label>
                      <Input type="number" id="ability" name="abilityStatValue" onChange={this.handleChampions} />
                    </FormGroup>
                    </Col>
                    <Col md={6}>
                    <FormGroup>
                      <Label>Damage: </Label>
                      <Input type="number" id="offense" name="damage" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Attack Speed: </Label>
                      <Input type="number" id="offense" name="attackSpeed" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Spell Power: </Label>
                      <Input type="number" id="offense" name="spellPower" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Crit Chance: </Label>
                      <Input type="number" id="offense" name="critChance" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Dodge Chance: </Label>
                      <Input type="number" id="defense" name="dodgeChance" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Range: </Label>
                      <Input type="number" id="offense" name="range" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Health: </Label>
                      <Input type="number" id="defense" name="health" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Armor: </Label>
                      <Input type="number" id="defense" name="armor" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Magic Resist: </Label>
                      <Input type="number" id="defense" name="magicResist" onChange={this.handleChampions} />
                    </FormGroup>
                    </Col>
                    </Row>
                </Form>
                </CardBody>
                <CardFooter>
                  <Button type="button" color="primary" onClick={this.handleChampionSubmit}>Submit</Button>
                </CardFooter>
                </Collapse>
              </Card>
              <Card>
              <CardHeader>
                <i class="fa fa-align-justify"></i><strong>Classes</strong>
                <Button color="primary" onClick={this.classToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
              </CardHeader>
              <Collapse isOpen={this.state.classCollapse}>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Key: </Label>
                        <Input type="text" id="key" name="key" onChange={this.handleClasses} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Name: </Label>
                        <Input type="text" id="name" name="name" onChange={this.handleClasses} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Description: </Label>
                        <Input type="text" id="description" name="description" onChange={this.handleClasses} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Bonuses (Be very specific): </Label>
                        <Input type="text" id="bonuses" name="bonuses" onChange={this.handleClasses} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Must be exact: </Label>
                        <Input type="checkbox" id="exact" name="exact" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Image: </Label>
                        <Input type="text" id="image" name="image" onChange={this.handleClasses} />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="button" color="primary" onClick={this.handleClassSubmit}>Submit</Button>
              </CardFooter>
              </Collapse>
              </Card>
              <Card>
                <CardHeader>
                  <i class="fa fa-align-justify"></i><strong>Origins</strong>
                  <Button color="primary" onClick={this.originToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
                </CardHeader>
                <Collapse isOpen={this.state.originCollapse}>
                <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Key: </Label>
                        <Input type="text" id="key" name="key" onChange={this.handleOrigins} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Name: </Label>
                        <Input type="text" id="name" name="name" onChange={this.handleOrigins} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Description: </Label>
                        <Input type="text" id="description" name="description" onChange={this.handleOrigins} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Bonuses (Be very specific): </Label>
                        <Input type="text" id="bonuses" name="bonuses" onChange={this.handleOrigins} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Must be exact: </Label>
                        <Input type="checkbox" id="exact" name="exact" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Image: </Label>
                        <Input type="text" id="image" name="image" onChange={this.handleOrigins} />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                </CardBody>
                <CardFooter>
                  <Button type="button" color="primary" onClick={this.handleOriginSubmit}>Submit</Button>
                </CardFooter>
                </Collapse>
              </Card>
              <Card>
                <CardHeader>
                  <i class="fa fa-align-justify"></i><strong>Items</strong>
                  <Button color="primary" onClick={this.itemToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
                </CardHeader>
                <Collapse isOpen={this.state.itemCollapse}>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>Key: </Label>
                          <Input type="text" id="key" name="key" onChange={this.handleItems} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Name: </Label>
                          <Input type="text" id="name" name="name" onChange={this.handleItems} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Type: </Label>
                          <Input type="text" id="type" name="type" onChange={this.handleItems} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Bonus: </Label>
                          <Input type="text" id="bonus" name="bonus" onChange={this.handleItems} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Depth: </Label>
                          <Input type="number" id="depth" name="depth" onChange={this.handleItems} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Stats: </Label>
                          <Input type="text" id="stats" name="stats" onChange={this.handleItems} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Builds From: </Label>
                          <Input type="text" id="buildsFrom" name="buildsFrom" onChange={this.handleItems} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Builds Into: </Label>
                          <Input type="text" id="buildsInto" name="buildsInto" onChange={this.handleItems} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Unique (one per champion): </Label>
                          <Input type="checkbox" id="unique" name="unique" />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button type="button" color="primary" onClick={this.handleItemSubmit}>Submit</Button>
                </CardFooter>
                </Collapse>
              </Card>
        </div>
      )
  }
}
export default Create;
