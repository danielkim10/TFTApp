import React, { Component } from 'react';
import { GridGenerator, Layout, Hexagon, Text, Pattern, HexUtils } from 'react-hexgrid';
import './hexgrid.css';

class GameArena extends Component {
  constructor(props) {
    super(props);
    const hexagons = GridGenerator.rectangle(7, 3);
    for (let i = 0; i < props.data.length; ++i) {
      hexagons[i].image = props.data[i].champion.icon;
      hexagons[i].text = props.data[i].champion.name;
    }
    this.state = { hexagons };
  }

  onDrop(event, source, targetProps) {
    const { hexagons } = this.state;
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.image = targetProps.data.image;
        hex.text = targetProps.data.text;
      }
      return hex;
    });
    this.setState({ hexagons: hexas });
  }

  onDragStart(event, source) {
    if (!source.props.data.text) {
      event.preventDefault();
    }
  }

  onDragOver(event, source) {
    const { text } = source.props.data;
    if (!text) {
      event.preventDefault();
    }
  }

  onDragEnd(event, source, success) {
    if (!success) {
      return;
    }
    const { hexagons } = this.state;
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.text = null;
        hex.image = null;
      }
      return hex;
    });
    this.setState({ hexagons: hexas });
  }

  render() {
    const { hexagons } = this.state;
    return (
      <Layout className="arena" size={{ x: 10, y: 10 }} flat={false} spacing={1} origin={{ x: -100, y: -30 }}>
      {
        hexagons.map((hex, i) => (
          <Hexagon
            key={i}
            q={hex.q}
            r={hex.r}
            s={hex.s}
            fill={(hex.image) ? HexUtils.getID(hex) : null}
            data={hex}
            onDragStart={(e, h) => this.onDragStart(e, h)}
            onDragEnd={(e, h, s) => this.onDragEnd(e, h, s)}
            onDrop={(e, h, t) => this.onDrop(e, h, t)}
            onDragOver={(e, h) => this.onDragOver(e, h)}
            >
            <Text>{hex.text}</Text>
            <img src={hex.image} />
          </Hexagon>
        ))
      }
      </Layout>
    );
  }
}

export default GameArena;
