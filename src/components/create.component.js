import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Collapse, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
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
        classe: [],
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
          }
        },
        image: "",
      },
      champTempStrings: {
        origin: "",
        classe: "",
        cost: "",
        statsType: "",
        statsValue: "",
        damage: "",
        health: "",
      },
      classe: {
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        image: "",
      },
      classTempStrings: {
        bonuses: "",
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
      itemTempStrings: {
        stats: "",
        buildsFrom: "",
        buildsInto: "",
      },
      origin: {
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        image: "",
      },
      originTempStrings: {
        bonuses: "",
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
    this.handleJsonInput = this.handleJsonInput.bind(this);
  }

  componentDidMount() {
  }

  handleChampions(event) {
    if (event.target.name === "cost" || event.target.name === "origin" || event.target.name === "classe" || event.target.name === "statsType" ||
        event.target.name === "statsValue" || event.target.name === "damage" || event.target.name === "health") {

    }


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
    this.setState({ classe: classe });
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

  handleClick(event, choose) {
    if (choose === 0) {
      let classe = Object.assign({}, this.state.class);
      classe.mustBeExact = event.target.checked;
      this.setState({classe: classe});
    }
    else if (choose === 1) {
      let origin = Object.assign({}, this.state.origin);
      origin.mustBeExact = event.target.checked;
      this.setState({origin: origin});
    }
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
    else if (event.target.name === "classe") {
      let champion = Object.assign({}, this.state.champion);
      let classe =  event.target.value.split(',');
      champion.classe = [];
      for (let i = 0; i < classe.length; i++) {
        champion.classe.push(classe[i]);
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
    else if (event.target.name === "classBonuses") {
      let classe = Object.assign({}, this.state.class);
      let bonuses = JSON.parse(event.target.value);
      for (let i = 0; i < bonuses.length; i++) {
        classe.bonuses[i].needed = parseInt(bonuses[i].needed);
        classe.bonuses[i].effect = bonuses[i].effect;
      }
      this.setState({class: classe});
    }
    else if (event.target.name === "originBonuses") {
      let origin = Object.assign({}, this.state.origin);
      let bonuses = JSON.parse(event.target.value);
      for (let i = 0; i < bonuses.length; i++) {
        origin.bonuses[i].needed = parseInt(bonuses[i].needed);
        origin.bonuses[i].effect = bonuses[i].effect;
      }
      this.setState({origin: origin});
    }
  }

  renderFormGroup(label, type, id, name, handler) {
    return (
      <Fragment>
        <FormGroup>
          <Label>{label}</Label>
          <Input type={type} id={id} name={name} onChange={handler} />
        </FormGroup>
      </Fragment>
    );
  }

  render() {
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
                    {this.renderFormGroup("ID: ", "number", "id", "id", this.handleChampions)}
                    {this.renderFormGroup("Key: ", "text", "key", "key", this.handleChampions)}
                    {this.renderFormGroup("Name: ", "text", "name", "name", this.handleChampions)}
                    {this.renderFormGroup("Cost: ", "text", "cost", "cost", this.handleJsonInput)}
                    {this.renderFormGroup("Origin: ", "text", "origin", "origin", this.handleJsonInput)}
                    {this.renderFormGroup("Class: ", "text", "classe", "classe", this.handleJsonInput)}
                    {this.renderFormGroup("Ability Name: ", "text", "ability", "name", this.handleChampions)}
                    {this.renderFormGroup("Ability Description: ", "text", "ability", "description", this.handleChampions)}
                    {this.renderFormGroup("Ability Type: ", "text", "ability", "type", this.handleChampions)}
                    {this.renderFormGroup("Mana Cost: ", "number", "ability", "manaCost", this.handleChampions)}
                    {this.renderFormGroup("Mana Start: ", "number", "ability", "manaStart", this.handleChampions)}
                    {this.renderFormGroup("Ability Stat Type: ", "text", "abilityStats", "type", this.JsonInput)}
                    {this.renderFormGroup("Ability Stat Value: ", "text", "abilityStats", "value", this.JsonInput)}
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
                    {this.renderFormGroup("Bonuses: ", "text", "bonuses", "classBonuses", this.handleJsonInput)}
                    {this.renderFormGroup("Image: ", "text", "image", "image", this.handleClasses)}
                    <FormGroup>
                    <Row>
                      <Col md={1}><Label>Must be exact: </Label></Col>
                      <Col md={1}><Input type="checkbox" id="exact" name="exact" onClick={event => this.handleClick(event, 0)}/></Col>
                      </Row>
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
                    {this.renderFormGroup("Key: ", "text", "key", "key", this.handleOrigins)}
                    {this.renderFormGroup("Name: ", "text", "name", "name", this.handleOrigins)}
                    {this.renderFormGroup("Description: ", "text", "description", "description", this.handleOrigins)}
                    {this.renderFormGroup("Bonuses: ", "text", "bonuses", "originBonuses", this.handleJsonInput)}
                    {this.renderFormGroup("Image: ", "text", "image", "image", this.handleOrigins)}
                    <FormGroup>
                      <Row>
                        <Col md={1}><Label>Must be exact: </Label></Col>
                        <Col md={1}><Input type="checkbox" id="exact" name="exact" onClick={event => this.handleClick(event, 1)}/></Col>
                      </Row>
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
                        {this.renderFormGroup("Key: ", "text", "key", "key", this.handleItems)}
                        {this.renderFormGroup("Name: ", "text", "name", "name", this.handleItems)}
                        {this.renderFormGroup("Type: ", "text", "type", "type", this.handleItems)}
                        {this.renderFormGroup("Bonus: ", "text", "bonus", "bonus", this.handleItems)}
                        {this.renderFormGroup("Depth: ", "number", "depth", "depth", this.handleItems)}
                        {this.renderFormGroup("Stats: ", "text", "stats", "stats", this.handleItems)}
                        {this.renderFormGroup("Builds From: ", "text", "buildsFrom", "buildsFrom", this.handleItems)}
                        {this.renderFormGroup("Builds Into: ", "text", "buildsInto", "buildsInto", this.handleItems)}
                        <FormGroup>
                          <Row>
                            <Col md={1}><Label>Unique (one per champion): </Label></Col>
                            <Col md={1}><Input type="checkbox" id="unique" name="unique" onChange={this.handleItems} /></Col>
                          </Row>
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
