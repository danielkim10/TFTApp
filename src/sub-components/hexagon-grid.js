import React, { Component } from 'react';
import './hexagon-grid.css';

class HexagonGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: this.props.team,
        }
    }

    componentDidMount = () => {
    }

    allowDrop = (e) => {
        e.preventDefault();
    }


    render = () => {
        console.log(this.props.team);
        for (let champion in this.props.team) {
            let styleElem = document.head.appendChild(document.createElement("style"));
            let styleElem2 = document.head.appendChild(document.createElement("style"));

            let color = 'gray';
            switch(this.props.team[champion].champion.cost) {
                case 1:
                    color = 'gray';
                    break;
                case 2:
                    color = 'green';
                    break;
                case 3:
                    color = 'blue';
                    break;
                case 4:
                    color = 'purple';
                    break;
                case 5:
                    color = 'orange';
                    break;
            }

            styleElem2.innerHTML = `#h${this.props.team[champion].hexSlot} {background: ${color}}`;
            styleElem.innerHTML = `#h${this.props.team[champion].hexSlot}:before {background: url(${this.props.team[champion].champion.patch_data.icon});}`;
        }

        let hexagonRow1 = [];
        let hexagonRow2 = [];
        for (let i = 0; i < 7; i++) {
            if (i === 0) {
                hexagonRow1.push(<div id={'h' + i} class="hexagon" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            else {
                hexagonRow1.push(<div id={'h' + i} class="hexagon3" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            hexagonRow1.push(<div id={'h' + (i+7)} class="hexagon2" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, (i+7))} onDragOver={this.allowDrop}/>);
        }

        for (let i = 14; i < 21; i++) {
            if (i === 14) {
                hexagonRow2.push(<div id={'h' + i} class="hexagon4" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            else {
                hexagonRow2.push(<div id={'h' + i} class="hexagon5" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            hexagonRow2.push(<div id={'h' + (i+7)} class="hexagon2" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, (i+7))} onDragOver={this.allowDrop}/>);
        }

        return (
            <div style={{minHeight: '400px'}}>
                <div style={{display: 'inline-block'}}>
                    {hexagonRow1}
                </div>
                <div style={{display: 'inline-block'}}>
                    {hexagonRow2}
                </div>
            </div>
        );
    }
}

export default HexagonGrid;