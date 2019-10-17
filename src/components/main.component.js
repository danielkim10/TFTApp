import React, { Component } from 'react';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      team: [],
      activeClasses: [],
      activeOrigins: [],
      allChampions: [],
      allItems: [],
      championsPool: [],
    }
  }

  componentDidMount() {

  }

  render() {
      return (
        <div>
          <p>Main</p>
        </div>
      )
  }
}
