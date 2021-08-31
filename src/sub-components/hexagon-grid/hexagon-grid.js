import React, { Component } from 'react';
import { assets_url } from '../../helper/urls';
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
        let itemsEquipped = [];
        //if (this.props.team.length === 0) {
            for (let i = 0; i < 28; i++) {
                let styleElem = document.head.appendChild(document.createElement("style"));
                let styleElem2 = document.head.appendChild(document.createElement("style"));
            
                styleElem2.innerHTML = `#h${i} {background: black}`;
                styleElem.innerHTML = `#h${i}:before {
                    background: white; 
                }`;
            }
        //}

        //console.log(this.props.team);

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
                default:
                    color = 'orange';
                    break;
            }

            styleElem2.innerHTML = `#h${this.props.team[champion].hexSlot} {background: ${color}}`;
            styleElem.innerHTML = `#h${this.props.team[champion].hexSlot}:before {
                background: url(${this.props.team[champion].champion.patch_data.icon}); 
                background-position: center; 
                background-repeat: no-repeat; 
                background-size: 85px 85px;
            }`;

            for (let i = 0; i < this.props.team[champion].items.length; i++) {
                let image = this.props.team[champion].items[i].patch_data.icon.substring(0, this.props.team[champion].items[i].patch_data.icon.indexOf('dds')).toLowerCase();
                itemsEquipped.push(
                    <div id={`h${this.props.team[champion].hexSlot}-${i}`} key={this.props.team[champion].hexSlot + 'i' + i} className='items-equipped'>
                        <img src={assets_url(image)} id={`i${this.props.team[champion].hexSlot}-${i}`} className='item-size' alt={this.props.team[champion].items[i].name}/>
                    </div>
                );

                let leftMargin = -231;
                let topMargin = 168;

                if (this.props.team[champion].hexSlot > 20) {
                    leftMargin = -72 - 91*(27 - this.props.team[champion].hexSlot);
                    topMargin = 168;
                }
                else if (this.props.team[champion].hexSlot > 13) {
                    leftMargin = -118 - 91*(20 - this.props.team[champion].hexSlot);
                    topMargin = 99;
                }
                else if (this.props.team[champion].hexSlot > 6) {
                    leftMargin = -72 - 91*(13 - this.props.team[champion].hexSlot);
                    topMargin = 30;
                }
                else {
                    leftMargin = -118 - 91*(6 - this.props.team[champion].hexSlot);
                    topMargin = -39;
                }

                if (this.props.team[champion].items.length === 3) {
                    leftMargin -= 20;   
                }
                else if (this.props.team[champion].items.length === 2) {
                    leftMargin -= 10;
                }

                let styleElem3 = document.head.appendChild(document.createElement("style"));
                styleElem3.innerHTML = `#h${this.props.team[champion].hexSlot}-${i} {
                    position: absolute; 
                    display: inline-block; 
                    margin-left: ${leftMargin}px; 
                    margin-top: ${topMargin}px;
                }`;

                let styleElem4 = document.head.appendChild(document.createElement("style"));
                let margin = 20*i;
                styleElem4.innerHTML = `#i${this.props.team[champion].hexSlot}-${i} {
                    width: 20px;
                    height: 20px;
                    margin-left: ${margin}px;
                }`;
            }
        
        }

        let hexagonRow1 = [];
        let hexagonRow2 = [];
        for (let i = 0; i < 7; i++) {
            if (i === 0) {
                hexagonRow1.push(
                    <div id={'h' + i} key={i} className="hexagon" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team[this.props.team.findIndex(tm => tm.hexSlot === i)])} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}>
                    </div>
                    );
            }
            else {
                hexagonRow1.push(<div id={'h' + i} key={i} className="hexagon3" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team[this.props.team.findIndex(tm => tm.hexSlot === i)])} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            hexagonRow1.push(<div id={'h' + (i+7)} key={i+7} className="hexagon2" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team[this.props.team.findIndex(tm => tm.hexSlot === i+7)])} onDrop={(e) => this.props.drop(e, (i+7))} onDragOver={this.allowDrop}/>);
        }

        for (let i = 14; i < 21; i++) {
            if (i === 14) {
                hexagonRow2.push(<div id={'h' + i} key={i} className="hexagon4" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team[this.props.team.findIndex(tm => tm.hexSlot === i)])} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            else {
                hexagonRow2.push(<div id={'h' + i} key={i} className="hexagon5" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team[this.props.team.findIndex(tm => tm.hexSlot === i)])} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            hexagonRow2.push(<div id={'h' + (i+7)} key={i+7} className="hexagon2" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team[this.props.team.findIndex(tm => tm.hexSlot === i+7)])} onDrop={(e) => this.props.drop(e, (i+7))} onDragOver={this.allowDrop}/>);
        }

        return (
            <div style={{minHeight: '400px', minWidth: '700px'}}>
                
                <div style={{display: 'inline-block', width: '100%'}}>
                    {hexagonRow1}
                    
                </div>
                <div style={{display: 'inline-block', width: '100%'}}>
                    {hexagonRow2}
                </div>
                {itemsEquipped}
            </div>
        );
    }
}

export default HexagonGrid;