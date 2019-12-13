import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { getData } from '../../api-helper/api.js'

class ItemsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    getData('items').then(data => {
      this.setState({items: data.map(item => item).sort(this.compare)});
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
    const items = [];
    for (let i = 0; i < this.state.items.length; ++i) {

      if (this.state.items[i].depth === 1) {
        items.push(<img src={this.state.items[i].image}/>);
      }
    }

      return (
        <div>
        <Row>
        <Col sm={1}></Col>
        <Col sm={10}>
          <Row>
            <Card>
              <CardBody>
                <Row>
                </Row>
                <Row>
                  {items}
                </Row>
              </CardBody>
            </Card>
          </Row>
          <Row>
            <Card>
              <CardBody></CardBody>
            </Card>
          </Row>

        </Col>
          <Col sm={1}></Col>
          </Row>
        </div>
      )
  }
}

export default ItemsCheatSheet;
