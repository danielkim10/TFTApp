import React, { Component, Fragment } from 'react';
import { getData } from '../../api-helper/api.js';
import { Card, CardHeader, CardBody, Container, Row, Col, Input, Label } from 'reactstrap';

class ChampionsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      champions: [],
      champion: {
        id: 0,
        key: "",
        name: "",
        origin: [],
        classe: [],
        cost: 0,
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
        abilityIcon: "",
      },
      championList: [],
      searchName: ""
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
      getData('champions').then(data => {
        this.setState({ champions: data.map(champion => champion) });
        this.setState({ champion: this.state.champions[Math.floor(Math.random() * this.state.champions.length)] });
      });
  }

  randomChampion() {
    let random = Math.floor(Math.random() * this.state.champions.length);
    this.setState({champion: this.state.champions[random]});
  }

  loadChampionData(champion) {
    this.setState({ champion: champion });
  }

  handleSearch(event) {
    this.setState({searchName: event.target.value});


  }

  render() {
    const champions = [];
    let origins = "";
    let classes = "";
    let abilityStats = [];
    let health = "";
    let damage = "";


    for (let i = 0; i < this.state.champions.length; ++i) {
      champions.push(<img src={this.state.champions[i].icon} width={60} height={60} onClick={() => this.loadChampionData(this.state.champions[i])}/>)
    }

    for (let i = 0; i < this.state.champion.origin.length; ++i) {
      origins += this.state.champion.origin[i];
      if (i < this.state.champion.origin.length - 1) {
        origins += ', ';
      }
    }
    for (let i = 0; i < this.state.champion.classe.length; ++i) {
      classes += this.state.champion.classe[i];
      if (i < this.state.champion.classe.length - 1) {
        classes += ', ';
      }
    }

    for (let i = 0; i < this.state.champion.ability.stats.length; ++i) {
      let partString1 = "";
      for (let j = 0; j < this.state.champion.ability.stats[i].value.length; ++j) {
        partString1 += this.state.champion.ability.stats[i].value[j];
        if (j < this.state.champion.ability.stats[i].value.length - 1) {
          partString1 += '/';
        }
      }
      abilityStats.push(<Row>{this.state.champion.ability.stats[i].type}: {partString1}</Row>)
    }

    for (let i = 0; i < this.state.champion.stats.offense.damage.length; ++i) {
      damage += this.state.champion.stats.offense.damage[i];
      if (i < this.state.champion.stats.offense.damage.length - 1) {
        damage += ' / ';
      }
    }

    for (let i = 0; i < this.state.champion.stats.defense.health.length; ++i) {
      health += this.state.champion.stats.defense.health[i];
      if (i < this.state.champion.stats.defense.health.length - 1) {
        health += ' / ';
      }
    }


      return (
        <div>
        <Row>
          <Col sm={1}></Col>
          <Col sm={10}>
            <Card>
              <CardBody>
              <Row>
              <Col sm={4}>
                <Card>
                  <CardBody>
                    <Input type="text" id="search" name="search" onChange={this.handleSearch} placeholder="Champion Name" />

                    {champions}
                  </CardBody>
                </Card>
                </Col>
                <Col sm={8}>
                <Card>
                  <CardBody>
                  <Row>
                    <Col sm={4}>
                      <img src={this.state.champion.image} />
                    </Col>
                    <Col sm={8}>
                      <Row>
                      <Card>
                      <CardHeader>
                        <Row><strong> {this.state.champion.name}</strong></Row>
                        <Row>Cost: {this.state.champion.cost}/{this.state.champion.cost + 2}/{this.state.champion.cost + 4}</Row>
                      </CardHeader>
                      <CardBody>
                        <Col sm={2}>
                          <img src={this.state.champion.abilityIcon} />
                        </Col>
                        <Col sm={10}>

                          <Row>
                            <Col><strong>{this.state.champion.ability.name}</strong></Col>
                            <Col>Mana: {this.state.champion.ability.manaStart}/{this.state.champion.ability.manaCost}</Col>
                          </Row>
                          <Row>
                            {this.state.champion.ability.description}
                          </Row>
                          <Container>
                            {abilityStats}
                          </Container>
                          <Row>Health: {health}</Row>
                          <Row>Attack Damage: {damage}</Row>
                          <Row>Attack Speed: {this.state.champion.stats.offense.attackSpeed}</Row>
                          <Row>Attack Range: {this.state.champion.stats.offense.range === 1 ? 125 : (this.state.champion.stats.offense.range === 2) ? 420 : (this.state.champion.stats.offense.range === 3) ? 680 : 890}</Row>
                          <Row>Armor: {this.state.champion.stats.defense.armor}</Row>
                          <Row>Magic Resist: {this.state.champion.stats.defense.magicResist}</Row>
                        </Col>
                        </CardBody>
                        </Card>
                      </Row>
                      <Row>
                        <Card>
                          <CardHeader>
                            <strong>Traits</strong>
                          </CardHeader>
                          <CardBody>
                            <Row>Origin: {origins}</Row>
                            <Row>Class: {classes}</Row>
                          </CardBody>
                        </Card>
                      </Row>
                      <Row></Row>
                    </Col>
                    </Row>
                  </CardBody>
                </Card>
                </Col>
                </Row>

              </CardBody>
            </Card>
          </Col>
          <Col sm={1}></Col>
          </Row>
        </div>
      )
  }
}

export default ChampionsCheatSheet;
