import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Button, Tooltip } from 'reactstrap';
import { getData } from '../../../api-helper/api.js'
import { cardColumn } from '../../../sub-components/prebuiltcard.js';
import '../../../css/colors.css';

import './items-cheatsheet.component.css'

class ItemsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      basicItem1: {
        name: "",
        bonus: "",
        image: "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_unusableslot.tft3_1013_gamevariations.png",
        stats: [],
      },
      basicItem2: {
        name: "",
        bonus: "",
        image: "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_unusableslot.tft3_1013_gamevariations.png",
        stats: [],
      },
      advancedItem: {
        name: "",
        bonus: "",
        image: "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_unusableslot.tft3_1013_gamevariations.png",
        stats: [],
      },
    };
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    getData('items').then(data => {
      let itemsA = data.filter(item => item.set.includes(1)).sort(this.compare);
      let items = Object.assign({}, this.state.items);
      for (let i = 0; i < itemsA.length; ++i) {
        items[itemsA[i].key] = itemsA[i];
      }
      this.setState({items: items});
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
          this.itemCombination(item.depth);
        });
      }
      else if (this.state.basicItem2.name === "") {
        this.setState({basicItem2: item}, function() {
          this.itemCombination(item.depth);
        });
      }
    }
    else {
      if (this.state.advancedItem.name === "") {
        this.setState({advancedItem: item}, function() {
          this.itemCombination(item.depth);
        });
      }
    }
  }

  itemCombination(depth) {
    if (depth === 1) {
      if (this.state.basicItem1.name !== "" && this.state.basicItem2.name !== "") {
        for (let i = 0; i < this.state.basicItem1.buildsInto.length; ++i) {
          for (let j = 0; j < this.state.basicItem2.buildsInto.length; ++j) {
            if (this.state.basicItem2.buildsInto[j] === this.state.basicItem1.buildsInto[i]) {
              Object.keys(this.state.items).forEach((key, index) => {
                if (this.state.basicItem1.buildsInto[i] === this.state.items[key].id) {
                  this.setState({advancedItem: this.state.items[key]});
                }
              })
            }
          }
        }
      }
    }
    else if (depth === 2) {
      if (this.state.basicItem1.name === "" || this.state.basicItem2.name === "") {
        Object.keys(this.state.items).forEach((key, index) => {
          if (this.state.items[key].id === Math.floor(this.state.advancedItem.id / 10)) {
            this.setState({basicItem1: this.state.items[key]});
          }
          if (this.state.items[key].id === this.state.advancedItem.id % 10) {
            this.setState({basicItem2: this.state.items[key]});
          }
        })
      }
    }
  }

  itemStats(item) {
    let stats = [];
    for (let i = 0; i < item.stats.length; ++i) {
      if (item.depth !== 1 && (item.stats[i].name !== 'class' && item.stats[i].name !== 'origin'))
        stats.push(<Row>{item.stats[i].label}</Row>)
    }
    return stats;
  }

  clear() {
    let blankItem = {name: "", bonus: "", image: "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_unusableslot.tft3_1013_gamevariations.png", stats: []};
    this.setState({ basicItem1: blankItem, basicItem2: blankItem, advancedItem: blankItem });
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
    const basicItems = [];
    const advancedItems = [];
    Object.keys(this.state.items).forEach((key, index) => {
      if (this.state.items[key].depth === 1) {
        basicItems.push(
          <div className='champion-spacing' onClick={() => this.addItem(this.state.items[key])}>
            <img src={this.state.items[key].image[0]} className='itemMargins' />
              <p className='item-name'>{this.state.items[key].name[0]}</p>
          </div>
        );
      }
      else if (this.state.items[key].depth === 2) {
        advancedItems.push(
          <div className='champion-spacing' onClick={() => this.addItem(this.state.items[key])}>
            <img src={this.state.items[key].image[0]} className='itemMargins' />
              <p className='item-name'>{this.state.items[key].name[0]}</p>
          </div>
        );
      }
    })

      return (
        <div>
        <Row>
        <Col sm={1}></Col>
        <Col sm={10}>
          <Row>
            <Card>
                <Card>
                  <CardHeader style={{backgroundColor: '#ffffff'}}><Row><strong>Builder</strong></Row><Row><Button type="button" color="primary" onClick={this.clear}>Clear</Button></Row></CardHeader>
                  <CardBody>
                  <Row>
                    <Col><Row><img src={this.state.basicItem1.image[0]}/></Row>
                          <Row>{this.state.basicItem1.name[0]}</Row>
                         <Row><Container>{this.itemStats(this.state.basicItem1)}</Container></Row>
                         <Row>{this.state.basicItem1.bonus[0]}</Row></Col>
                    <Col>+</Col>
                    <Col><Row><img src={this.state.basicItem2.image[0]}/></Row>
                        <Row>{this.state.basicItem2.name[0]}</Row>
                         <Row><Container>{this.itemStats(this.state.basicItem2)}</Container></Row>
                         <Row>{this.state.basicItem2.bonus[0]}</Row></Col>
                    <Col>=</Col>
                    <Col><Row><img src={this.state.advancedItem.image[0]}/></Row>
                        <Row>{this.state.advancedItem.name[0]}</Row>
                         <Row><Container>{this.itemStats(this.state.advancedItem)}</Container></Row>
                         <Row>{this.state.advancedItem.bonus[0]}</Row></Col>
                  </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader style={{backgroundColor: '#ffffff'}}><strong>Basic</strong></CardHeader>
                  <CardBody>
                    {basicItems}
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader style={{backgroundColor: '#ffffff'}}><strong>Advanced</strong></CardHeader>
                  <CardBody>
                    {advancedItems}
                  </CardBody>
                </Card>
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
