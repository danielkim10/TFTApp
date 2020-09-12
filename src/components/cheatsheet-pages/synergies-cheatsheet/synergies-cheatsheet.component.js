import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Container, Tooltip } from 'reactstrap';
import { getSetData } from '../../../api-helper/api.js';
import '../../../css/colors.css';

import './synergies-cheatsheet.component.css';

class SynergiesCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origins: [],
      classes: [],
      champions: [],
    };
    this.championRedirect = this.championRedirect.bind(this);
  }

  componentDidMount() {
    getSetData('origins', 1).then(data => {
      this.setState({origins: data.map(origin => origin)});
    });
    getSetData('classes', 1).then(data => {
      this.setState({classes: data.map(classe => classe)});
    });
    getSetData('champions', 1).then(data => {
      this.setState({champions: data.map(champion => champion)});
    })
  }

  createSynergy(data) {
    let champions = this.state.champions.filter(champion => champion.origin.includes(data.name));
    if (champions.length === 0)
      champions = this.state.champions.filter(champion => champion.classe.includes(data.name));

    let championDesc = [];
    for (let i = 0; i < champions.length; ++i) {
      championDesc.push(<div className='champion-spacing' onClick={() => this.championRedirect(champions[i].key)}>
        <img src={champions[i].icon} className={champions[i].cost === 1 ? 'cost1champion' : champions[i].cost === 2 ? 'cost2champion' : champions[i].cost === 3 ? 'cost3champion' : champions[i].cost === 4 ? 'cost4champion' : 'cost5champion'}/>
        <p className='champion-name'>{champions[i].name}</p>
        <p className='cost'>${champions[i].cost}</p>
      </div>);
    }

    let bonuses = [];
    for (let i = 0; i < data.bonuses.length; ++i) {
      bonuses.push(<Row><Col sm={2}>({data.bonuses[i].needed})</Col><Col sm={10}>{data.bonuses[i].effect}</Col></Row>);
    }

    return (<Card style={{width: "90%"}}>
        <CardHeader style={{backgroundColor: '#ffffff'}}><img src={data.image} class='black-icon'/> {data.name}</CardHeader>
        <CardBody>
          <Container>{data.description}</Container>
          <Container>{championDesc}</Container>
          <Container>{bonuses}</Container>
        </CardBody>
      </Card>)
  }

  championRedirect(key) {
    let path = '/cheatsheet/champions';
    this.props.history.push({pathname: path, data: key});
  }

  toggle(target) {
    if (!this.state[target]) {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: !this.state[target].tooltipOpen
        }
      });
    }
  }
  isToolTipOpen(target) {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }

  render() {
    let originCards = [];
    let classCards = [];

    for (let i = 0; i < this.state.origins.length; ++i) {
      originCards.push(<Row>{this.createSynergy(this.state.origins[i])}</Row>);
    }
    for (let i = 0; i < this.state.classes.length; ++i) {
      classCards.push(<Row>{this.createSynergy(this.state.classes[i])}</Row>)
    }


      return (
        <div>
        <Row>
          <Col sm={1}></Col>
          <Col sm={5}>
            {originCards}
          </Col>
          <Col sm={5}>
            {classCards}
          </Col>
          <Col sm={1}></Col>
          </Row>
        </div>
      )
  }
}

export default SynergiesCheatSheet;
