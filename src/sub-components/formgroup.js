import React, { Fragment } from 'react';
import {FormGroup, Label, Input, Row, Col} from 'reactstrap';

export function renderFormGroup(label, type, id, name, handler, state) {
  return (
    <Fragment>
      <FormGroup>
        <Label>{label}</Label>
        <Input type={type} id={id} name={name} onChange={handler} value={state}/>
      </FormGroup>
    </Fragment>
  );
}

export function renderFormGroupCheckbox(label, type, id, name, handler, state) {
  return (
    <Fragment>
      <FormGroup>
        <Row>
          <Col md={1}><Label>{label}</Label></Col>
          <Col md={1}><Input type={type} id={id} name={name} onClick={handler} checked={state}/></Col>
        </Row>
      </FormGroup>
    </Fragment>
  );
}
