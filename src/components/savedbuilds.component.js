import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { getData } from '../api-helper/api.js';

class SavedBuilds extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    getData("savedBuilds")
  }

  render() {
      return (

        <div>
          <Card>
            <CardHeader>

            </CardHeader>

            <CardBody>

            </CardBody>
          </Card>

        </div>
      )
  }
}

export default SavedBuilds
