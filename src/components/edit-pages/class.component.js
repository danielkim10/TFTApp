import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import axios from 'axios';
import { renderFormGroup, renderFormGroupCheckbox } from '../../sub-components/formgroup.js';
import { getDataFromId, updateData } from '../../api-helper/api.js';

class Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempStrings: {
        bonuses: "",
      },
      class: {
        id: 0,
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        set: 0,
        image: "",
      },
    }

    this.handleClasses = this.handleClasses.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // getDataFromId('classes', this.props.match.params.id).then(data => {
      // if (data.key) {
        let classe = Object.assign({}, this.props.location.state.data);
        let tempStrings = Object.assign({}, this.state.tempStrings);
        // classe = data;
        let needed = [];
        let effect = [];
        let checkpoint = "";
        for (let i = 0; i < classe.bonuses.length; i++) {
          needed.push(classe.bonuses[i].needed);
          checkpoint += needed[i].toString();
          if (i < classe.bonuses.length -1) {
            checkpoint += '^';
          }
        }
        checkpoint += '/'
        for (let i = 0; i < classe.bonuses.length; i++) {
          effect.push(classe.bonuses[i].effect);
          checkpoint += effect[i];
          if (i < classe.bonuses.length - 1) {
            checkpoint += '^'
          }
        }
        tempStrings.bonuses = checkpoint;

        this.setState({class: classe, tempStrings: tempStrings});
      // }
    // });
  }

  handleClasses(event) {
    if (event.target.name === "bonuses") {
      let tempStrings = Object.assign({}, this.state.tempStrings);
      tempStrings.bonuses = event.target.value;
      this.setState({tempStrings: tempStrings});
    }
    else {
      let classe = Object.assign({}, this.state.class);
      classe[event.target.name] = event.target.value;
      this.setState({class: classe});
    }
  }

  handleClick(event) {
    let classe = Object.assign({}, this.state.class);
    classe.mustBeExact = event.target.checked;
    this.setState({class: classe})
  }

  handleSubmit(e) {
    e.preventDefault();
    let classe = Object.assign({}, this.state.class);
    let object = this.state.tempStrings.bonuses.split('/');
    let needed = [];
    let effect = [];
    let bonuses = [];

    let neededString = object[0].split('^');
    for (let subString in neededString) {
      needed.push(parseInt(neededString[subString]));
    }
    let effectString = object[1].split('^');
    for (let subString in effectString) {
      effect.push(effectString[subString]);
    }

    for (let i = 0; i < needed.length; i++) {
      bonuses.push({needed: needed[i], effect: effect[i]});
    }
    classe.bonuses = bonuses;
    this.setState({ class: classe }, function() {
      const _class = {
        id: this.state.class.id,
        key: this.state.class.key,
        name: this.state.class.name,
        description: this.state.class.description,
        bonuses: this.state.class.bonuses,
        mustBeExact: this.state.class.mustBeExact,
        set: this.state.class.set,
        image: this.state.class.image,
      }
      updateData('classes', this.props.match.params.id, _class, '/');
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
      <Card style={{width: "100%"}}>
      <CardHeader>
        <i class="fa fa-align-justify"></i><strong>Classes</strong>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col>
            {renderFormGroup("Id: ", "number", "id", "id", this.handleClasses, this.state.class.id)}
            {renderFormGroup("Key: ", "text", "key", "key", this.handleClasses, this.state.class.key)}
            {renderFormGroup("Name: ", "text", "name", "name", this.handleClasses, this.state.class.name)}
            {renderFormGroup("Description: ", "text", "description", "description", this.handleClasses, this.state.class.description)}
            {renderFormGroup("Bonuses: ", "text", "bonuses", "bonuses", this.handleClasses, this.state.tempStrings.bonuses)}
            {renderFormGroup("Set: ", "number", "set", "set", this.handleClasses, this.state.class.set)}
            {renderFormGroup("Image: ", "text", "image", "image", this.handleClasses, this.state.class.image)}
            {renderFormGroupCheckbox("Must be exact: ", "checkbox", "exact", "exact", this.handleClick, this.state.class.mustBeExact)}
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

export default Class;
