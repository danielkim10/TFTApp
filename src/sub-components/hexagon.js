import React, { Component } from 'react';

/*
    Hexagon code borrowed from https://eperezcosano.github.io/hex-grid/
*/

class Hexagon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: this.props.x,
            y: this.props.y,
        }
    }

    componentDidMount = () => {
        this.drawHexagon(this.props.x, this.props.y);
    }

    drawHexagon = (x ,y) => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const a = 2 * Math.PI / 6;
        const r = 50;

        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(y + r * Math.sin(a * i), x + r * Math.cos(a * i));
        }
        ctx.closePath();
        ctx.stroke();
        if (this.props.img !== undefined) {
            ctx.drawImage(require(`../data/champions/` + this.props.img + `.png`));
        }
    }

    redrawHexagon = (x ,y) => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 700, 400);

        const a = 2 * Math.PI / 6;
        const r = 50;

        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(y + r * Math.sin(a * i), x + r * Math.cos(a * i));
        }
        ctx.closePath();
        ctx.stroke();
        if (this.props.img !== undefined) {
            ctx.drawImage(require(`../data/champions/` + this.props.img + `.png`));
        }
    }

    render = () => {
        return (
            <div>{() => this.drawHexagon(this.state.x, this.state.y)}</div>
        );
    }
}

export default Hexagon;