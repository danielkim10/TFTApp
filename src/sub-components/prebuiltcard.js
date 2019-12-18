import React, { Fragment } from 'react';
import { Col, Card, CardHeader ,CardBody } from 'reactstrap';

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
