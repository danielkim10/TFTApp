import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Collapse, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import Select from 'react-select';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import axios from 'axios';

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
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/origins/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            origins: response.data.map(origin => origin)
          })
        }
      });
    axios.get('http://localhost:5000/classes/')
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              classes: response.data.map(classe => classe)
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

    axios.post('http://localhost:5000/champions/add', champion)
      .then(res => console.log(res.data))
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
     .then(res => console.log(res.data))
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
     .then(res => console.log(res.data))
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
      .then(res => console.log(res.data))
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

  handleSelect(event, choose) {
    let champion = Object.assign({}, this.state.champion);
    if (choose === 0) {
      champion.origin = event;
    }
    else if (choose === 1) {
      champion.class = event;
    }

    this.setState({champion: champion});
  }

  renderFormGroup(label, type, id, name, handler) {
    return (
      <Fragment>
        <FormGroup>
          <Label>{label}</Label>
          <Input type={type} id={id} name={name} handler={handler} />
        </FormGroup>
      </Fragment>
    );
  }

  render() {
    const origins = [];
    for (let i = 0; i < this.state.origins.length; i++) {
      origins.push({value: this.state.origins[i].key, label: this.state.origins[i].name});
    }

    const classes = [];
    for (let j = 0; j < this.state.classes.length; j++) {
      classes.push({value: this.state.classes[j].key, label: this.state.classes[j].name});
    }

      return (
        <div>
        <ToastsContainer store={ToastsStore}/>
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
                    {/*<FormGroup>
                      <Label>ID: </Label>
                      <Input type="number" id="id" name="id" onChange={this.handleChampions} />
                    </FormGroup>*/}
                    {this.renderFormGroup("ID: ", "number", "id", "id", this.handleChampions)}
                    {this.renderFormGroup("Key: ", "text", "key", "key", this.handleChampions)}
                    {this.renderFormGroup("Name: ", "text", "name", "name", this.handleChampions)}
                    {this.renderFormGroup("Cost: ", "text", "cost", "cost", this.handleChampions)}
                    {this.renderFormGroup("Ability Name: ", "text", "ability", "name", this.handleChampions)}
                    {this.renderFormGroup("Ability Description: ", "text", "ability", "description", this.handleChampions)}
                    {this.renderFormGroup("Ability Type: ", "text", "ability", "type", this.handleChampions)}
                    {this.renderFormGroup("Mana Cost: ", "number", "ability", "manaCost", this.handleChampions)}
                    {this.renderFormGroup("Mana Start: ", "number", "ability", "manaStart", this.handleChampions)}
                    {this.renderFormGroup("Ability Stat Type: ", "text", "abilityStats", "type", this.handleChampions)}
                    {this.renderFormGroup("Ability Stat Value: ", "text", "abilityStats", "value", this.handleChampions)}
                    {/*<FormGroup>
                      <Label>Key: </Label>
                      <Input type="text" id="key" name="key" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Name: </Label>
                      <Input type="text" id="name" name="name" onChange={this.handleChampions} />
                    </FormGroup>*/}
                    <FormGroup>
                      <Label>Origin: </Label>
                      <Select options={origins} className="basic-multi-select" classNamePrefix="select" isMulti id="origin" name="origin" onChange={event => this.handleSelect(event, 0)}/>
                    </FormGroup>
                    <FormGroup>
                      <Label>Class: </Label>
                      <Select options={classes} className="basic-multi-select" classNamePrefix="select" isMulti id="class" name="class" onChange={event => this.handleSelect(event, 1)}/>
                    </FormGroup>
                    {/*<FormGroup>
                      <Label>Cost: </Label>
                      <Input type="number" id="cost" name="cost" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Name: </Label>
                      <Input type="text" id="ability" name="name" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Description: </Label>
                      <Input type="text" id="ability" name="description" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Type: </Label>
                      <Input type="text" id="ability" name="type" onChange={this.handleChampions} />
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
                      <Input type="text" id="abilityStats" name="type" onChange={this.handleChampions} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Ability Stat Value: </Label>
                      <Input type="number" id="abilityStats" name="value" onChange={this.handleChampions} />
                    </FormGroup>*/}
                    </Col>
                    <Col md={6}>
                    {this.renderFormGroup("Damage: ", "text", "offense", "damage", this.handleChampions)}
                    {this.renderFormGroup("Attack Speed: ", "number", "offense", "attackSpeed", this.handleChampions)}
                    {this.renderFormGroup("Spell Power: ", "number", "offense", "spellPower", this.handleChampions)}
                    {this.renderFormGroup("Crit Chance: ", "number", "offense", "critChance", this.handleChampions)}
                    {this.renderFormGroup("Dodge Chance: ", "number", "defense", "dodgeChance", this.handleChampions)}
                    {this.renderFormGroup("Range: ", "number", "offense", "range", this.handleChampions)}
                    {this.renderFormGroup("Health: ", "text", "defense", "health", this.handleChampions)}
                    {this.renderFormGroup("Armor: ", "number", "defense", "armor", this.handleChampions)}
                    {this.renderFormGroup("Magic Resist: ", "number", "defense", "magicResist", this.handleChampions)}
                    {/*<FormGroup>
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
                    </FormGroup>*/}
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
                    {this.renderFormGroup("Key: ", "text", "key", "key", this.handleClasses)}
                    {this.renderFormGroup("Name: ", "text", "name", "name", this.handleClasses)}
                    {this.renderFormGroup("Description: ", "text", "description", "description", this.handleClasses)}
                    {this.renderFormGroup("Bonuses: ", "text", "bonuses", "bonuses", this.handleClasses)}
                    {this.renderFormGroup("Image: ", "text", "image", "image", this.handleClasses)}
                    <FormGroup>
                      <Label>Must be exact: </Label>
                      <Input type="checkbox" id="exact" name="exact" />
                    </FormGroup>
                      {/*<FormGroup>
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
                      </FormGroup>*/}
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
                    {this.renderFormGroup("Key: ", "text", "key", "key", this.handleOrigins)}
                    {this.renderFormGroup("Name: ", "text", "name", "name", this.handleOrigins)}
                    {this.renderFormGroup("Description: ", "text", "description", "description", this.handleOrigins)}
                    {this.renderFormGroup("Bonuses: ", "text", "bonuses", "bonuses", this.handleOrigins)}
                    {this.renderFormGroup("Image: ", "text", "image", "image", this.handleOrigins)}
                    <FormGroup>
                      <Label>Must be exact: </Label>
                      <Input type="checkbox" id="exact" name="exact" />
                    </FormGroup>
                    {/*
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
                      </FormGroup>*/}
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
                        {this.renderFormGroup("Key: ", "text", "key", "key", this.handleItems)}
                        {this.renderFormGroup("Name: ", "text", "name", "name", this.handleItems)}
                        {this.renderFormGroup("Type: ", "text", "type", "type", this.handleItems)}
                        {this.renderFormGroup("Bonus: ", "text", "bonus", "bonus", this.handleItems)}
                        {this.renderFormGroup("Depth: ", "number", "depth", "depth", this.handleItems)}
                        {this.renderFormGroup("Stats: ", "text", "stats", "stats", this.handleItems)}
                        {this.renderFormGroup("Builds From: ", "text", "buildsFrom", "buildsFrom", this.handleItems)}
                        {this.renderFormGroup("Builds Into: ", "text", "buildsInto", "buildsInto", this.handleItems)}
                        {/*<FormGroup>
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
                          <Input type="checkbox" id="unique" name="unique" onChange={this.handleItems} />
                        </FormGroup>*/}
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
