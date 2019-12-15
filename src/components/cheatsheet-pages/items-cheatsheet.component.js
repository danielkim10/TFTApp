import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { getData } from '../../api-helper/api.js'

class ItemsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      basicItem1: {
        name: "",
        image: "",
      },
      basicItem2: {
        name: "",
        image: "",
      },
      advancedItem: {
        name: "",
        image: "",
      },
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

  addItem(item) {
    if (item.depth === 1) {
      if (this.state.basicItem1.name === "") {
        this.setState({basicItem1: item}, function() {
          this.itemCombination();
        });
      }
      else if (this.state.basicItem2.name === "") {
        this.setState({basicItem2: item}, function() {
          this.itemCombination();
        });
      }
    }
    else {
      this.setState({advancedItem: item});
    }
  }

  itemCombination() {
    if (this.state.basicItem1.name !== "" && this.state.basicItem2.name !== "") {
      for (let i = 0; i < this.state.basicItem1.buildsInto.length; ++i) {
        for (let j = 0; j < this.state.basicItem2.buildsInto.length; ++j) {
          if (this.state.basicItem2.buildsInto[j] === this.state.basicItem1.buildsInto[i]) {
            for (let k = 0; k < this.state.items.length; ++k) {
              if (this.state.basicItem1.buildsInto[i] === this.state.items[k].key) {
                this.setState({advancedItem: this.state.items[k]});
              }
            }
          }
        }
      }
    }
  }

  render() {
    const basicItems = [];
    const advancedItems = [];
    for (let i = 0; i < this.state.items.length; ++i) {

      if (this.state.items[i].depth === 1) {
        basicItems.push(<img src={this.state.items[i].image} onClick={() => this.addItem(this.state.items[i])}/>);
      }
      else if (this.state.items[i].depth === 2) {
        advancedItems.push(<img src={this.state.items[i].image} onClick={() => this.addItem(this.state.items[i])}/>);
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
                <Card>
                  <CardBody>
                  <img src={this.state.basicItem1.image}/> + <img src={this.state.basicItem2.image}/> = <img src={this.state.advancedItem.image}/>
                  </CardBody>
                </Card>
                  <Card>
                    <CardHeader><strong>Basic</strong></CardHeader>
                    <CardBody>
                      {basicItems}
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader><strong>Advanced</strong></CardHeader>
                    <CardBody>
                      {advancedItems}
                    </CardBody>
                  </Card>
              </CardBody>
            </Card>
          </Row>
          <Row>
            <Card>
              <CardBody>
              </CardBody>
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
