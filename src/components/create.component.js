import React, { Component } from 'react';
import {Button, Row, Col, Collapse, Card, CardHeader,
        CardBody, CardFooter} from 'reactstrap';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import { renderFormGroup, renderFormGroupCheckbox } from '../sub-components/formgroup.js';
import { postData } from '../api-helper/api.js';

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      championCollapse: false,
      classCollapse: false,
      itemCollapse: false,
      originCollapse: false,
      hexCollapse: false,

      champion: {
        id: 0,
        key: "",
        name: "",
        origin: [],
        originTempString: "",
        classe: [],
        classeTempString: "",
        cost: 0,
        costTempString: "",
        ability: {
          name: "",
          description: "",
          type: "",
          manaCost: 0,
          manaStart: 0,
          stats: [],
          statsTypeTempString: "",
          statsValueTempString: "",
          statsUnitTempString: "",
        },
        stats: {
          offense: {
            damage: [0, 0, 0],
            damageTempString: "",
            attackSpeed: 0,
            spellPower: 0,
            critChance: 0,
            critDamage: 0,
            range: 0,
          },
          defense: {
            health: [0, 0, 0],
            healthTempString: "",
            armor: 0,
            magicResist: 0,
            dodgeChance: 0,
          }
        },
        set: 0,
        setTempString: "",
        image: "",
        icon: "",
        abilityIcon: "",
      },
      champTempStrings: {
        origin: "",
        classe: "",
        cost: "",
        statsType: "",
        statsValue: "",
        statsUnit: "",
        damage: "",
        health: "",
      },
      classe: {
        id: 0,
        key: "",
        name: "",
        description: "",
        bonuses: [],
        bonusesTempString: "",
        mustBeExact: false,
        set: 0,
        image: "",
      },
      classTempStrings: {
        bonuses: "",
      },
      item: {
        id: 0,
        key: [],
        name: [],
        type: "",
        bonus: [],
        depth: 0,
        stats: [],
        statsTempString: "",
        buildsFrom: [],
        buildsFromTempString: "",
        buildsInto: [],
        buildsIntoTempString: "",
        unique: [],
        cannotEquip: "",
        set: [],
        image: [],
      },
      itemTempStrings: {
        key: "",
        name: "",
        bonus: "",
        stats: "",
        buildsFrom: "",
        buildsInto: "",
        unique: "",
        set: "",
        image: "",
      },
      origin: {
        id: 0,
        key: "",
        name: "",
        description: "",
        bonuses: [],
        bonusesTempString: "",
        mustBeExact: false,
        set: "",
        image: "",
      },
      originTempStrings: {
        bonuses: "",
      },
      hex: {
        key: "",
        name: "",
        description: "",
        bonus: {},
        bonusString: "",
        set: 0,
        image: "",
      }
    }

    this.handleChampions = this.handleChampions.bind(this);
    this.handleChampionSubmit = this.handleChampionSubmit.bind(this);
    this.handleClasses = this.handleClasses.bind(this)
    this.handleClassSubmit = this.handleClassSubmit.bind(this);
    this.handleItems = this.handleItems.bind(this);
    this.handleItemSubmit = this.handleItemSubmit.bind(this);
    this.handleOrigins = this.handleOrigins.bind(this);
    this.handleOriginSubmit = this.handleOriginSubmit.bind(this);
    this.handleHexes =this.handleHexes.bind(this);
    this.handleHexSubmit = this.handleHexSubmit.bind(this);
    this.championToggle = this.championToggle.bind(this);
    this.classToggle = this.classToggle.bind(this);
    this.itemToggle = this.itemToggle.bind(this);
    this.originToggle = this.originToggle.bind(this);
    this.hexToggle = this.hexToggle.bind(this);
  }

  componentDidMount() {
  }

  handleChampions(event) {
    // if (event.target.name === "cost" || event.target.name === "origin" || event.target.name === "classe" || event.target.name === "statsType" ||
    //     event.target.name === "statsValue" || event.target.name === "damage" || event.target.name === "health") {
    //       let champTempStrings = Object.assign({}, this.state.champTempStrings);
    //       champTempStrings[event.target.name] = event.target.value;
    //       this.setState({ champTempStrings: champTempStrings });
    // }

    // else {
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
    // }
  }

  handleClasses(event) {
    // if (event.target.name === "classBonuses") {
    //     let classTempStrings = Object.assign({}, this.state.classTempStrings);
    //     classTempStrings[event.target.name] = event.target.value;
    //     this.setState({ classTempStrings: classTempStrings });
    // }
    // else {
    let classe = Object.assign({}, this.state.classe);
    classe[event.target.id] = event.target.value;
    this.setState({ classe: classe });
    // }
  }

  handleItems(event) {
    // if (event.target.name === "stats" || event.target.name === "buildsFrom" || event.target.name === "buildsInto") {
    //   let itemTempStrings = Object.assign({}, this.state.itemTempStrings);
    //   itemTempStrings[event.target.name] = event.target.value;
    //   this.setState({ itemTempStrings: itemTempStrings });
    // }
    // else {
      let item = Object.assign({}, this.state.item);
      item[event.target.id] = event.target.value;
      this.setState({ item: item });
    // }
  }

  handleOrigins(event) {
    // if (event.target.name === "originBonuses") {
    //   let originTempStrings = Object.assign({}, this.state.originTempStrings);
    //   originTempStrings[event.target.name] = event.target.value;
    //   this.setState({ originTempStrings: originTempStrings });
    // }
    // else {
      let origin = Object.assign({}, this.state.origin);
      origin[event.target.id] = event.target.value;
      this.setState({ origin: origin });
    // }
  }

  handleHexes(event) {
    let hex = Object.assign({}, this.state.hex);
    hex[event.target.id] = event.target.value;
    this.setState({hex: hex});
  }

  handleChampionSubmit(e) {
    let _champion = Object.assign({}, this.state.champion);
    // let cost = [];
    let damage = [];
    let health = [];
    let stats = [];
    let statsValue = [];
    // let costString = this.state.champTempStrings.cost.split(',');
    let origin = this.state.champion.originTempString.split(',');
    let classe = this.state.champion.classeTempString.split(',');
    let damageString = this.state.champion.stats.offense.damageTempString.split(',');
    let healthString = this.state.champion.stats.defense.healthTempString.split(',');
    let statsType = this.state.champion.ability.stats.statsTypeTempString.split(',');
    let statsValueString = this.state.champion.ability.stats.statsValueTempString.split('/');
    let statsUnit = this.state.champion.ability.stats.statsUnitTempString.split(',');

    // for (let subString in costString) {
    //   cost.push(parseInt(costString[subString]));
    // }
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
      stats.push({type: statsType[k], value: statsValue[k], unit: statsUnit[k]});
    }
    // _champion.cost = cost;
    _champion.origin = origin;
    _champion.classe = classe;
    _champion.stats.offense.damage = damage;
    _champion.stats.defense.health = health;
    _champion.ability.stats = stats;
    _champion.set = this.state.champion.setTempString.split(',');

    this.setState({ champion: _champion }, function() {
      e.preventDefault();
      const champion = {
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
       abilityIcon: this.state.champion.abilityIcon,
      }
      postData('champions', champion, '/');
    });
  }

  handleClassSubmit(e) {
    let _classe = Object.assign({}, this.state.classe);
    let bonusString = this.state.classe.bonusesTempString.split('^');
    for (let i in bonusString) {
      let bonusString1 = bonusString[i].split(',');
      _classe.bonuses.push({needed: parseInt(bonusString1[0]), effect: bonusString1[1]});
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
        postData('classes', classe, '/');
     });
  }

  handleItemSubmit(e) {
    let _item = Object.assign({}, this.state.item);
    let stats = [];
    let buildsFrom = [];
    let buildsInto = [];
    let statsString = this.state.item.statsTempString.split('/');
    for (let subString in statsString) {
      let _subString = statsString[subString].split(',');
      stats.push({ name: _subString[0], label: _subString[1], value: _subString[2] });
    }

    if (_item.depth === "1") {
      buildsFrom = this.state.item.buildsFromTempString.split(',');
    }
    if (_item.depth === "2") {
      buildsInto = this.state.item.buildsIntoTempString.split(',');
    }
    _item.stats = stats;
    _item.buildsFrom = buildsFrom;
    _item.buildsInto = buildsInto;

    this.setState({ item: _item }, function() {
      e.preventDefault();
      const item = {
       id: this.state.item.id,
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
      postData('items', item, '/');
     });
  }

  handleOriginSubmit(e) {
    let _origin = Object.assign({}, this.state.origin);
    let bonusString = this.state.origin.bonusesTempString.split('^');
    for (let i in bonusString) {
      let bonusString1 = bonusString[i].split(',');
      _origin.bonuses.push({needed: parseInt(bonusString1[0]), effect: bonusString1[1]});
    }

    // let neededString = bonusString[0].split(',');
    // for (let subString in neededString) {
    //   needed.push(parseInt(subString));
    // }
    // let effectString = bonusString[1].split(',');
    // for (let subString in effectString) {
    //   effect.push(subString);
    // }
    // for (let i = 0; i < neededString.length; i++) {
    //   _origin.bonuses.push({ needed: needed[i], effect: effect[i] });
    // }
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
      postData('origins', origin, '/');
    });
  }

  handleHexSubmit(e) {
    let _hex = Object.assign({}, this.state.hex);
    let bonusString = _hex.bonusString.split(',');
    _hex.bonus.name = bonusString[0];
    _hex.bonus.label = bonusString[1];
    _hex.bonus.value = bonusString[2];
    this.setState({ hex: _hex }, function() {
      e.preventDefault();
      const hex = {
        key: this.state.hex.key,
        name: this.state.hex.name,
        description: this.state.hex.description,
        bonus: this.state.hex.bonus,
        set: this.state.hex.set,
        image: this.state.hex.image,
      }
      postData('hexes', hex, '/');
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

  hexToggle() {
    this.setState( {hexCollapse: !this.state.hexCollapse} );
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

  render() {
      return (
        <div>
        <ToastsContainer store={ToastsStore}/>
            <Card style={{width: "100%"}}>
              <CardHeader>
                <strong>Champions</strong>
                <Button color="primary" onClick={this.championToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
              </CardHeader>
              <Collapse isOpen={this.state.championCollapse}>
              <CardBody>
                <Row>
                  <Col md={6}>
                    {renderFormGroup("ID: ", "number", "id", "id", this.handleChampions)}
                    {renderFormGroup("Key: ", "text", "key", "key", this.handleChampions)}
                    {renderFormGroup("Name: ", "text", "name", "name", this.handleChampions)}
                    {renderFormGroup("Cost: ", "text", "cost", "cost", this.handleChampions)}
                    {renderFormGroup("Origin: ", "text", "originTempString", "originTempString", this.handleChampions)}
                    {renderFormGroup("Class: ", "text", "classeTempString", "classeTempString", this.handleChampions)}
                    {renderFormGroup("Ability Name: ", "text", "ability", "name", this.handleChampions)}
                    {renderFormGroup("Ability Description: ", "text", "ability", "description", this.handleChampions)}
                    {renderFormGroup("Ability Type: ", "text", "ability", "type", this.handleChampions)}
                    {renderFormGroup("Mana Cost: ", "number", "ability", "manaCost", this.handleChampions)}
                    {renderFormGroup("Mana Start: ", "number", "ability", "manaStart", this.handleChampions)}
                    {renderFormGroup("Ability Stat Type: ", "text", "abilityStats", "statsTypeTempString", this.handleChampions)}
                    {renderFormGroup("Ability Stat Value: ", "text", "abilityStats", "statsValueTempString", this.handleChampions)}
                    {renderFormGroup("Ability Stat Unit: ", "text", "abilityStats", "statsUnitTempString", this.handleChampions)}
                  </Col>
                  <Col md={6}>
                    {renderFormGroup("Damage: ", "text", "offense", "damageTempString", this.handleChampions)}
                    {renderFormGroup("Attack Speed: ", "number", "offense", "attackSpeed", this.handleChampions)}
                    {renderFormGroup("Spell Power: ", "number", "offense", "spellPower", this.handleChampions)}
                    {renderFormGroup("Crit Chance: ", "number", "offense", "critChance", this.handleChampions)}
                    {renderFormGroup("Crit Damage: ", "number", "offense", "critDamage", this.handleChampions)}
                    {renderFormGroup("Dodge Chance: ", "number", "defense", "dodgeChance", this.handleChampions)}
                    {renderFormGroup("Range: ", "number", "offense", "range", this.handleChampions)}
                    {renderFormGroup("Health: ", "text", "defense", "healthTempString", this.handleChampions)}
                    {renderFormGroup("Armor: ", "number", "defense", "armor", this.handleChampions)}
                    {renderFormGroup("Magic Resist: ", "number", "defense", "magicResist", this.handleChampions)}
                    {renderFormGroup("Set: ", "number", "set", "setTempString", this.handleChampions)}
                    {renderFormGroup("Image: ", "text", "image", "image", this.handleChampions)}
                    {renderFormGroup("Icon: ", "text", "icon", "icon", this.handleChampions)}
                    {renderFormGroup("Ability Icon: ", "text", "abilityIcon", "abilityIcon", this.handleChampions)}
                  </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Button type="button" color="primary" onClick={this.handleChampionSubmit}>Submit</Button>
                </CardFooter>
                </Collapse>
              </Card>
              <Card>
              <CardHeader>
                <strong>Classes</strong>
                <Button color="primary" onClick={this.classToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
              </CardHeader>
              <Collapse isOpen={this.state.classCollapse}>
              <CardBody>
                <Row>
                  <Col>
                    {renderFormGroup("Id: ", "number", "id", "id", this.handleClasses)}
                    {renderFormGroup("Key: ", "text", "key", "key", this.handleClasses)}
                    {renderFormGroup("Name: ", "text", "name", "name", this.handleClasses)}
                    {renderFormGroup("Description: ", "text", "description", "description", this.handleClasses)}
                    {renderFormGroup("Bonuses: ", "text", "bonusesTempString", "bonusesTempString", this.handleClasses)}
                    {renderFormGroup("Set: ", "number", "set", "set", this.handleClasses)}
                    {renderFormGroup("Image: ", "text", "image", "image", this.handleClasses)}
                    {renderFormGroupCheckbox("Must be exact: ", "checkbox", "exact", "exact", event => this.handleClick(event, 0), null)}
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Button type="button" color="primary" onClick={this.handleClassSubmit}>Submit</Button>
              </CardFooter>
              </Collapse>
              </Card>
              <Card>
                <CardHeader>
                  <strong>Origins</strong>
                  <Button color="primary" onClick={this.originToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
                </CardHeader>
                <Collapse isOpen={this.state.originCollapse}>
                <CardBody>
                  <Row>
                    <Col>
                      {renderFormGroup("Id: ", "number", "id", "id", this.handleOrigins)}
                      {renderFormGroup("Key: ", "text", "key", "key", this.handleOrigins)}
                      {renderFormGroup("Name: ", "text", "name", "name", this.handleOrigins)}
                      {renderFormGroup("Description: ", "text", "description", "description", this.handleOrigins)}
                      {renderFormGroup("Bonuses: ", "text", "bonusesTempString", "bonusesTempString", this.handleOrigins)}
                      {renderFormGroup("Set: ", "number", "set", "set", this.handleOrigins)}
                      {renderFormGroup("Image: ", "text", "image", "image", this.handleOrigins)}
                      {renderFormGroupCheckbox("Must be exact: ", "checkbox", "exact", "exact", event => this.handleClick(event, 1), null)}
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Button type="button" color="primary" onClick={this.handleOriginSubmit}>Submit</Button>
                </CardFooter>
                </Collapse>
              </Card>
              <Card>
                <CardHeader>
                  <strong>Items</strong>
                  <Button color="primary" onClick={this.itemToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
                </CardHeader>
                <Collapse isOpen={this.state.itemCollapse}>
                <CardBody>
                  <Row>
                    <Col>
                      {renderFormGroup("Id: ", "number", "id", "id", this.handleItems)}
                      {renderFormGroup("Key: ", "text", "key", "key", this.handleItems)}
                      {renderFormGroup("Name: ", "text", "name", "name", this.handleItems)}
                      {renderFormGroup("Type: ", "text", "type", "type", this.handleItems)}
                      {renderFormGroup("Bonus: ", "textarea", "bonus", "bonus", this.handleItems)}
                      {renderFormGroup("Depth: ", "number", "depth", "depth", this.handleItems)}
                      {renderFormGroup("Stats: ", "textarea", "stats", "stats", this.handleItems)}
                      {renderFormGroup("Builds From: ", "text", "buildsFromTempString", "buildsFromTempString", this.handleItems)}
                      {renderFormGroup("Builds Into: ", "text", "buildsIntoTempString", "buildsIntoTempString", this.handleItems)}
                      {renderFormGroupCheckbox("Unique (one per champion): ", "text", "unique", "unique", event => this.handleClick(event, 2), null)}
                      {renderFormGroup("Cannot Equip:", "text", "cannotEquip", "cannotEquip", this.handleItems)}
                      {renderFormGroup("Set: ", "text", "set", "set", this.handleItems)}
                      {renderFormGroup("Image: ", "textarea", "image", "image", this.handleItems)}
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Button type="button" color="primary" onClick={this.handleItemSubmit}>Submit</Button>
                </CardFooter>
                </Collapse>
              </Card>
              <Card>
                <CardHeader>
                  <strong>Hexes</strong>
                  <Button color="primary" onClick={this.hexToggle} style={{marginLeft: '1rem'}}>Toggle</Button>
                </CardHeader>
                <Collapse isOpen={this.state.hexCollapse}>
                  <CardBody>
                    <Row>
                      <Col>
                        {renderFormGroup("Key: ", "text", "key", "key", this.handleHexes)}
                        {renderFormGroup("Name: ", "text", "name", "name", this.handleHexes)}
                        {renderFormGroup("Description: ", "text", "description", "description", this.handleHexes)}
                        {renderFormGroup("Bonuses: ", "text", "bonusString", "bonusString", this.handleHexes)}
                        {renderFormGroup("Set: ", "text", "set", "set", this.handleHexes)}
                        {renderFormGroup("Image: ", "text", "image", "image", this.handleHexes)}
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <Button type="button" color="primary" onClick={this.handleHexSubmit}>Submit</Button>
                  </CardFooter>
                </Collapse>
              </Card>
        </div>
      )
  }
}
export default Create;
