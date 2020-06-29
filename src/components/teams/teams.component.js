import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Tooltip } from 'reactstrap';
import { getSetData } from '../../api-helper/api.js';
import '../../css/main.css';
import './teams.component.css';

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      synergies: {},
    }
  }

  componentDidMount() {
    getSetData("teams", 1).then(data => {
      this.setState({teams: data.map(team => team)});
    })

    getSetData("origins", 1).then(data => {
      let origins = data.map(origin => origin);
      let synergies = Object.assign({}, this.state.synergies);
      for (let i = 0; i < origins.length; ++i) {
        synergies[origins[i].name] = origins[i];
      }
      this.setState({synergies: synergies});
    })

    getSetData("classes", 1).then(data => {
      let classes = data.map(classe => classe);
      let synergies = Object.assign({}, this.state.synergies);
      for (let i = 0; i < classes.length; ++i) {
        synergies[classes[i].name] = classes[i];
      }
      this.setState({synergies: synergies});
    })
  }

  compareSynergy(a, b) {
    const idA = a.tier;
    const idB = b.tier;

    let comparison = 0;
    if (idA < idB) {
      comparison = 1;
    }
    else if (idA > idB) {
      comparison = -1;
    }
    return comparison;
  }

  toggle(target) {
    if (!this.state[target]) {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [target]: {
          tooltipOpen: !this.state[target].tooltipOpen
        }
      });
    }
  }
  isToolTipOpen(target) {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }

  render() {
    let teams = [];

    for (let i = 0; i < this.state.teams.length; ++i) {
      let teamMembers = [];
      let synergiesSorted = [];
      let synergies = [];
      Object.keys(this.state.teams[i].synergies).forEach((key, index) => {
        synergiesSorted.push(this.state.teams[i].synergies[key]);
      });
      synergiesSorted.sort(this.compareSynergy);

      Object.keys(this.state.teams[i].team["0"]).forEach((key, index) => {
        let itemDiv = [];
        if (this.state.teams[i].team["0"][key].items.length === 3) {
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[0].image} className='item-image-3items-left'/>)
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[1].image} className='item-image'/>)
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[2].image} className='item-image-3items-right'/>)
        }
        else if (this.state.teams[i].team["0"][key].items.length === 2) {
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[0].image} className='item-image-2items-left'/>)
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[1].image} className='item-image-2items-right'/>)
        }
        else if (this.state.teams[i].team["0"][key].items.length === 1) {
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[0].image} className='item-image-1item'/>)
        }

        teamMembers.push(<div className='champion-row'><div><img src={this.state.teams[i].team["0"][key].champion.icon} className='champion-image'/></div>{itemDiv}</div>);
      });

      for (let j = 0; j < synergiesSorted.length; ++j) {
        let tierAdjust = synergiesSorted[j].tier === 0 ? 0 : synergiesSorted[j].tier - 1;
        synergies.push(
          <div style={{display: 'inline-block'}}>
            <img src={this.state.synergies[synergiesSorted[j].synergy].image} width={20} height={20} style={{filter: 'invert(100%)'}} id={synergiesSorted[j].synergy + '-' + i}/>
            <Tooltip placement="top" isOpen={this.isToolTipOpen(synergiesSorted[j].synergy + '-' + i)} target={synergiesSorted[j].synergy + '-' + i} toggle={() => this.toggle(synergiesSorted[j].synergy + '-' + i)}>
              <p style={{fontSize: '12px'}}>{this.state.synergies[synergiesSorted[j].synergy].name}</p>
              <p style={{fontSize: '11px'}}>{this.state.synergies[synergiesSorted[j].synergy].description}</p>
              <p className={synergiesSorted[j].tier < 1 ? 'tooltipLocked' : ''}>{this.state.synergies[synergiesSorted[j].synergy].bonuses[0].needed + ": " + this.state.synergies[synergiesSorted[j].synergy].bonuses[0].effect}</p>
              <p className={synergiesSorted[j].tier < 2 ? 'tooltipLocked' : ''}>{this.state.synergies[synergiesSorted[j].synergy].bonuses.length > 1 ? this.state.synergies[synergiesSorted[j].synergy].bonuses[1].needed + ": " + this.state.synergies[synergiesSorted[j].synergy].bonuses[1].effect : ""}</p>
              <p className={synergiesSorted[j].tier < 3 ? 'tooltipLocked' : ''}>{this.state.synergies[synergiesSorted[j].synergy].bonuses.length > 2 ? this.state.synergies[synergiesSorted[j].synergy].bonuses[2].needed + ": " + this.state.synergies[synergiesSorted[j].synergy].bonuses[2].effect : ""}</p>
              <p className={synergiesSorted[j].tier < 4 ? 'tooltipLocked' : ''}>{this.state.synergies[synergiesSorted[j].synergy].bonuses.length > 3 ? this.state.synergies[synergiesSorted[j].synergy].bonuses[3].needed + ": " + this.state.synergies[synergiesSorted[j].synergy].bonuses[3].effect : ""}</p>
            </Tooltip>
          </div>)
      }

      teams.push(<div><Row><Card style={{width: '50%'}}><CardHeader>{this.state.teams[i].name} Created in patch {this.state.teams[i].patch}</CardHeader><CardBody>{teamMembers}</CardBody></Card><Card style={{width: '50%'}}><CardBody>{synergies}</CardBody></Card></Row></div>)
    }
      return (
        <div>
          <div>
            <p>Teams</p>
            <p>Click on a team to open it in the builder</p>
          </div>
          <div>
            {teams}
          </div>
        </div>
      )
  }
}

export default Teams
