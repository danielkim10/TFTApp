import React, { Component } from 'react';
import './hexagon.css';
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
        //this.drawHexagon(this.props.x, this.props.y);
    }

    drawHexagon = (x ,y) => {
        // const canvas = document.getElementById('canvas');
        // const ctx = canvas.getContext('2d');

        // const a = 2 * Math.PI / 6;
        // const r = 50;

        // ctx.beginPath();
        // for (var i = 0; i < 6; i++) {
        //     ctx.lineTo(y + r * Math.sin(a * i), x + r * Math.cos(a * i));
        // }
        // ctx.closePath();
        // ctx.stroke();
        // if (this.props.img !== undefined) {
        //     ctx.drawImage(require(`../data/champions/` + this.props.img + `.png`));
        // }
    }

    redrawHexagon = (x ,y) => {
        // const canvas = document.getElementById('canvas');
        // const ctx = canvas.getContext('2d');

        // ctx.clearRect(0, 0, 700, 400);

        // const a = 2 * Math.PI / 6;
        // const r = 50;

        // ctx.beginPath();
        // for (var i = 0; i < 6; i++) {
        //     ctx.lineTo(y + r * Math.sin(a * i), x + r * Math.cos(a * i));
        // }
        // ctx.closePath();
        // ctx.stroke();
        // if (this.props.img !== undefined) {
        //     ctx.drawImage(require(`../data/champions/` + this.props.img + `.png`));
        // }
    }

    render = () => {
        return (
            <div>
                <div style={{display: 'inline-block'}}>
                    <div id="h0" class="hexagon"></div>
                    <div id="h7" class="hexagon2"></div>
                    <div id="h1" class="hexagon3"></div>
                    <div id="h8" class="hexagon2"></div>
                    <div id="h2" class="hexagon3"></div>
                    <div id="h9" class="hexagon2"></div>
                    <div id="h3" class="hexagon3"></div>
                    <div id="h10" class="hexagon2"></div>
                    <div id="h4" class="hexagon3"></div>
                    <div id="h11" class="hexagon2"></div>
                    <div id="h5" class="hexagon3"></div>
                    <div id="h12" class="hexagon2"></div>
                    <div id="h6" class="hexagon3"></div>
                    <div id="h13" class="hexagon2"></div>
                </div>
                <div style={{display: 'inline-block'}}>
                    <div id="h14" class="hexagon4"></div>
                    <div id="h21" class="hexagon2"></div>
                    <div id="h15" class="hexagon5"></div>
                    <div id="h22" class="hexagon2"></div>
                    <div id="h16" class="hexagon5"></div>
                    <div id="h23" class="hexagon2"></div>
                    <div id="h17" class="hexagon5"></div>
                    <div id="h24" class="hexagon2"></div>
                    <div id="h18" class="hexagon5"></div>
                    <div id="h25" class="hexagon2"></div>
                    <div id="h19" class="hexagon5"></div>
                    <div id="h26" class="hexagon2"></div>
                    <div id="h20" class="hexagon5"></div>
                    <div id="h27" class="hexagon2"></div>
                </div>
            </div>
        );
    }
}

export default Hexagon;