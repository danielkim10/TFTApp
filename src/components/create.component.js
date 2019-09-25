import React, { Component } from 'react';
import {Row, Col, Form, FormGroup, Card, CardHeader, CardBody, Label, Input} from 'reactstrap';
import Select from 'react-select';

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      },
      class: {
        key: "",
        name: "",
        description: "",
        bonuses: []
      },
      item: {
        key: "",
        name: "",
        type: "",
        bonus: "",
        depth: 0,
        stats: [],
        tier: [],
        buildsInto: []
      },
      origin: {
        key: "",
        name: "",
        description: "",
        bonuses: []
      },
    }
    this.handleInputs.bind(this);
    this.handleSubmit.bind(this);
  }

  handleInputs() {


  }

  handleSubmit() {


  }

  render() {
      return (
        <div>
            <Card style={{width: "90%"}}>
              <CardHeader>
                <i class="fa-fa-align-justify"></i><strong>Champions</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>ID: </Label>
                      <Input type="number" id="id" name="id" onChange={this.handleInputs} />
                    </FormGroup>
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
              </Card>
              <Card>
              <CardHeader>
                <i class="fa fa-align-justify"></i><strong>Classes</strong>
              </CardHeader>
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
              </Card>
              <Card>
                <CardHeader>
                  <i class="fa fa-align-justify"></i><strong>Origin</strong>
                </CardHeader>
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
              </Card>
        </div>
      )
  }
}
export default Create;
