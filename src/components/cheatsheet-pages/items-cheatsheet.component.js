import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Button } from 'reactstrap';
import { getData } from '../../api-helper/api.js'
import { cardColumn } from '../../sub-components/prebuiltcard.js';
import '../../css/colors.css';

class ItemsCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      basicItem1: {
        name: "",
        bonus: "",
        image: "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_emptyslot.tft916critcomponent.png",
        stats: [],
      },
      basicItem2: {
        name: "",
        bonus: "",
        image: "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_emptyslot.tft916critcomponent.png",
        stats: [],
      },
      advancedItem: {
        name: "",
        bonus: "",
        image: "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_emptyslot.tft916critcomponent.png",
        stats: [],
      },
    };
    this.clear = this.clear.bind(this);
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
    else if (depth === 2) {
      if (this.state.basicItem1.name === "" || this.state.basicItem2.name === "") {
        for (let k = 0; k < this.state.items.length; ++k) {
          if (this.state.items[k].key === this.state.advancedItem.buildsFrom[0]) {
            this.setState({basicItem1: this.state.items[k]});
          }
          if (this.state.items[k].key === this.state.advancedItem.buildsFrom[1]) {
            this.setState({basicItem2: this.state.items[k]});
          }
        }
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
    let blankItem = {name: "", bonus: "", image: "http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/tft_item_emptyslot.tft916critcomponent.png", stats: []};
    this.setState({ basicItem1: blankItem, basicItem2: blankItem, advancedItem: blankItem });
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
                  <CardHeader><Row><strong>Builder</strong></Row><Row><Button type="button" color="primary" onClick={this.clear}>Clear</Button></Row></CardHeader>
                  <CardBody>
                  <Row>
                    <Col><Row><img src={this.state.basicItem1.image} class='grayscale'/></Row>
                          <Row>{this.state.basicItem1.name}</Row>
                         <Row><Container>{this.itemStats(this.state.basicItem1)}</Container></Row>
                         <Row>{this.state.basicItem1.bonus}</Row></Col>
                    <Col>+</Col>
                    <Col><Row><img src={this.state.basicItem2.image} class='grayscale'/></Row>
                        <Row>{this.state.basicItem2.name}</Row>
                         <Row><Container>{this.itemStats(this.state.basicItem2)}</Container></Row>
                         <Row>{this.state.basicItem2.bonus}</Row></Col>
                    <Col>=</Col>
                    <Col><Row><img src={this.state.advancedItem.image}/></Row>
                        <Row>{this.state.advancedItem.name}</Row>
                         <Row><Container>{this.itemStats(this.state.advancedItem)}</Container></Row>
                         <Row>{this.state.advancedItem.bonus}</Row></Col>
                  </Row>
                  </CardBody>
                </Card>
                  {cardColumn('Basic', basicItems)}
                  {cardColumn('Advanced', advancedItems)}
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
