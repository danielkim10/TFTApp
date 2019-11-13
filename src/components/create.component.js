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
        tier: 0,
        ability: {
          name: "",
          description: "",
          type: "",
          manaCost: 0,
          manaStart: 0,
          stats: [],
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
        set: 0,
        image: "",
        icon: "",
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
        id: 0,
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        set: 0,
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
        cannotEquip: "",
        set: 0,
        image: "",
      },
      itemTempStrings: {
        stats: "",
        buildsFrom: "",
        buildsInto: "",
      },
      origin: {
        id: 0,
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        set: 0,
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
  }

  componentDidMount() {
  }

  handleChampions(event) {
    if (event.target.name === "cost" || event.target.name === "origin" || event.target.name === "classe" || event.target.name === "statsType" ||
        event.target.name === "statsValue" || event.target.name === "damage" || event.target.name === "health") {
          let champTempStrings = Object.assign({}, this.state.champTempStrings);
          champTempStrings[event.target.name] = event.target.value;
          this.setState({ champTempStrings: champTempStrings });
    }

    else {
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
  }

  handleClasses(event) {
    if (event.target.name === "classBonuses") {
        let classTempStrings = Object.assign({}, this.state.classTempStrings);
        classTempStrings[event.target.name] = event.target.value;
        this.setState({ classTempStrings: classTempStrings });
    }
    else {
      let classe = Object.assign({}, this.state.class);
      classe[event.target.id] = event.target.value;
      this.setState({ classe: classe });
    }
  }

  handleItems(event) {
    if (event.target.name === "stats" || event.target.name === "buildsFrom" || event.target.name === "buildsInto") {
      let itemTempStrings = Object.assign({}, this.state.itemTempStrings);
      itemTempStrings[event.target.name] = event.target.value;
      this.setState({ itemTempStrings: itemTempStrings });
    }
    else {
      let item = Object.assign({}, this.state.item);
      item[event.target.id] = event.target.value;
      this.setState({ item: item });
    }
  }

  handleOrigins(event) {
    if (event.target.name === "originBonuses") {
      let originTempStrings = Object.assign({}, this.state.originTempStrings);
      originTempStrings[event.target.name] = event.target.value;
      this.setState({ originTempStrings: originTempStrings });
    }
    else {
      let origin = Object.assign({}, this.state.origin);
      origin[event.target.id] = event.target.value;
      this.setState({ origin: origin });
    }
  }

  handleChampionSubmit(e) {
    let _champion = Object.assign({}, this.state.champion);
    let cost = [];
    let damage = [];
    let health = [];
    let stats = [];
    let statsValue = [];
    let costString = this.state.champTempStrings.cost.split(',');
    let origin = this.state.champTempStrings.origin.split(',');
    let classe = this.state.champTempStrings.classe.split(',');
    let damageString = this.state.champTempStrings.damage.split(',');
    let healthString = this.state.champTempStrings.health.split(',');
    let statsType = this.state.champTempStrings.statsType.split(',');
    let statsValueString = this.state.champTempStrings.statsValue.split('/');

    for (let subString in costString) {
      cost.push(parseInt(costString[subString]));
    }
    for (let subString in damageString) {
      damage.push(parseInt(damageString[subString]));
    }
    for (let subString in healthString) {
      health.push(parseInt(healthString[subString]));
    }
    for (let k in statsValueString) {
      let _statsValue = statsValueString[k].split(',');
      for (let l in _statsValue) {
          _statsValue[l] = parseFloat(_statsValue[l]);
      }
      statsValue.push(_statsValue);
      stats.push({type: statsType[k], value: statsValue[k]});
    }
    _champion.cost = cost;
    _champion.origin = origin;
    _champion.classe = classe;
    _champion.stats.offense.damage = damage;
    _champion.stats.defense.health = health;
    _champion.ability.stats = stats;

    this.setState({ champion: _champion }, function() {
      e.preventDefault();
      const champion = {
       id: this.state.champion.id,
       key: this.state.champion.key,
       name: this.state.champion.name,
       origin: this.state.champion.origin,
       classe: this.state.champion.classe,
       cost: this.state.champion.cost,
       tier: this.state.champion.tier,
       ability: this.state.champion.ability,
       stats: this.state.champion.stats,
       set: this.state.champion.set,
       image: this.state.champion.image,
       icon: this.state.champion.icon
      }
      axios.post('http://localhost:5000/champions/add', champion)
        .then(res => console.log(res.data))
        window.location = '/';
    });
  }

  handleClassSubmit(e) {
    let _classe = Object.assign({}, this.state.classe);
    let needed = [];
    let effect = [];
    let bonusString = this.state.classTempStrings.bonuses.split('/');

    let neededString = bonusString[0].split(',');
    for (let subString in neededString) {
      needed.push(parseInt(subString));
    }
    let effectString = bonusString[1].split(',');
    for (let subString in effectString) {
      effect.push(subString);
    }
    for (let i = 0; i < neededString.length; i++) {
      _classe.bonuses.push({ needed: needed[1], effect: effect[1] });
    }
    this.setState({ classe: _classe }, function() {
      e.preventDefault();
        const classe = {
         id: this.state.classe.id,
         key: this.state.classe.key,
         name: this.state.classe.name,
         description: this.state.classe.description,
         bonuses: this.state.classe.bonuses,
         mustBeExact: this.state.classe.mustBeExact,
         set: this.state.classe.set,
         image: this.state.classe.image
        }
      axios.post('http://localhost:5000/classes/add', classe)
       .then(res => console.log(res.data))
       window.location = '/';
     });
  }

  handleItemSubmit(e) {
    let _item = Object.assign({}, this.state.item);
    let stats = [];
    let statsName = [];
    let statsLabel = [];
    let statsValue = [];
    let buildsFrom = [];
    let buildsInto = [];
    let statsString = this.state.itemTempStrings.stats.split('/');
    for (let subString in statsString) {
      let _subString = statsString[subString].split(',');
      statsName.push(_subString[0]);
      statsLabel.push(_subString[1]);
      statsValue.push(_subString[2]);
    }
    for (let i = 0; i < statsName.length; i++) {
      stats.push({ name: statsName[i], label: statsLabel[i], value: statsValue[i] });
    }

    if (_item.depth === "1") {
      buildsFrom = this.state.itemTempStrings.buildsFrom.split(',');
    }
    if (_item.depth === "2") {
      buildsInto = this.state.itemTempStrings.buildsInto.split(',');
    }
    _item.stats = stats;
    _item.buildsFrom = buildsFrom;
    _item.buildsInto = buildsInto;

    this.setState({ item: _item }, function() {
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
       cannotEquip: this.state.item.cannotEquip,
       set: this.state.item.set,
       image: this.state.item.image
      }
      axios.post('http://localhost:5000/items/add', item)
       .then(res => console.log(res.data))
       window.location = '/';
     });
  }

  handleOriginSubmit(e) {

    let _origin = Object.assign({}, this.state.origin);
    let needed = [];
    let effect = [];
    let bonusString = this.state.originTempStrings.bonuses.split('/');
    let neededString = bonusString[0].split(',');
    for (let subString in neededString) {
      needed.push(parseInt(subString));
    }
    let effectString = bonusString[1].split(',');
    for (let subString in effectString) {
      effect.push(subString);
    }
    for (let i = 0; i < neededString.length; i++) {
      _origin.bonuses.push({ needed: needed[i], effect: effect[i] });
    }
    this.setState({ origin: _origin }, function() {
      e.preventDefault();
      const origin = {
        id: this.state.origin.id,
        key: this.state.origin.key,
        name: this.state.origin.name,
        description: this.state.origin.description,
        bonuses: this.state.origin.bonuses,
        mustBeExact: this.state.origin.mustBeExact,
        set: this.state.origin.set,
        image: this.state.origin.image,
      }
      axios.post('http://localhost:5000/origins/add', origin)
        .then(res => console.log(res.data))
        window.location = '/';
    });
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
    else if (choose === 2) {
      let item = Object.assign({}, this.state.item);
      item.unique = event.target.checked;
      this.setState({item: item});
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
                    {this.renderFormGroup("Cost: ", "text", "cost", "cost", this.handleChampions)}
                    {this.renderFormGroup("Tier: ", "number", "tier", "tier", this.handleChampions)}
                    {this.renderFormGroup("Origin: ", "text", "origin", "origin", this.handleChampions)}
                    {this.renderFormGroup("Class: ", "text", "classe", "classe", this.handleChampions)}
                    {this.renderFormGroup("Ability Name: ", "text", "ability", "name", this.handleChampions)}
                    {this.renderFormGroup("Ability Description: ", "text", "ability", "description", this.handleChampions)}
                    {this.renderFormGroup("Ability Type: ", "text", "ability", "type", this.handleChampions)}
                    {this.renderFormGroup("Mana Cost: ", "number", "ability", "manaCost", this.handleChampions)}
                    {this.renderFormGroup("Mana Start: ", "number", "ability", "manaStart", this.handleChampions)}
                    {this.renderFormGroup("Ability Stat Type: ", "text", "abilityStats", "statsType", this.handleChampions)}
                    {this.renderFormGroup("Ability Stat Value: ", "text", "abilityStats", "statsValue", this.handleChampions)}
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
                    {this.renderFormGroup("Set: ", "number", "set", "set", this.handleChampions)}
                    {this.renderFormGroup("Image: ", "text", "image", "image", this.handleChampions)}
                    {this.renderFormGroup("Icon: ", "text", "icon", "icon", this.handleChampions)}
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
                    {this.renderFormGroup("Id: ", "number", "id", "id", this.handleClasses)}
                    {this.renderFormGroup("Key: ", "text", "key", "key", this.handleClasses)}
                    {this.renderFormGroup("Name: ", "text", "name", "name", this.handleClasses)}
                    {this.renderFormGroup("Description: ", "text", "description", "description", this.handleClasses)}
                    {this.renderFormGroup("Bonuses: ", "text", "bonuses", "classBonuses", this.handleClasses)}
                    {this.renderFormGroup("Set: ", "number", "set", "set", this.handleClasses)}
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
                    {this.renderFormGroup("Id: ", "number", "id", "id", this.handleOrigins)}
                    {this.renderFormGroup("Key: ", "text", "key", "key", this.handleOrigins)}
                    {this.renderFormGroup("Name: ", "text", "name", "name", this.handleOrigins)}
                    {this.renderFormGroup("Description: ", "text", "description", "description", this.handleOrigins)}
                    {this.renderFormGroup("Bonuses: ", "text", "bonuses", "originBonuses", this.handleOrigins)}
                    {this.renderFormGroup("Set: ", "number", "set", "set", this.handleOrigins)}
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
                            <Col md={1}><Input type="checkbox" id="unique" name="unique" onClick={event => this.handleClick(event, 2)} /></Col>
                          </Row>
                        </FormGroup>
                        {this.renderFormGroup("Cannot Equip:", "text", "cannotEquip", "cannotEquip", this.handleItems)}
                        {this.renderFormGroup("Set: ", "number", "set", "set", this.handleItems)}
                        {this.renderFormGroup("Image: ", "text", "image", "image", this.handleItems)}
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
