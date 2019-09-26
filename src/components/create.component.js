import React, { Component } from 'react';
import {Button, Row, Col, Collapse, Form, FormGroup, Card, CardHeader,
        CardBody, Label, Input} from 'reactstrap';
import Select from 'react-select';
import Formgroups from '../sub-components/formgroups'

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      championCollapse: false,
      classCollapse: false,
      itemCollapse: false,
      originCollapse: false,

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
        image: "",
      },
      item: {
        key: "",
        name: "",
        type: "",
        bonus: "",
        depth: 0,
        stats: [],
        tier: [],
        buildsInto: [],
        unique: false,
        image: "",
      },
      origin: {
        key: "",
        name: "",
        description: "",
        bonuses: [],
        image: "",
      },
    }
    this.handleInputs = this.handleInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.championToggle = this.championToggle.bind(this);
    this.classToggle = this.classToggle.bind(this);
    this.itemToggle = this.itemToggle.bind(this);
    this.originToggle = this.originToggle.bind(this);
  }

  handleInputs(event) {


  }

  handleChampions(event) {

  }

  handleClasses(event) {

  }

  handleItems(event) {

  }

  handleOrigins(event) {

  }

  handleSubmit(e) {
    e.preventDefault();


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

                    <Formgroups name="ID:" type="number" id="id" onChange={this.handleInputs}/>
                    <FormGroup>
                      <Label>Key: </Label>
                      <Input type="text" id="key" name="key" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Name: </Label>
                      <Input type="text" id="name" name="name" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Origin: </Label>
                      <Input type="text" id="origin" name="origin" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Class: </Label>
                      <Input type="text" id="class" name="class" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Cost: </Label>
                      <Input type="number" id="cost" name="cost" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Name: </Label>
                      <Input type="text" id="abilityName" name="abilityName" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Description: </Label>
                      <Input type="text" id="abilityDescription" name="abilityDescription" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Type: </Label>
                      <Input type="text" id="abilityType" name="abilityType" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Mana Cost: </Label>
                      <Input type="number" id="manaCost" name="manaCost" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Mana Start: </Label>
                      <Input type="number" id="manaStart" name="manaStart" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Stat Type: </Label>
                      <Input type="text" id="abilityStatType" name="abilityStatType" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Stat Value: </Label>
                      <Input type="number" id="abilityStatValue" name="abilityStatValue" onChange={this.handleInputs} />
                    </FormGroup>
                    </Col>
                    <Col md={6}>
                    <FormGroup>
                      <Label>Damage: </Label>
                      <Input type="number" id="damage" name="damage" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Attack Speed: </Label>
                      <Input type="number" id="attackSpeed" name="attackSpeed" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Spell Power: </Label>
                      <Input type="number" id="spellPower" name="spellPower" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Crit Chance: </Label>
                      <Input type="number" id="critChance" name="critChance" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Dodge Chance: </Label>
                      <Input type="number" id="dodgeChance" name="dodgeChance" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Range: </Label>
                      <Input type="number" id="range" name="range" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Health: </Label>
                      <Input type="number" id="health" name="health" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Armor: </Label>
                      <Input type="number" id="armor" name="armor" onChange={this.handleInputs} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Magic Resist: </Label>
                      <Input type="number" id="magicResist" name="magicResist" onChange={this.handleInputs} />
                    </FormGroup>
                    </Col>
                    </Row>
                </Form>
                </CardBody>
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
                        <Input type="text" id="key" name="key" onChange={this.handleInputs} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Name: </Label>
                        <Input type="text" id="name" name="name" onChange={this.handleInputs} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Description: </Label>
                        <Input type="text" id="description" name="description" onChange={this.handleInputs} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Bonuses (Be very specific): </Label>
                        <Input type="text" id="bonuses" name="bonuses" onChange={this.handleInputs} />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
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
                        <Input type="text" id="key" name="key" onChange={this.handleInputs} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Name: </Label>
                        <Input type="text" id="name" name="name" onChange={this.handleInputs} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Description: </Label>
                        <Input type="text" id="description" name="description" onChange={this.handleInputs} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Bonuses (Be very specific): </Label>
                        <Input type="text" id="bonuses" name="bonuses" onChange={this.handleInputs} />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                </CardBody>
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
                          <Input type="text" id="key" name="key" onChange={this.handleInputs} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Name: </Label>
                          <Input type="text" id="name" name="name" onChange={this.handleInputs} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Type: </Label>
                          <Input type="text" id="type" name="type" onChange={this.handleInputs} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Bonus: </Label>
                          <Input type="text" id="bonus" name="bonus" onChange={this.handleInputs} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Depth: </Label>
                          <Input type="number" id="depth" name="depth" onChange={this.handleInputs} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Stats: </Label>
                          <Input type="text" id="stats" name="stats" onChange={this.handleInputs} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Tier: </Label>
                          <Input type="text" id="tier" name="tier" onChange={this.handleInputs} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Builds Into: </Label>
                          <Input type="text" id="buildsInto" name="buildsInto" onChange={this.handleInputs} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Unique (one per champion): </Label>
                          <Input type="checkbox" id="unique" name="unique" />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                </Collapse>
              </Card>
        </div>
      )
  }
}
export default Create;
