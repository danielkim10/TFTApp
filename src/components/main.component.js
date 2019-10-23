import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Row} from 'reactstrap';
import axios from 'axios';
import Hexagon from 'react-hexagon';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      team: [],
      synergies: [],
      champions: [],
      classes: [],
      items: [],
      origins: [],
      activeClasses: [],
      activeOrigins: [],
    }
    this.clearButton = this.clearButton.bind(this);
    this.randomButton = this.randomButton.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/champions/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            champions: response.data.map(champion => champion)
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
        });
        axios.get('http://localhost:5000/items/')
          .then(response => {
            if (response.data.length > 0) {
              this.setState({
                items: response.data.map(item => item)
              })
            }
          });
          axios.get('http://localhost:5000/origins/')
            .then(response => {
              if (response.data.length > 0) {
                this.setState({
                  origins: response.data.map(origin => origin)
                })
              }
            });
  }

  addToTeam() {

  }

  removeFromTeam() {

  }

  addItem() {

  }

  removeItem() {

  }

  clearButton() {

  }

  randomButton() {
    console.log("button clicked");
  }

  render() {
    const champions = [];
    const classes = [];
    const items = [];
    const origins = [];

    for (let i = 0; i < champions.length; i++) {
      champions.push(this.state.champions[i].name)
    }
    for (let i = 0; i < classes.length; i++) {
      classes.push(this.state.classes[i].name)
    }
    for (let i = 0; i < items.length; i++) {
      items.push(this.state.items[i].name)
    }
    for (let i = 0; i < origins.length; i++) {
      origins.push(this.state.origins[i].name)
    }

      return (
        <div>
        <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <Card name="activeTraits">
            <CardBody>

            </CardBody>
          </Card>
          <Card style={{width: "100%"}} name="board">
            <CardBody>
              <Hexagon diagonal="0.5"/><Hexagon diagonal="0.5"/><Hexagon diagonal="0.5"/><Hexagon diagonal="0.5"/><Hexagon diagonal="0.5"/><Hexagon diagonal="0.5"/><Hexagon diagonal="0.5"/>
            </CardBody>
          </Card>
          <Card name="pool">
            <CardBody>
            </CardBody>
          </Card>
          </Col>
          <Col sm={2}>

          </Col>
          </Row>
          <Button type="button" color="primary" onClick={this.randomButton}>Random</Button>
        </div>
      )
  }
}
