import React, { Component } from 'react';
import {Button, Row, Col, Card, CardHeader,
        CardBody, CardFooter } from 'reactstrap';
import { renderFormGroup, renderFormGroupCheckbox } from '../../sub-components/formgroup.js';
import { updateData } from '../../api-helper/api.js';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempStrings: {
        bonus: "",
        stats: "",
        buildsFrom: "",
        buildsInto: "",
        set: "",
      },
      item: {
        id: 0,
        key: "",
        name: "",
        type: "",
        bonus: [],
        depth: 0,
        stats: [],
        buildsFrom: [],
        buildsInto: [],
        unique: false,
        cannotEquip: "",
        set: [],
        image: "",
      },
    }
    this.handleItems = this.handleItems.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // getDataFromId('items', this.props.match.params.id).then(data => {
      // if (data.key) {
        let item = Object.assign({}, this.props.location.state.data);
        let tempStrings = Object.assign({}, this.state.tempStrings);
        // item = data;
        let statsName = [];
        let statsTitle = [];
        let statsValue = [];
        let stats = "";
        for (let i = 0; i < item.stats.length; i++) {
          statsName.push(item.stats[i].name);
          statsTitle.push(item.stats[i].label);
          statsValue.push(item.stats[i].value);
        }
        for (let i = 0; i < statsName.length; i++) {
          stats += statsName[i] + ',' + statsTitle[i] + ',' + statsValue[i];
          if (i < statsName.length - 1) {
            stats += '/';
          }
        }
        tempStrings.stats = stats;
        tempStrings.bonus = item.bonus.join();
        tempStrings.buildsFrom = item.buildsFrom.join();
        tempStrings.buildsInto = item.buildsInto.join();
        tempStrings.set = item.set.join();
        this.setState({
          item: item, tempStrings: tempStrings
        });
      // }
    // });
  }

  handleItems(event) {
    if (event.target.name === "stats" || event.target.name === "buildsFrom" || event.target.name === "buildsInto") {
      let tempStrings = Object.assign({}, this.state.tempStrings);
      tempStrings[event.target.name] = event.target.value;
      this.setState({tempStrings: tempStrings});
    }
    else {
      let item = Object.assign({}, this.state.item);
      item[event.target.name] = event.target.value;
      this.setState({item: item});
    }
  }

  handleClick(event) {
    let item = Object.assign({}, this.state.item);
    item.unique = event.target.checked;
    this.setState({item: item});
  }

  handleSubmit(e) {
    e.preventDefault();
    let _item = Object.assign({}, this.state.item);
    let stats = [];
    let _stats = this.state.tempStrings.stats.split('/');
    for (let i in _stats) {
      let __stats = _stats[i].split(',');
      stats.push({name: __stats[0], label: __stats[1], value: __stats[2]});
    }

    _item.stats = stats;
    _item.buildsFrom = this.state.tempStrings.buildsFrom.split(',');
    _item.buildsInto = this.state.tempStrings.buildsInto.split(',');
    _item.set = this.state.tempStrings.split(',');

    this.setState({item: _item}, function() {
      const item = {
        id: this.state.item.id,
        key: this.state.item.key,
        name: this.state.item.name,
        type: this.state.item.type,
        bonus: this.state.item.bonus,
        depth: this.state.item.depth,
        stats: this.state.item.stats,
        buildsFrom: this.state.item.buildsFrom,
        buildsInto: this.state.item.buildsInto,
        unique: this.state.item.unique,
        cannotEquip: this.state.item.cannotEquip,
        set: this.state.item.set,
        image: this.state.item.image,
      }
      updateData('items', this.props.match.params.id, item, '/edit');
    });
  }

  render() {
    return (
      <div>
        <Card>
          <CardHeader>
            <i class="fa fa-align-justify"></i><strong>Items</strong>
          </CardHeader>
          <CardBody>
              <Row>
                <Col>
                  {renderFormGroup("Id: ", "number", "id", "id", this.handleItems, this.state.item.id)}
                  {renderFormGroup("Key: ", "text", "key", "key", this.handleItems, this.state.item.key)}
                  {renderFormGroup("Name: ", "text", "name", "name", this.handleItems, this.state.item.name)}
                  {renderFormGroup("Type: ", "text", "type", "type", this.handleItems, this.state.item.type)}
                  {renderFormGroup("Bonus: ", "text", "bonus", "bonus", this.handleItems, this.state.tempStrings.bonus)}
                  {renderFormGroup("Depth: ", "number", "depth", "depth", this.handleItems, this.state.item.depth)}
                  {renderFormGroup("Stats: ", "text", "stats", "stats", this.handleItems, this.state.tempStrings.stats)}
                  {renderFormGroup("Builds From: ", "text", "buildsFrom", "buildsFrom", this.handleItems, this.state.tempStrings.buildsFrom)}
                  {renderFormGroup("Builds Into: ", "text", "buildsInto", "buildsInto", this.handleItems, this.state.tempStrings.buildsInto)}
                  {renderFormGroupCheckbox("Unique (one per champion): ", "checkbox", "unique", "unique", this.handleClick, this.state.item.unique)}
                  {renderFormGroup("Cannot Equip: ", "text", "cannotEquip", "cannotEquip", this.handleItems, this.state.item.cannotEquip)}
                  {renderFormGroup("Set: ", "number", "set", "set", this.handleItems, this.state.tempStrings.set)}
                  {renderFormGroup("Image: ", "text", "image", "image", this.handleItems, this.state.item.image)}
                </Col>
              </Row>
          </CardBody>
          <CardFooter>
            <Button type="button" color="primary" onClick={this.handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

export default Item;
