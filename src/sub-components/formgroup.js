import React, { Fragment } from 'react';
import {FormGroup, Label, Input} from 'reactstrap';

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
