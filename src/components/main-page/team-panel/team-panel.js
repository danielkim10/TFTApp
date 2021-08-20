import React, { Component } from 'react';
import { Card, CardBody, Col, Collapse, Row } from 'reactstrap';

import './team-panel.css';

class TeamPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  toggleCollapse = (target) => {
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
  isCollapseOpen = (target) => {
    return this.state[target] ? this.state[target].collapseOpen : false;
  }
  allowDrop = (e) => {
    e.preventDefault();
  }

  createTeam = () => {
    let team = [];
    let team1 = [];
    let teamData = [];
    for (let teamMember in this.props.team) {
    //Object.keys(this.props.team).forEach((key, index) => {
      let c = this.props.team[teamMember];
      let citems = [];
      for (let item in c.items) {
        let image = c.items[item].patch_data.icon.substring(0, c.items[item].patch_data.icon.indexOf('dds'));
        citems.push(<td><img src={"https://raw.communitydragon.org/latest/game/" + image.toLowerCase() + `png`} width={20} height={20}/></td>)
      }

      team.push(
        <td key={this.props.team[teamMember].champion.championId + team.length}>
          <div style={{position: 'relative'}} onDrop={(e) => this.props.drop(e, this.props.team[teamMember].champion.championId)} onDragOver={this.allowDrop}>
            <img src={require(`../../../data/champions/` + this.props.team[teamMember].champion.championId + `.png`)} alt={c.champion.name} className={c.champion.cost === 1 ? 'cost1champion1' : c.champion.cost === 2 ? 'cost2champion1' : c.champion.cost === 3 ? 'cost3champion1' : c.champion.cost === 4 ? 'cost4champion1' : 'cost5champion1'} height='75px' width='75px'/>
              
              <p className="cost1">${c.champion.cost}</p>
              <table>
                <tbody>
                  <tr>
                    {citems}
                  </tr>
                </tbody>
              </table>
          </div>
        </td>
      );

      team1.push(
        <Card onDrop={(e) => this.props.drop(e, this.props.team[teamMember].champion.championId)} onDragOver={this.allowDrop} id="hello" inverse="#404040" style={{backgroundColor: '#404040', borderColor: 'black'}}>
          <CardBody className='marginLeft14'>
            <Row>
              <div style={{position: 'relative'}}>
              <img src={require(`../../../data/champions/` + this.props.team[teamMember].champion.championId + `.png`)} alt={c.champion.name} className={c.champion.cost === 1 ? 'cost1champion1' : c.champion.cost === 2 ? 'cost2champion1' : c.champion.cost === 3 ? 'cost3champion1' : c.champion.cost === 4 ? 'cost4champion1' : 'cost5champion1'}/>
                <p className="champion-name1">{c.champion.name}</p>
                <p className="cost1">${c.champion.cost}</p>
              </div>
              {/*<Col>
                <Row><img src={} className="synergy-icon"/><p className="synergy-text">{}</p></Row>
                {c.champion.origin.length > 1 ? <Row><img src={} className="synergy-icon"/><p className="synergy-text">{}</p></Row> : <></>}
                <Row><img src={} className="synergy-icon"/><p className="synergy-text">{}</p></Row>
                {c.champion.classe.length > 1 ? <Row><img src={} className="synergy-icon"/><p className="synergy-text">{}</p></Row> : <></>}
              </Col>
              <img src={c.items.length > 0 ? c.items[0].image : "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_unusableslot.tft3_1013_gamevariations.png"} className='itemMargins'/>
              <img src={c.items.length > 1 ? c.items[1].image : "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_unusableslot.tft3_1013_gamevariations.png"} className='itemMargins'/>
              <img src={c.items.length > 2 ? c.items[2].image : "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_unusableslot.tft3_1013_gamevariations.png"} className='itemMargins'/>
              <Button type="button" color="primary" style={{marginLeft: '90px'}} onClick={() => this.toggleCollapse(`team-${c.champion.name}`)}>Expand</Button>*/}
            </Row>
            <Collapse isOpen={this.isCollapseOpen(`team-${c.champion.name}`)}>
              <Row style={{marginTop: '10px'}}>
                <Col>
                  {/*<Row><img src="http://raw.communitydragon.org/pbe/game/assets/perks/statmods/statmodshealthscalingicon.png" width='24px' height='24px'/><p className={c.champion.stats.defense.health[0] === this.props.champions[c.champion.key].stats.defense.health[0] ? 'statText' : 'enhancedStat'}>Health: {c.champion.stats.defense.health[0]}/{c.champion.stats.defense.health[1]}/{c.champion.stats.defense.health[2]}</p></Row>
                  <Row><img src="http://raw.communitydragon.org/pbe/game/assets/perks/statmods/statmodsattackdamageicon.png" width='24px' height='24px'/><p className='statText'>Attack Damage: {c.champion.stats.offense.damage[0]}/{c.champion.stats.offense.damage[1]}/{c.champion.stats.offense.damage[2]}</p></Row>
                  <Row><img src="http://raw.communitydragon.org/pbe/game/assets/perks/statmods/statmodsattackspeedicon.png" width='24px' height='24px'/><p className='statText'>Attack Speed: {c.champion.stats.offense.attackSpeed}</p></Row>
                  <Row><img src="http://raw.communitydragon.org/pbe/game/assets/perks/statmods/statmodsattackspeedicon.png" width='24px' height='24px'/><p className='statText'>Attack Range: {c.champion.stats.offense.range === 1 ? 125 : (c.champion.stats.offense.range === 2 ? 420 : (c.champion.stats.offense.range === 3 ? 680 : (c.champion.stats.offense.range === 4 ? 890 : 1130)))}</p></Row>
                  <Row><img src="http://raw.communitydragon.org/pbe/game/assets/perks/statmods/statmodsarmoricon.png" width='24px' height='24px'/><p className='statText'>Armor: {c.champion.stats.defense.armor}</p></Row>
      <Row><img src="http://raw.communitydragon.org/pbe/game/assets/perks/statmods/statmodsmagicresicon.png" width='24px' height='24px'/><p className='statText'>Magic Resist: {c.champion.stats.defense.magicResist}</p></Row>*/}
                </Col>
                <Col>
                  {/*<Row><img src="http://raw.communitydragon.org/pbe/game/assets/perks/statmods/statmodsabilitypowericon.png" width='24px' height='24px'/><p className='statText'>Spell Power: {c.champion.stats.offense.spellPower} %</p></Row>
                  <p className='statText'>Crit Chance: {c.champion.stats.offense.critChance} %</p>
                  <p className='statText'>Crit Damage: {c.champion.stats.offense.critDamage} %</p>
    <p className='statText'>Dodge Chance: {c.champion.stats.defense.dodgeChance} %</p>*/}
                </Col>
              </Row>
              <Row style={{marginTop: '10px'}}>
                {/*<Col sm={1}>
                  <img src={c.champion.abilityIcon} className='icon40'/>
                </Col>
                <Col>
                  <p className='statText'>{c.champion.ability.name}</p>
                  <p className='statText'>Mana: {c.champion.ability.manaStart}/{c.champion.ability.manaCost}</p>
  </Col>*/}
              </Row>
              {/*<Row>
                <p className='abilityMargin1'>{c.champion.ability.description}</p>
              </Row>
              <Row>
                <p className='abilityMargin2'>{c.champion.ability.stats[0].type}: {c.champion.ability.stats[0].value[0]} / {c.champion.ability.stats[0].value[1]} / {c.champion.ability.stats[0].value[2]}</p>
              </Row>
              <Row>
                {c.champion.ability.stats.length > 1 ? <p className='abilityMargin2'>{ c.champion.ability.stats[1].type + ': ' + c.champion.ability.stats[1].value[0] + ' / ' + c.champion.ability.stats[1].value[1] + ' / ' + c.champion.ability.stats[1].value[2]}</p> : <></>}
              </Row>
              <Row>
                {c.champion.ability.stats.length > 2 ? <p className='abilityMargin2'>{ c.champion.ability.stats[2].type + ': ' + c.champion.ability.stats[2].value[0] + ' / ' + c.champion.ability.stats[2].value[1] + ' / ' + c.champion.ability.stats[2].value[2]}</p> : <></>}
              </Row>*/}
            </Collapse>
          </CardBody>
        </Card>);
        
        teamData.push({champion: c.champion, tier: c.tier, items: c.items});
      }
     return team;
  }

  render = () => {
    return(
      <Card name="pool" style={{height: '90%'}}>
        <CardBody>
          <table>
            <tbody>
              <tr>
                {this.createTeam()}
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }
}

export default TeamPanel;
