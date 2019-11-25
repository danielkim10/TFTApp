import React, { Component, Fragment } from 'react';
import { Button, Row, Col, Collapse, Card, CardHeader ,CardBody, CardFooter } from 'reactstrap';
import { renderFormGroup } from '../sub-components/formgroup.js'

class PreBuiltCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      fields: props.fields,
      collapsible: props.collapsible,
      collapseToggle: props.collapseToggle,
    }
  }

  render() {
    let fields = [];
    for (let i = 0; i < this.state.fields.length; ++i) {
      let f  = this.state.fields[i];
      fields.push(renderFormGroup(f.label, f.type, f.id, f.name, f.handler, f.state));
    }

    return (
      <Fragment>
          <Card style={{width: "100%"}}>
              <CardHeader>
                <strong>{this.state.title}</strong>
                {this.state.collapsible ? <Button color="primary" onClick={this.championToggle} style={{marginLeft: '1rem'}}>Toggle</Button> : <></>}
              </CardHeader>
              {this.state.collapsible ? <Collapse isOpen={this.state.collapsible}/> : <></>}
              <CardBody>
                <Row>
                  <Col>
                  {fields}
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Button type="button" color="primary" onClick={this.handleSubmit}>Submit</Button>
              </CardFooter>
          </Card>
      </Fragment>
    )
  }
}

export default PreBuiltCard;
