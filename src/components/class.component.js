import React, { Component, Fragment } from 'react';
import {Button, Row, Col, Form, FormGroup, Card, CardHeader,
        CardBody, CardFooter, Label, Input} from 'reactstrap';
import Select from 'react-select';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import axios from 'axios';

class Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      class: {
        key: "",
        name: "",
        description: "",
        bonuses: [],
        mustBeExact: false,
        image: "",
      },
    }
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default Class;
