import React, { Component, Fragment } from 'react';
import { Button, Row, Col, Collapse, Card, CardHeader ,CardBody, CardFooter } from 'reactstrap';
import { renderFormGroup } from '../sub-components/formgroup.js'

export function cardColumn(title, items) {
  return (
    <Fragment>
      <Col>
      <Card>
        <CardHeader>
          <strong>{title}</strong>
        </CardHeader>
        <CardBody>
          <Col>{items}</Col>
        </CardBody>
      </Card>
      </Col>
    </Fragment>
  );
}
