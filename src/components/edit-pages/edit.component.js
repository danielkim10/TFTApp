import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Image from 'react-image-resizer';
import { getData } from '../../api-helper/api.js';
import { cardColumn } from '../../sub-components/prebuiltcard.js';

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
    getData('champions').then(data => {
      this.setState({champions: data.map(champion => champion)})
    });
    getData('classes').then(data => {
      this.setState({classes: data.map(classe => classe)})
    });
    getData('items').then(data => {
      this.setState({items: data.map(item => item)})
    });
    getData('origins').then(data => {
      this.setState({origins: data.map(origin => origin)})
    });
  }

  render() {
    const champions = [];
    const classes = [];
    const items = [];
    const origins = [];
    for (let i = 0; i < this.state.champions.length; i++) {
      let pathname = "/champion/" + this.state.champions[i]._id;
      champions.push(<div><Link to={{ pathname: pathname, state: {data: this.state.champions[i]} }}><p>{this.state.champions[i].name} {this.state.champions[i].set}</p></Link><img src={this.state.champions[i].icon} height={40} width={40}/></div>);
    }
    for (let i = 0; i < this.state.classes.length; i++) {
      let pathname = "/class/" + this.state.classes[i]._id;
      classes.push(<div><Link to={{ pathname: pathname, state: {data: this.state.classes[i]} }}><p>{this.state.classes[i].name} {this.state.classes[i].set}</p></Link></div>);
    }
    for (let i = 0; i < this.state.items.length; i++) {
      let pathname = "/item/" + this.state.items[i]._id;
      items.push(<div><Link to={{ pathname: pathname, state: {data: this.state.items[i]} }}><p>{this.state.items[i].name} {this.state.items[i].set}</p></Link></div>);
    }
    for (let i = 0; i < this.state.origins.length; i++) {
      let pathname="/origin/" + this.state.origins[i]._id;
      origins.push(<div><Link to={{ pathname: pathname, state: {data: this.state.origins[i]} }}><p>{this.state.origins[i].name} {this.state.origins[i].set}</p></Link></div>);
    }
      return (
        <div>
        <Card>
          <Row>
          {cardColumn('Champions', champions)}
          {cardColumn('Classes', classes)}
          {cardColumn('Items', items)}
          {cardColumn('Origins', origins)}
          </Row>
          </Card>
        </div>
      )
  }
}

export default Edit;
