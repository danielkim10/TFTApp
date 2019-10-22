import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import axios from 'axios';

class Origin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempStrings: {
        bonuses: "",
      },
      origin: {
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        set: "",
        image: "",
      },
    }

    this.handleOrigins = this.handleOrigins.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/origins/' + this.props.match.params.id)
      .then(response => {
        if (response.data.key) {
          let origin = Object.assign({}, this.state.origin);
          let tempStrings = Object.assign({}, this.state.tempStrings);
          origin = response.data;
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

          this.setState({origin: origin, tempStrings: tempStrings});
        }
      })
  }

  handleOrigins(event) {
    if (event.target.name === "bonuses") {
      let tempStrings = Object.assign({}, this.state.tempStrings);
      tempStrings.bonuses = event.target.value;
      this.setState({tempStrings: tempStrings});
    }
    else {
      let origin = Object.assign({}, this.state.origin);
      origin[event.target.name] = event.target.value;
      this.setState({origin: origin});
    }
  }

  handleClick(event) {
    let origin = Object.assign({}, this.state.origin);
    origin.mustBeExact = event.target.checked;
    this.setState({origin: origin});
  }

  handleSubmit(e) {
    e.preventDefault();
    let origin = Object.assign({}, this.state.origin);
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
    origin.bonuses = bonuses;
    this.setState({ origin: origin }, function() {
      const _origin = {
        key: this.state.origin.key,
        name: this.state.origin.name,
        description: this.state.origin.description,
        bonuses: this.state.origin.bonuses,
        mustBeExact: this.state.origin.mustBeExact,
        set: this.state.origin.set,
        image: this.state.origin.image,
      }
      axios.post('http://localhost:5000/origins/update/' + this.props.match.params.id, _origin)
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
            <i class="fa fa-align-justify"></i><strong>Origin</strong>
          </CardHeader>
          <CardBody>
            <Form>
              <Row>
                <Col>
                  {this.renderFormGroup("Key: ", "text", "key", "key", this.handleOrigins, this.state.origin.key)}
                  {this.renderFormGroup("Name: ", "text", "name", "name", this.handleOrigins, this.state.origin.name)}
                  {this.renderFormGroup("Description: ", "text", "description", "description", this.handleOrigins, this.state.origin.description)}
                  {this.renderFormGroup("Bonuses: ", "text", "bonuses", "bonuses", this.handleOrigins, this.state.tempStrings.bonuses)}
                  {this.renderFormGroup("Set: ", "number", "set", "set", this.handleOrigins, this.state.origin.set)}
                  {this.renderFormGroup("Image: ", "text", "image", "image", this.handleOrigins, this.state.origin.image)}
                  <FormGroup>
                  <Row>
                    <Col md={1}><Label>Must be exact: </Label></Col>
                    <Col md={1}><Input type="checkbox" id="exact" name="exact" onClick={this.handleClick} checked={this.state.origin.mustBeExact}/></Col>
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

export default Origin;
