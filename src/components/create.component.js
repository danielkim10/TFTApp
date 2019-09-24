import React, { Component } from 'react';

export default class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      champion: {
        id: 0,
        key: "",
        name: "",
        origin: [],
        class: [],
        cost: 0,
        ability: {
          name: "",
          description: "",
          type: "",
          manaCost: 0,
          manaStart: 0,
          stats: {
            type: "",
            value: "",
          }
        },
        stats: {
          offense: {
            damage: 0,
            attackSpeed: 0,
            spellPower: 0,
            critChance: 0,
            range: 0,
          },
          defense: {
            health: 0,
            armor: 0,
            magicResist: 0,
          }
        },
      },

      class: {

      },

      item: {

      },

      origin: {

      },

    }
  }

  render() {
      return (
        <div>
          <p>Create</p>
        </div>
      )
  }
}
