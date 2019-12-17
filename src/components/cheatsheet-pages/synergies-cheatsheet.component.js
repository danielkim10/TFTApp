import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Container } from 'reactstrap';
import { getData } from '../../api-helper/api.js';
import { withRouter } from 'react-router-dom';

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
    getData('origins').then(data => {
      this.setState({origins: data.map(origin => origin)});
    });
    getData('classes').then(data => {
      this.setState({classes: data.map(classe => classe)});
    });
    getData('champions').then(data => {
      this.setState({champions: data.map(champion => champion)});
    })
  }

  createSynergy(data) {
    let champions = this.state.champions.filter(champion => champion.origin.includes(data.name));
    if (champions.length === 0)
      champions = this.state.champions.filter(champion => champion.classe.includes(data.name));

    let championDesc = [];
    for (let i = 0; i < champions.length; ++i) {
      championDesc.push(<img src={champions[i].icon} width={60} height={60} onClick={() => this.championRedirect(champions[i].key)}/>);
    }

    let bonuses = [];
    for (let i = 0; i < data.bonuses.length; ++i) {
      bonuses.push(<Row><Col sm={2}>{data.bonuses[i].needed}</Col><Col sm={10}>{data.bonuses[i].effect}</Col></Row>);
    }

    return (<Card style={{width: "90%"}}>
        <CardHeader><img src={data.image}/> {data.name}</CardHeader>
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
