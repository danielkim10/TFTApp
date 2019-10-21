import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import axios from 'axios';

class Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempStrings: {
        bonuses: "",
      },
      class: {
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        image: "",
      },
    }

    this.handleClasses = this.handleClasses.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/classes/' + this.props.match.params.id)
      .then(response => {
        if (response.data.key) {
          let classe = Object.assign({}, this.state.class);
          let tempStrings = Object.assign({}, this.state.tempStrings);
          classe = response.data;
          let needed = [];
          let effect = [];
          let checkpoint = "";
          for (let i = 0; i < response.data.bonuses.length; i++) {
            needed.push(response.data.bonuses[i].needed);
            checkpoint += needed[i].toString();
            if (i < response.data.bonuses.length -1) {
              checkpoint += ',';
            }
          }
          checkpoint += '/'
          for (let i = 0; i < response.data.bonuses.length; i++) {
            effect.push(response.data.bonuses[i].effect);
            checkpoint += effect[i];
            if (i < response.data.bonuses.length - 1) {
              checkpoint += ','
            }
          }
          tempStrings.bonuses = checkpoint;

          this.setState({class: classe, tempStrings: tempStrings});
        }
      })
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

    let neededString = object[0].split(',');
    for (let subString in neededString) {
      needed.push(parseInt(neededString[subString]));
    }
    let effectString = object[1].split(',');
    for (let subString in effectString) {
      effect.push(effectString[subString]);
    }

    for (let i = 0; i < needed.length; i++) {
      bonuses.push({needed: needed[i], effect: effect[i]});
    }
    classe.bonuses = bonuses;
    this.setState({ class: classe }, function() {
      const _class = {
        key: this.state.class.key,
        name: this.state.class.name,
        description: this.state.class.description,
        bonuses: this.state.class.bonuses,
        mustBeExact: this.state.class.mustBeExact,
        image: this.state.class.image,
      }
      axios.post('http://localhost:5000/classes/update/' + this.props.match.params.id, _class)
        .then(res => console.log(res.data));
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
      <Card style={{width: "100%"}}>
      <CardHeader>
        <i class="fa fa-align-justify"></i><strong>Classes</strong>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col>
            {this.renderFormGroup("Key: ", "text", "key", "key", this.handleClasses, this.state.class.key)}
            {this.renderFormGroup("Name: ", "text", "name", "name", this.handleClasses, this.state.class.name)}
            {this.renderFormGroup("Description: ", "text", "description", "description", this.handleClasses, this.state.class.description)}
            {this.renderFormGroup("Bonuses: ", "text", "bonuses", "bonuses", this.handleClasses, this.state.tempStrings.bonuses)}
            {this.renderFormGroup("Image: ", "text", "image", "image", this.handleClasses, this.state.class.image)}
            <FormGroup>
            <Row>
              <Col md={1}><Label>Must be exact: </Label></Col>
              <Col md={1}><Input type="checkbox" id="exact" name="exact" onClick={this.handleClick} checked={this.state.class.mustBeExact}/></Col>
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

export default Class;
