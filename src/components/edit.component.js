import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
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
            champions: response.data.map(champion => champion.name)
          })
        }
      });

      axios.get('http://localhost:5000/classes/')
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              classes: response.data.map(classe => classe.name)
            })
          }
        });

        axios.get('http://localhost:5000/items/')
          .then(response => {
            if (response.data.length > 0) {
              this.setState({
                items: response.data.map(item => item.name)
              })
            }
          });

          axios.get('http://localhost:5000/origins/')
            .then(response => {
              if (response.data.length > 0) {
                this.setState({
                  origins: response.data.map(origin => origin.name)
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
      champions.push(<p>{this.state.champions[i]}</p>);
    }
    for (let i = 0; i < this.state.classes.length; i++) {
      classes.push(<p>{this.state.classes[i]}</p>);
    }
    for (let i = 0; i < this.state.items.length; i++) {
      items.push(<p>{this.state.items[i]}</p>);
    }
    for (let i = 0; i < this.state.origins.length; i++) {
      origins.push(<p>{this.state.origins[i]}</p>);
    }
      return (
        <div>
          <Row>
            <Col>{champions}</Col>
            <Col>{classes}</Col>
            <Col>{items}</Col>
            <Col>{origins}</Col>
          </Row>
        </div>
      )
  }
}

export default Edit;
