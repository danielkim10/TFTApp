import React, { Component } from 'react';

class Champion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      champion: {
        id: match.params.id,
        key: "",
        name: "",
        origin: [],
        class: [],
        cost: [0, 0, 0],
        ability: {
          name: "",
          description: "",
          type: "",
          manaCost: 0,
          manaStart: 0,
          stats: {
            type: "",
            value: 0,
          }
        }
    }
  }

  componentDidMount() {

  }
}


export default Champion;
