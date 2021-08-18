import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Hexagon from './hexagon.js';

/*
    Hexagonal grid code borrowed from https://eperezcosano.github.io/hex-grid/
*/

class HexagonGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: this.props.team,
        }
    }

    componentDidMount = () => {
        //this.drawGrid();
    }

    drawGrid = () => {
        let width = 400;
        let height = 700;
        console.log(this.props.team);
        const r = 50;
        const a = 2*Math.PI/6;
        let hexagons = [];
        let ycount = 0;
        let xcount = 0;
        for (let y = r; y + r * Math.sin(a) < height && ycount < 7; y += 2* r * Math.sin(a)) {
            
            for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width && xcount < 4; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
                xcount++;
                if (this.props.team.length > 0) {
                    //hexagons.push(<Hexagon x={x} y={x} img={this.props.team[0].champion.championId}/>);
                    hexagons.push(<img src={require(`../data/champions/` +  this.props.team[0].champion.championId + `.png`)}/>);
                    // this.drawHexagon(x, y, this.props.team[0].champion.championId);
                }
                else {
                    // this.drawHexagon(x, y, null);
                    hexagons.push(<Hexagon x={x} y={y}/>);
                }
            }
        ycount++;
        xcount=0;
        }
        return hexagons;
    }

    redrawGrid = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 700, 400);

        let width = 400;
        let height = 700;
        console.log(this.props.team);
        const r = 50;
        const a = 2*Math.PI/6;
        let hexagons = [];
        let ycount = 0;
        let xcount = 0;
        for (let y = r; y + r * Math.sin(a) < height && ycount < 7; y += 2* r * Math.sin(a)) {
            
            for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width && xcount < 4; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
                xcount++;
                if (this.props.team.length > 0) {
                    hexagons.push(<img src={require(`../data/champions/` +  this.props.team[0].champion.championId + `.png`)}/>);
                    //hexagons.push(<Hexagon x={x} y={x} img={this.props.team[0].champion.championId}/>);
                    //this.redrawHexagon(x, y, this.props.team[0].champion.championId);
                }
                else {
                    //this.redrawHexagon(x, y, null);
                    hexagons.push(<Hexagon x={x} y={y}/>);
                }
            }
        ycount++;
        xcount=0;
        }
        return hexagons;
    }

    drawHexagon = (x ,y, image) => {
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
    }

    redrawHexagon = (x ,y, img) => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 700, 400);

        const a = 2 * Math.PI / 6;
        const r = 50;

        
        
        if (img !== null) {
            // let drawing = new Image();
            // drawing.src = require(`../data/champions/` + img + `.png`);
            // drawing.onLoad = () => {
            //     ctx.drawImage(drawing, 10, 10);
            // }
        }
        else {
            ctx.beginPath();
            for (var i = 0; i < 6; i++) {
                ctx.lineTo(y + r * Math.sin(a * i), x + r * Math.cos(a * i));
            }
            ctx.closePath();
            ctx.stroke();
        }
    }



    render = () => {
        

        return (
            <div>
                <Button onClick={() => this.redrawGrid()}>Test</Button>
            <canvas id="canvas" width="700" height="400">{this.drawGrid()}</canvas>
            </div>
        );
    }
}

export default HexagonGrid;