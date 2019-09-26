import React, { Component } from 'react'
import {FormGroup, Input, Label} from 'reactstrap'

class Formgroups extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.renderFormGroup = this.renderFormGroup.bind(this);
  }

  renderFormGroup(name, type, id, handler) {
    return (<FormGroup>
      <Label>{name}</Label>
      <Input type={type} id={id} name={id} onChange={handler} />
    </FormGroup>);
  }

  render() {
    return (
      this.renderFormGroup()
    );
  }
}

export default Formgroups;
