import React from 'react';
import { assets_url } from '../../helper/urls';

import './hexagon-grid.css';
import '../../components/base.css';

const HexagonGrid = (props) => {
    const allowDrop = (e) => {
        e.preventDefault();
    }

    let itemsEquipped = [];
    for (let i = 0; i < 28; i++) {
        let styleElem = document.head.appendChild(document.createElement("style"));
        let styleElem2 = document.head.appendChild(document.createElement("style"));
    
        styleElem2.innerHTML = `#h${i} {background: black}`;
        styleElem.innerHTML = `#h${i}:before {
            background: white; 
        }`;
    }

    for (let t of props.team) {
        let styleElem = document.head.appendChild(document.createElement("style"));
        let styleElem2 = document.head.appendChild(document.createElement("style"));

        let color = 'gray';
        switch(props.champions[t.champion.championId].cost) {
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

        styleElem2.innerHTML = `#h${t.hexSlot} {background: ${color}}`;
        styleElem.innerHTML = `#h${t.hexSlot}:before {
            background: url(${props.champions[t.champion.championId].patch_data.icon}); 
            background-position: center; 
            background-repeat: no-repeat; 
            background-size: 85px 85px;
        }`;

        for (let j = 0; j < t.items.length; j++) {
            let image = props.items[t.items[j]].patch_data.icon.substring(0, props.items[t.items[j]].patch_data.icon.indexOf('dds')).toLowerCase();
            itemsEquipped.push(
                <div id={`h${t.hexSlot}-${j}`} key={t.hexSlot + 'i' + j} className='items-equipped'>
                    <img src={assets_url(image)} id={`i${t.hexSlot}-${j}`} className='item-size' alt={props.items[t.items[j]].name} onError={props.imageError}/>
                </div>
            );

            let leftMargin = -231;
            let topMargin = 168;

            if (t.hexSlot > 20) {
                leftMargin = -132 - 91*(27 - t.hexSlot);
                topMargin = 168;
            }
            else if (t.hexSlot > 13) {
                leftMargin = -178 - 91*(20 - t.hexSlot);
                topMargin = 99;
            }
            else if (t.hexSlot > 6) {
                leftMargin = -132 - 91*(13 - t.hexSlot);
                topMargin = 30;
            }
            else {
                leftMargin = -178 - 91*(6 - t.hexSlot);
                topMargin = -39;
            }

            if (t.items.length === 3) {
                leftMargin -= 20;   
            }
            else if (t.items.length === 2) {
                leftMargin -= 10;
            }

            let styleElem3 = document.head.appendChild(document.createElement("style"));
            styleElem3.innerHTML = `#h${t.hexSlot}-${j} {
                position: absolute; 
                display: inline-block; 
                margin-left: ${leftMargin}px; 
                margin-top: ${topMargin}px;
            }`;

            let styleElem4 = document.head.appendChild(document.createElement("style"));
            let margin = 20*j;
            styleElem4.innerHTML = `#i${t.hexSlot}-${j} {
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
                <div id={'h' + i} key={i} className="hexagon" draggable="true" onDragStart={(e) => props.drag(e, props.team[props.team.findIndex(tm => tm.hexSlot === i)])} onDrop={(e) => props.drop(e, i)} onDragOver={allowDrop}>
                </div>
                );
        }
        else {
            hexagonRow1.push(<div id={'h' + i} key={i} className="hexagon3" draggable="true" onDragStart={(e) => props.drag(e, props.team[props.team.findIndex(tm => tm.hexSlot === i)])} onDrop={(e) => props.drop(e, i)} onDragOver={allowDrop}/>);
        }
        hexagonRow1.push(<div id={'h' + (i+7)} key={i+7} className="hexagon2" draggable="true" onDragStart={(e) => props.drag(e, props.team[props.team.findIndex(tm => tm.hexSlot === i+7)])} onDrop={(e) => props.drop(e, (i+7))} onDragOver={allowDrop}/>);
    }

    for (let i = 14; i < 21; i++) {
        if (i === 14) {
            hexagonRow2.push(<div id={'h' + i} key={i} className="hexagon4" draggable="true" onDragStart={(e) => props.drag(e, props.team[props.team.findIndex(tm => tm.hexSlot === i)])} onDrop={(e) => props.drop(e, i)} onDragOver={allowDrop}/>);
        }
        else {
            hexagonRow2.push(<div id={'h' + i} key={i} className="hexagon5" draggable="true" onDragStart={(e) => props.drag(e, props.team[props.team.findIndex(tm => tm.hexSlot === i)])} onDrop={(e) => props.drop(e, i)} onDragOver={allowDrop}/>);
        }
        hexagonRow2.push(<div id={'h' + (i+7)} key={i+7} className="hexagon2" draggable="true" onDragStart={(e) => props.drag(e, props.team[props.team.findIndex(tm => tm.hexSlot === i+7)])} onDrop={(e) => props.drop(e, (i+7))} onDragOver={allowDrop}/>);
    }

    return (
        <div className='grid-dimensions'>
            <div className='hexagon-row'>
                {hexagonRow1}
            </div>
            <div className='hexagon-row'>
                {hexagonRow2}
            </div>
            {itemsEquipped}
        </div>
    );
}

export default HexagonGrid;