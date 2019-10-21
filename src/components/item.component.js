import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import axios from 'axios';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempStrings: {
        stats: "",
        buildsFrom: "",
        buildsInto: "",
      },
      item: {
        key: "",
        name: "",
        type: "",
        bonus: "",
        depth: 0,
        stats: [],
        buildsFrom: [],
        buildsInto: [],
        unique: false,
        image: "",
      },
    }
    this.handleItems = this.handleItems.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/items/' + this.props.match.params.id)
    .then(response => {
      if (response.data.key) {
        let item = Object.assign({}, this.state.item);
        let tempStrings = Object.assign({}, this.state.tempStrings);
        item = response.data;
        let buildsFrom = response.data.buildsFrom.join();
        let buildsInto = response.data.buildsInto.join();
        let statsName = [];
        let statsTitle = [];
        let statsValue = [];
        let stats = "";
        for (let i = 0; i < response.data.stats.length; i++) {
          statsName.push(response.data.stats[i].name);
          statsTitle.push(response.data.stats[i].label);
          statsValue.push(response.data.stats[i].value);
        }
        for (let i = 0; i < statsName.length; i++) {
          stats += statsName[i] + ',' + statsTitle[i] + ',' + statsValue[i];
          if (i < statsName.length - 1) {
            stats += '/';
          }
        }
        tempStrings.stats = stats;
        tempStrings.buildsFrom = buildsFrom;
        tempStrings.buildsInto = buildsInto;
        this.setState({
          item: item, tempStrings: tempStrings
        });
      }
    })
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

    let buildsFrom = this.state.tempStrings.buildsFrom.split(',');
    let buildsInto = this.state.tempStrings.buildsInto.split(',');

    _item.stats = stats;
    _item.buildsFrom = buildsFrom;
    _item.buildsInto = buildsInto;

    this.setState({item: _item}, function() {
      const item = {
        key: this.state.item.key,
        name: this.state.item.name,
        type: this.state.item.type,
        bonus: this.state.item.bonus,
        depth: this.state.item.depth,
        stats: this.state.item.stats,
        buildsFrom: this.state.item.buildsFrom,
        buildsInto: this.state.item.buildsInto,
        unique: this.state.item.unique,
        image: this.state.item.image,
      }
      axios.post('http://localhost:5000/items/update/' + this.props.match.params.id, item)
       .then(res => console.log(res.data))
       window.location = '/edit';
    });
  }

  renderFormGroup(label, type, id, name, handler, state) {
    return (
      <Fragment>
        <FormGroup>
          <Label>{label}</Label>
          <Input type={type} id={id} name={name} onChange={handler} value={state}/>
        </FormGroup>
      </Fragment>
    );
  }

  render() {
    return (
      <div>
        <Card>
          <CardHeader>
            <i class="fa fa-align-justify"></i><strong>Items</strong>
          </CardHeader>
          <CardBody>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col>
                  {this.renderFormGroup("Key: ", "text", "key", "key", this.handleItems, this.state.item.key)}
                  {this.renderFormGroup("Name: ", "text", "name", "name", this.handleItems, this.state.item.name)}
                  {this.renderFormGroup("Type: ", "text", "type", "type", this.handleItems, this.state.item.type)}
                  {this.renderFormGroup("Bonus: ", "text", "bonus", "bonus", this.handleItems, this.state.item.bonus)}
                  {this.renderFormGroup("Depth: ", "number", "depth", "depth", this.handleItems, this.state.item.depth)}
                  {this.renderFormGroup("Stats: ", "text", "stats", "stats", this.handleItems, this.state.tempStrings.stats)}
                  {this.renderFormGroup("Builds From: ", "text", "buildsFrom", "buildsFrom", this.handleItems, this.state.tempStrings.buildsFrom)}
                  {this.renderFormGroup("Builds Into: ", "text", "buildsInto", "buildsInto", this.handleItems, this.state.tempStrings.buildsInto)}
                  <FormGroup>
                    <Row>
                      <Col md={1}><Label>Unique (one per champion): </Label></Col>
                      <Col md={1}><Input type="checkbox" id="unique" name="unique" onClick={this.handleClick} checked={this.state.item.unique} /></Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
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
