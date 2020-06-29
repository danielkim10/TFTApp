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
          for (let j = 0; j < item.stats[i].length; j++) {
            statsName.push(item.stats[i][j].name);
            statsTitle.push(item.stats[i][j].label);
            statsValue.push(item.stats[i][j].value);
          }

          for (let j = 0; j < statsName.length; j++) {
            stats += statsName[j] + ',' + statsTitle[j] + ',' + statsValue[j];
            if (j < statsName.length - 1) {
              stats += '/';
            }
          }
          if (i < item.stats.length - 1) {
            stats += '^';
          }
          statsName = [];
          statsTitle = [];
          statsValue = [];
        }

        // for (let i = 0; i < item.stats.length; i++) {
        //   statsName.push(item.stats[i].name);
        //   statsTitle.push(item.stats[i].label);
        //   statsValue.push(item.stats[i].value);
        // }
        // for (let i = 0; i < statsName.length; i++) {
        //   stats += statsName[i] + ',' + statsTitle[i] + ',' + statsValue[i];
        //   if (i < statsName.length - 1) {
        //     stats += '/';
        //   }
        // }
        tempStrings.stats = stats;

        let bonus = "";
        for (let i = 0; i < item.bonus.length; i++) {
          bonus += item.bonus[i];
          if (i < item.bonus.length - 1) {
            bonus += '^';
          }
        }
        tempStrings.bonus = bonus;

        let buildsFrom = "";
        for (let i in item.buildsFrom) {
          buildsFrom += item.buildsFrom[i].join();
          if (i < item.buildsFrom.length - 1) {
            buildsFrom += "/";
          }
        }

        let buildsInto = "";
        for (let i in item.buildsInto) {
          buildsInto += item.buildsInto[i].join();
          if (i < item.buildsInto.length - 1) {
            buildsInto += "/";
          }
        }
        tempStrings.buildsFrom = buildsFrom;
        tempStrings.buildsInto = buildsInto;
        tempStrings.set = item.set.join();
        this.setState({
          item: item, tempStrings: tempStrings
        });
      // }
    // });
  }

  handleItems(event) {
    if (event.target.name === "bonus" || event.target.name === "stats" || event.target.name === "buildsFrom" ||
        event.target.name === "buildsInto" || event.target.name === "set") {
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
    let stats4 = [];
    let stats1 = this.state.tempStrings.stats.split('^');
    for (let i in stats1) {
      let stats2 = stats1[i].split('/');
      for (let j in stats2) {
        let stats3 = stats2[j].split(',');
        stats4.push({name: stats3[0], label: stats3[1], value: stats3[2]});
      }
      stats.push(stats4);
      stats4 = [];
    }

    // let _stats = this.state.tempStrings.stats.split('/');
    // for (let i in _stats) {
    //   let __stats = _stats[i].split(',');
    //   stats.push({name: __stats[0], label: __stats[1], value: __stats[2]});
    // }

    _item.bonus = this.state.tempStrings.bonus.split('^');
    _item.stats = stats;

    let buildsFrom = [];
    let buildsFrom1 = [];
    let buildsFrom2 = this.state.tempStrings.buildsFrom.split('/');
    for (let i in buildsFrom2) {
        buildsFrom.push(buildsFrom2[i].split(','));
        //buildsFrom.push(buildsFrom1);
        //buildsFrom1 = [];
    }

    let buildsInto = [];
    let buildsInto1 = [];
    let buildsInto2 = this.state.tempStrings.buildsInto.split('/');
    for (let i in buildsInto2) {
      buildsInto.push(buildsInto2[i].split(','));
      //buildsInto.push(buildsInto1);
      //buildsInto1 = [];
    }

    _item.buildsFrom = buildsFrom;
    _item.buildsInto = buildsInto;
    _item.set = this.state.tempStrings.set.split(',');

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
                  {renderFormGroup("Bonus: (A/B/C/D)", "text", "bonus", "bonus", this.handleItems, this.state.tempStrings.bonus)}
                  {renderFormGroup("Depth: ", "number", "depth", "depth", this.handleItems, this.state.item.depth)}
                  {renderFormGroup("Stats: (Name,Label,Value/Name,Label,Value^Name,Label,Value/Name,Label,Value)", "text", "stats", "stats", this.handleItems, this.state.tempStrings.stats)}
                  {renderFormGroup("Builds From: (A,B/A,B)", "text", "buildsFrom", "buildsFrom", this.handleItems, this.state.tempStrings.buildsFrom)}
                  {renderFormGroup("Builds Into: (A,B,C,D/A,B,C,D)", "text", "buildsInto", "buildsInto", this.handleItems, this.state.tempStrings.buildsInto)}
                  {renderFormGroupCheckbox("Unique (one per champion): ", "checkbox", "unique", "unique", this.handleClick, this.state.item.unique)}
                  {renderFormGroup("Cannot Equip: ", "text", "cannotEquip", "cannotEquip", this.handleItems, this.state.item.cannotEquip)}
                  {renderFormGroup("Set: (A,A,A,A)", "text", "set", "set", this.handleItems, this.state.tempStrings.set)}
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
