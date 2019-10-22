import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Row} from 'reactstrap';
import axios from 'axios';

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

  randomButton() {

  }

  render() {
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
