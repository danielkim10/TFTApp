import React, { Component } from 'react';
import { getSetData, getDataFromName } from '../../api-helper/api.js';
import { Card, CardHeader, CardBody, Container, Row, Col, Input } from 'reactstrap';
import '../../css/colors.css'

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
      searchName: "",

      origins: [],
      classes: [],
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
      getSetData('champions', 1).then(data => {
        this.setState({ champions: data.map(champion => champion) });

        if (!this.props.location.data) {
          this.loadChampionData(this.state.champions[Math.floor(Math.random() * this.state.champions.length)]);
        }
        else {
          this.loadChampionData(this.state.champions.filter(champion => champion.key === this.props.location.data)[0]);
        }

        //this.setState({ champion: this.state.champions[Math.floor(Math.random() * this.state.champions.length)] });
      });
  }

  randomChampion() {
    let random = Math.floor(Math.random() * this.state.champions.length);
    this.setState({champion: this.state.champions[random]});
  }

  loadChampionData(champion) {
    this.setState({ champion: champion });

    let origins = [];
    for (let i = 0; i < champion.origin.length; ++i) {
      getDataFromName('origins', champion.origin[i]).then(data => {
        origins.push(data);
        this.setState({origins: origins});
      });
    }

    let classes = [];
    for (let i = 0; i < champion.classe.length; ++i) {
      getDataFromName('classes', champion.classe[i]).then(data => {
        classes.push(data);
        this.setState({classes: classes});
      });
    }
  }

  handleSearch(event) {
    this.setState({searchName: event.target.value});
  }

  statsCard() {
    let abilityStats = [];
    let health = "";
    let damage = "";
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


    return (<Card style={{width: "100%"}}>
      <CardHeader>
        <Container>
        <Row><strong> {this.state.champion.name}</strong></Row>
        <Row>Cost: {this.state.champion.cost}/{this.state.champion.cost + 2}/{this.state.champion.cost + 4}</Row>
        </Container>
      </CardHeader>
      <CardBody>
      <Container>
      <Row>
        <Col>
          <Row>Health: {health}</Row>
          <Row>Attack Damage: {damage}</Row>
          <Row>Attack Speed: {this.state.champion.stats.offense.attackSpeed}</Row>
          <Row>Attack Range: {this.state.champion.stats.offense.range === 1 ? 125 : (this.state.champion.stats.offense.range === 2) ? 420 : (this.state.champion.stats.offense.range === 3) ? 680 : 890}</Row>
          <Row>Armor: {this.state.champion.stats.defense.armor}</Row>
          <Row>Magic Resist: {this.state.champion.stats.defense.magicResist}</Row>
        </Col>
        </Row>
        <Row>
        <Col sm={2}><img src={this.state.champion.abilityIcon} /></Col>
        <Col sm={10}>
          <Row>
            <Col><strong>{this.state.champion.ability.name}</strong></Col>
            <Col>Mana: {this.state.champion.ability.manaStart}/{this.state.champion.ability.manaCost}</Col>
          </Row>
          <Row>
            <Col sm={12}>{this.state.champion.ability.description}</Col><Col sm={0}></Col></Row>
          <Row>
            <Col sm={12}><Container>{abilityStats}</Container></Col><Col sm={0}></Col></Row>
        </Col>
        </Row>
        </Container>
      </CardBody>
    </Card>);
  }

  synergyCard() {
    let cards = [];
    for (let i = 0; i < this.state.origins.length; ++i) {
      let matchingChampions = this.state.champions.filter(champion => champion.origin.includes(this.state.origins[i].name));

      let matchingChampionsIcons = [];
      for (let j = 0; j < matchingChampions.length; ++j) {
        matchingChampionsIcons.push(<img src={matchingChampions[j].icon} width={60} height={60} onClick={() => this.loadChampionData(matchingChampions[j])}/>);
      }

      let bonuses = [];
      for (let j = 0; j < this.state.origins[i].bonuses.length; ++j) {
        bonuses.push(<Row>({this.state.origins[i].bonuses[j].needed}) {this.state.origins[i].bonuses[j].effect}</Row>)
      }

      cards.push(
        <Container>
        <Row>
          <Col sm={3}>
            <Row>
              <img src={this.state.origins[i].image} class='black-icon'/> {this.state.origins[i].name}
            </Row>
            <Row></Row>
            <Row></Row>
          </Col>
          <Col>
            <Row>
              {matchingChampionsIcons}
            </Row>
            <Row>
              {this.state.origins[i].description}
            </Row>
            <Container>
              {bonuses}
            </Container>
          </Col>
          </Row>
          </Container>);
    }
    for (let i = 0; i < this.state.classes.length; ++i) {

      let matchingChampions = this.state.champions.filter(champion => champion.classe.includes(this.state.classes[i].name));

      let matchingChampionsIcons = [];
      for (let j = 0; j < matchingChampions.length; ++j) {
        matchingChampionsIcons.push(<img src={matchingChampions[j].icon} width={60} height={60} onClick={() => this.loadChampionData(matchingChampions[j])}/>);
      }

      let bonuses = [];
      for (let j = 0; j < this.state.classes[i].bonuses.length; ++j) {
        bonuses.push(<Row>({this.state.classes[i].bonuses[j].needed}) {this.state.classes[i].bonuses[j].effect}</Row>)
      }

      cards.push(
      <Container>
        <Row>
          <Col sm={3}>
            <Row><img src={this.state.classes[i].image} class='black-icon'/> {this.state.classes[i].name}</Row>
            <Row></Row>
            <Row></Row>
          </Col>
          <Col>
            <Row>
               {matchingChampionsIcons}
            </Row>
            <Row>
              {this.state.classes[i].description}
            </Row>
            <Container>
              {bonuses}
            </Container>
          </Col>
          </Row>
        </Container>
      )
    }
    return cards;
  }

  render() {
    const champions = [];


    for (let i = 0; i < this.state.champions.length; ++i) {
      if (this.state.champions[i].key.includes(this.state.searchName.toLowerCase()) || this.state.champions[i].name.includes(this.state.searchName))
      champions.push(<img src={this.state.champions[i].icon} width={60} height={60} onClick={() => this.loadChampionData(this.state.champions[i])}/>)
    }


      return (
      <div>
        <Row>
          <Col sm={1}></Col>
          <Col sm={10}>
            <Card>
              <CardBody>
              <Row>
              <Col sm={3}>
                <Card>
                  <CardBody>
                    <Input type="text" id="search" name="search" onChange={this.handleSearch} placeholder="Champion Name" />

                    {champions}
                  </CardBody>
                </Card>
                </Col>
                <Col sm={9}>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col>
                          <Row><img src={this.state.champion.image} width='40%' height='40%'/></Row>
                        </Col>
                        <Col>
                          <Row>
                            {this.statsCard()}
                          </Row>
                          <Row>
                            <Card style={{width: "100%"}}>
                              <CardHeader>
                                <strong>Traits</strong>
                              </CardHeader>
                              <CardBody>
                                {this.synergyCard()}
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
