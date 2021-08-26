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
        let itemsEquipped = [];
        if (this.props.team.length === 0) {
            for (let i = 0; i < 28; i++) {
                let styleElem = document.head.appendChild(document.createElement("style"));
                let styleElem2 = document.head.appendChild(document.createElement("style"));
            
                styleElem2.innerHTML = `#h${i} {background: black}`;
                styleElem.innerHTML = `#h${i}:before {
                    background: white; 
                }`;
            }
        }

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
            styleElem.innerHTML = `#h${this.props.team[champion].hexSlot}:before {
                background: url(${this.props.team[champion].champion.patch_data.icon}); 
                background-position: center; 
                background-repeat: no-repeat; 
                background-size: 85px 85px;
            }`;

            for (let item in this.props.team[champion].items) {
                let image = this.props.team[champion].items[item].patch_data.icon.substring(0, this.props.team[champion].items[item].patch_data.icon.indexOf('dds'));
                itemsEquipped.push(<div className='items-equipped'><img src={`https://raw.communitydragon.org/latest/game/${image.toLowerCase()}png`} className='item-size'/></div>);
                console.log(this.props.team[champion].items[item]);
            }
        
        }
        console.log(itemsEquipped.length);

        let hexagonRow1 = [];
        let hexagonRow2 = [];
        for (let i = 0; i < 7; i++) {
            if (i === 0) {
                hexagonRow1.push(
                    <div id={'h' + i} className="hexagon" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}>
                    </div>
                    );
            }
            else {
                hexagonRow1.push(<div id={'h' + i} className="hexagon3" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            hexagonRow1.push(<div id={'h' + (i+7)} className="hexagon2" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, (i+7))} onDragOver={this.allowDrop}/>);
        }

        for (let i = 14; i < 21; i++) {
            if (i === 14) {
                hexagonRow2.push(<div id={'h' + i} className="hexagon4" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            else {
                hexagonRow2.push(<div id={'h' + i} className="hexagon5" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, i)} onDragOver={this.allowDrop}/>);
            }
            hexagonRow2.push(<div id={'h' + (i+7)} className="hexagon2" draggable="true" onDragStart={(e) => this.props.drag(e, this.props.team)} onDrop={(e) => this.props.drop(e, (i+7))} onDragOver={this.allowDrop}/>);
        }

        return (
            <div style={{minHeight: '400px'}}>
                
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