import React, { Component } from 'react';
import { Alert, Button, Card, CardHeader, CardBody, Col, Collapse, Row, Input, Tooltip } from 'reactstrap';

class TeamPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  toggleCollapse(target) {
    if (!this.state[target]) {
      this.setState({
        ...this.state,
        [target]: {
          collapseOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [target]: {
          collapseOpen: !this.state[target].collapseOpen
        }
      });
    }
  }
  isCollapseOpen(target) {
    return this.state[target] ? this.state[target].collapseOpen : false;
  }
  allowDrop(e) {
    e.preventDefault();
  }

  createTeam = () => {
    let team = [];
    let teamData = [];
    Object.keys(this.props.team).forEach((key, index) => {
      let c = this.props.team[key];
      team.push(
        <Card onDrop={(e) => this.props.drop(e, key)} onDragOver={this.allowDrop} id="hello" inverse='#404040' style={{backgroundColor: '#404040', borderColor: 'black'}}>
          <CardBody className='marginLeft14'>
            <Row>{c.champion.name}</Row>
            <Row>
              <img src={c.champion.icon} className='icon60'/>
              <div style={{display: 'block'}}>
              <p>{c.champion.origin[0]}</p>
              </div>
              <p>{c.champion.origin.length > 1 ? c.champion.origin[1] : ""}</p>
              <p>{c.champion.classe[0]}</p>
              <p>{c.champion.classe.length > 1 ? c.champion.classe[1] : ""}</p>
              <img src={c.items.length > 0 ? c.items[0].image : ""} className='itemMargins'/>
              <img src={c.items.length > 1 ? c.items[1].image : ""} className='itemMargins'/>
              <img src={c.items.length > 2 ? c.items[2].image : ""} className='itemMargins'/>
              <Button type="button" color="primary" style={{marginLeft: '90px'}} onClick={() => this.toggleCollapse(`team-${c.champion.name}`)}>Expand</Button>
            </Row>
            <Collapse isOpen={this.isCollapseOpen(`team-${c.champion.name}`)}>
              <Row style={{marginTop: '10px'}}>
                <Col>
                  <p className={c.champion.stats.defense.health[0] === this.props.champions[c.champion.key].stats.defense.health[0] ? 'statText' : 'enhancedStat'}>Health: {c.champion.stats.defense.health[0]}/{c.champion.stats.defense.health[1]}/{c.champion.stats.defense.health[2]}</p>
                  <p className='statText'>Attack Damage: {c.champion.stats.offense.damage[0]}/{c.champion.stats.offense.damage[1]}/{c.champion.stats.offense.damage[2]}</p>
                  <p className='statText'>Attack Speed: {c.champion.stats.offense.attackSpeed}</p>
                  <p className='statText'>Attack Range: {c.champion.stats.offense.range === 1 ? 125 : (c.champion.stats.offense.range === 2 ? 420 : (c.champion.stats.offense.range === 3 ? 680 : (c.champion.stats.offense.range === 4 ? 890 : 1130)))}</p>
                  <p className='statText'>Armor: {c.champion.stats.defense.armor}</p>
                  <p className='statText'>Magic Resist: {c.champion.stats.defense.magicResist}</p>
                </Col>
                <Col>
                  <p className='statText'>Spell Power: {c.champion.stats.offense.spellPower} %</p>
                  <p className='statText'>Crit Chance: {c.champion.stats.offense.critChance} %</p>
                  <p className='statText'>Crit Damage: {c.champion.stats.offense.critDamage} %</p>
                  <p className='statText'>Dodge Chance: {c.champion.stats.defense.dodgeChance} %</p>
                </Col>
              </Row>
              <Row style={{marginTop: '10px'}}>
                <Col sm={1}>
                  <img src={c.champion.abilityIcon} className='icon40'/>
                </Col>
                <Col>
                  <p className='statText'>{c.champion.ability.name}</p>
                  <p className='statText'>Mana: {c.champion.ability.manaStart}/{c.champion.ability.manaCost}</p>
                </Col>
              </Row>
              <Row>
                <p className='abilityMargin1'>{c.champion.ability.description}</p>
              </Row>
              <Row>
                <p className='abilityMargin2'>{c.champion.ability.stats[0].type}: {c.champion.ability.stats[0].value[0]} / {c.champion.ability.stats[0].value[1]} / {c.champion.ability.stats[0].value[2]}</p>
              </Row>
              <Row>
                <p className='abilityMargin2'>{c.champion.ability.stats.length > 1 ? c.champion.ability.stats[1].type + ': ' + c.champion.ability.stats[1].value[0] + ' / ' + c.champion.ability.stats[1].value[1] + ' / ' + c.champion.ability.stats[1].value[2] : ""}</p>
              </Row>
              <Row>
                <p className='abilityMargin2'>{c.champion.ability.stats.length > 2 ? c.champion.ability.stats[2].type + ': ' + c.champion.ability.stats[2].value[0] + ' / ' + c.champion.ability.stats[2].value[1] + ' / ' + c.champion.ability.stats[2].value[2] : ""}</p>
              </Row>
            </Collapse>
          </CardBody>
        </Card>);
        teamData.push({champion: c.champion, tier: c.tier, items: c.items});
      })
      return team;
  }

  render = () => {
    return(
      <Card name="pool" style={{height: '90%'}}>
        <CardBody>
          {this.createTeam()}
        </CardBody>
      </Card>
    );
  }
}

export default TeamPanel;
