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
        key: "",
        name: "",
        bonus: "",
        stats: "",
        buildsFrom: "",
        buildsInto: "",
        unique: "",
        cannotEquip: "",
        set: "",
        image: "",
      },
      item: {
        id: 0,
        key: [],
        name: [],
        type: "",
        bonus: [],
        depth: 0,
        stats: [],
        buildsFrom: [],
        buildsInto: [],
        unique: [],
        cannotEquip: [],
        set: [],
        image: [],
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

        tempStrings.key = item.key.join();
        tempStrings.name = item.name.join();
        if (item.cannotEquip !== undefined) {
          tempStrings.cannotEquip = item.cannotEquip.join();
        }
        tempStrings.buildsFrom = item.buildsFrom.join();
        tempStrings.buildsInto = item.buildsInto.join();
        tempStrings.unique = "";
        for (let i in item.unique) {
          tempStrings.unique += item.unique[i].toString();
          if (i < item.unique.length - 1) {
            tempStrings.unique += ',';
          }
        }
        tempStrings.set = item.set.join();
        tempStrings.image = item.image.join();
        this.setState({
          item: item, tempStrings: tempStrings
        });
      // }
    // });
  }

  handleTempStrings = (event) => {
    let tempStrings = Object.assign({}, this.state.tempStrings);
    tempStrings[event.target.name] = event.target.value;
    this.setState({ tempStrings: tempStrings });
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

    let buildsFrom = this.state.tempStrings.buildsFrom.split(',');
    if (buildsFrom[0] != "") {
      buildsFrom.forEach((id) => {
        _item.buildsFrom.push(parseInt(id));
      })
    }

    let buildsInto = this.state.tempStrings.buildsInto.split(',');
    if (buildsInto[0] != "") {
      buildsInto.forEach((id) => {
        _item.buildsInto.push(parseInt(id));
      })
    }


    _item.key = this.state.tempStrings.key.split(',');
    _item.name = this.state.tempStrings.name.split(',');
    _item.unique = [];
    let unique = this.state.tempStrings.unique.split(',');
    for (let i in unique) {
      if (unique[i] === 'true') {
        _item.unique[i] = true;
      }
      else {
        _item.unique[i] = false;
      }
    }
    _item.cannotEquip = this.state.tempStrings.cannotEquip.split(',');
    _item.set = this.state.tempStrings.set.split(',');
    _item.image = this.state.tempStrings.image.split(',');

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
                  {renderFormGroup("Key: ", "text", "key", "key", this.handleTempStrings, this.state.tempStrings.key)}
                  {renderFormGroup("Name: ", "text", "name", "name", this.handleTempStrings, this.state.tempStrings.name)}
                  {renderFormGroup("Type: ", "text", "type", "type", this.handleItems, this.state.item.type)}
                  {renderFormGroup("Bonus: (A/B/C/D)", "textarea", "bonus", "bonus", this.handleTempStrings, this.state.tempStrings.bonus)}
                  {renderFormGroup("Depth: ", "number", "depth", "depth", this.handleItems, this.state.item.depth)}
                  {renderFormGroup("Stats: (Name,Label,Value/Name,Label,Value^Name,Label,Value/Name,Label,Value)", "textarea", "stats", "stats", this.handleTempStrings, this.state.tempStrings.stats)}
                  {renderFormGroup("Builds From: ", "text", "buildsFrom", "buildsFrom", this.handleTempStrings, this.state.tempStrings.buildsFrom)}
                  {renderFormGroup("Builds Into: ", "text", "buildsInto", "buildsInto", this.handleTempStrings, this.state.tempStrings.buildsInto)}
                  {renderFormGroup("Unique (one per champion): ", "text", "unique", "unique", this.handleTempStrings, this.state.tempStrings.unique)}
                  {renderFormGroup("Cannot Equip: ", "text", "cannotEquip", "cannotEquip", this.handleTempStrings, this.state.tempStrings.cannotEquip)}
                  {renderFormGroup("Set: (A,A,A,A)", "text", "set", "set", this.handleTempStrings, this.state.tempStrings.set)}
                  {renderFormGroup("Image: ", "textarea", "image", "image", this.handleTempStrings, this.state.tempStrings.image)}
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
