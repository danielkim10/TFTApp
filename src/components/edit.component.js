import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Container } from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      champions: [],
      classes: [],
      items: [],
      origins: [],
    }
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

  render() {
    const champions = [];
    const classes = [];
    const items = [];
    const origins = [];
    for (let i = 0; i < this.state.champions.length; i++) {
      let pathname = "/champion/" + this.state.champions[i].key;
      champions.push(<Link to={pathname}><p>{this.state.champions[i].name}</p></Link>);
    }
    for (let i = 0; i < this.state.classes.length; i++) {
      let pathname = "/class/" + this.state.classes[i].key;
      classes.push(<Link to={pathname}><p>{this.state.classes[i].name}</p></Link>);
    }
    for (let i = 0; i < this.state.items.length; i++) {
      let pathname = "/item/" + this.state.items[i].key;
      items.push(<Link to={pathname}><p>{this.state.items[i].name}</p></Link>);
    }
    for (let i = 0; i < this.state.origins.length; i++) {
      let pathname="/origin/" + this.state.origins[i].key;
      origins.push(<Link to={pathname}><p>{this.state.origins[i].name}</p></Link>);
    }
      return (
        <div>
        <Container fluid>
          <Row>
          <Card>
            <CardHeader>
              <i class="fa-fa-align-justify"></i><strong>Champions</strong>
            </CardHeader>
            <CardBody>
              <Col>{champions}</Col>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <i class="fa-fa-align-justify"></i><strong>Classes</strong>
            </CardHeader>
            <CardBody>
              <Col>{classes}</Col>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <i class="fa-fa-align-justify"></i><strong>Items</strong>
            </CardHeader>
            <CardBody>
              <Col>{items}</Col>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <i class="fa-fa-align-justify"></i><strong>Origins</strong>
            </CardHeader>
            <CardBody>
              <Col>{origins}</Col>
            </CardBody>
          </Card>
          </Row>
          </Container>
        </div>
      )
  }
}

export default Edit;
