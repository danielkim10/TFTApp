import React, { Component } from 'react';
import { Row, Card } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getData } from '../../api-helper/api.js';
import { cardColumn } from '../../sub-components/prebuiltcard.js';
import '../../css/colors.css'

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
      this.setState({items: data.map(item => item).sort(this.compare)})
    });
    getData('origins').then(data => {
      this.setState({origins: data.map(origin => origin)})
    });
  }

  compare(a, b) {
    const idA = a.id;
    const idB = b.id;

    let comparison = 0;
    if (idA > idB) {
      comparison = 1;
    }
    else if (idA < idB) {
      comparison = -1;
    }
    return comparison;
  }

  render() {
    const champions = [];
    const classes = [];
    const items = [];
    const origins = [];
    champions.push(<div><p>{this.state.champions.length} total champions</p></div>)
    for (let i = 0; i < this.state.champions.length; i++) {
      let pathname = "/champion/" + this.state.champions[i]._id;
      champions.push(<div><Card style={{borderColor: 'white'}}><Link to={{ pathname: pathname, state: {data: this.state.champions[i]} }}><p>{this.state.champions[i].name} {this.state.champions[i].set}</p></Link><img src={this.state.champions[i].icon} height='40px' width='40px'/></Card></div>);
    }

    classes.push(<div><p>{this.state.classes.length} total classes</p></div>)
    for (let i = 0; i < this.state.classes.length; i++) {
      let pathname = "/class/" + this.state.classes[i]._id;
      classes.push(<div><Card style={{borderColor: 'white'}}><Link to={{ pathname: pathname, state: {data: this.state.classes[i]} }}><p>{this.state.classes[i].name} {this.state.classes[i].set}</p></Link><img src={this.state.classes[i].image} height='40px' width='40px' class='black-icon'/></Card></div>);
    }

    items.push(<div><p>{this.state.items.length} total items</p></div>)
    for (let i = 0; i < this.state.items.length; i++) {
      let pathname = "/item/" + this.state.items[i]._id;
      items.push(<div><Card style={{borderColor: 'white'}}><Link to={{ pathname: pathname, state: {data: this.state.items[i]} }}><p>{this.state.items[i].name} {this.state.items[i].set}</p></Link><img src={this.state.items[i].image[0]} height='40px' width='40px'/></Card></div>);
    }

    origins.push(<div><p>{this.state.origins.length} total origins</p></div>)
    for (let i = 0; i < this.state.origins.length; i++) {
      let pathname="/origin/" + this.state.origins[i]._id;
      origins.push(<div><Card style={{borderColor: 'white'}}><Link to={{ pathname: pathname, state: {data: this.state.origins[i]} }}><p>{this.state.origins[i].name} {this.state.origins[i].set}</p></Link><img src={this.state.origins[i].image} height='40px' width='40px' class='black-icon'/></Card></div>);
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
