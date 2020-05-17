import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { getSetData } from '../api-helper/api.js';

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      origins: [],
      classes: [],
    }
  }

  componentDidMount() {
    getSetData("teams", 1).then(data => {
      this.setState({teams: data.map(team => team)});
    })

    getSetData("origins", 1).then(data => {
      this.setState({origins: data.map(origin => origin)});
    })

    getSetData("classes", 1).then(data => {
      this.setState({classes: data.map(classe => classe)});
    })
  }

  compareSynergy(a, b) {
    const idA = a.synergy.tier;
    const idB = b.synergy.tier;

    let comparison = 0;
    if (idA < idB) {
      comparison = 1;
    }
    else if (idA > idB) {
      comparison = -1;
    }
    return comparison;
  }

  render() {
    let teams = [];

    for (let i = 0; i < this.state.teams.length; ++i) {
      let teamMembers = [];
      let synergies = [];
      Object.keys(this.state.teams[i].synergies).forEach((key, index) => {
        synergies.push(this.state.teams[i].synergies[key]);
      });
      synergies.sort(this.compareSynergy);

      Object.keys(this.state.teams[i].team["0"]).forEach((key, index) => {
        let itemDiv = [];
        if (this.state.teams[i].team["0"][key].items.length === 3) {
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[0].image} width={25} height={25} style={{marginLeft: '5px'}}/>)
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[1].image} width={25} height={25}/>)
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[2].image} width={25} height={25} style={{marginRight: '5px'}}/>)
        }
        else if (this.state.teams[i].team["0"][key].items.length === 2) {
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[0].image} width={25} height={25} style={{marginLeft: '17.5px'}}/>)
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[1].image} width={25} height={25} style={{marginRight: '17.5px'}}/>)
        }
        else if (this.state.teams[i].team["0"][key].items.length === 1) {
          itemDiv.push(<img src={this.state.teams[i].team["0"][key].items[0].image} width={25} height={25} style={{marginLeft: '30px', marginRight: '30px'}}/>)
        }

        teamMembers.push(<div style={{display: 'inline-block'}}><div><img src={this.state.teams[i].team["0"][key].champion.icon} width={55} height={55} style={{marginLeft: '15px', marginRight: '15px'}}/></div>{itemDiv}</div>);
      });

      for (let j = 0; j < synergies; ++j) {
        
      }

      teams.push(<div><Card><CardHeader>{this.state.teams[i].name} Created in patch {this.state.teams[i].patch}</CardHeader><CardBody>{teamMembers}</CardBody></Card></div>)
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
