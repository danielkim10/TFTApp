import React, { Component } from 'react';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      team: [],
    }
  }

  render() {
      return (
        <div>
          <p>Main</p>
        </div>
      )
  }
}
