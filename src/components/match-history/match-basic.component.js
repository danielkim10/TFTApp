import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap';

class MatchBasic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gamedata: this.props.gamedata,
      champions: this.props.champions,
      origins: this.props.origins,
      classes: this.props.classes,
      items: this.props.items,
    }

    this.championIdParse = this.championIdParse.bind(this);
  }

  componentDidMount = () => {
  }

  championIdParse = (id) => {
    return id.replace(/'/, "").substring(id.indexOf('_') + 1).toLowerCase();
  }

  createTeam = (units) => {
    let teamMembers = [];
    for (let i in units) {
      let itemDiv = [];
       if (units[i].items.length === 3) {
         itemDiv.push(<img src={this.state.items[units[i].items[0]].image[3]} className='item-image-3items-left'/>)
         itemDiv.push(<img src={this.state.items[units[i].items[1]].image[3]} className='item-image'/>)
         itemDiv.push(<img src={this.state.items[units[i].items[2]].image[3]} className='item-image-3items-right'/>)
        }
       else if (units[i].items.length === 2) {
         itemDiv.push(<img src={this.state.items[units[i].items[0]].image[3]} className='item-image-2items-left'/>)
         itemDiv.push(<img src={this.state.items[units[i].items[1]].image[3]} className='item-image-2items-right'/>)
       }
       else if (units[i].items.length === 1) {
         itemDiv.push(<img src={this.state.items[units[i].items[0]].image[3]} className='item-image-1item'/>)
       }
       teamMembers.push(<div className='champion-row'><div><img src={this.state.champions[this.championIdParse(units[i].character_id)].icon} className='champion-image'/></div>{itemDiv}</div>);
    }
    return teamMembers;
  }

  render = () => {
    return(
      <Card>
        <CardHeader>
          <p>{new Date(this.state.gamedata.info.game_datetime).toString()}</p>
          <p>{this.state.gamedata.info.game_variation}</p>
        </CardHeader>
        <CardBody>
          <p>{this.state.gamedata.info.participants[0].level}</p>
          <p>{this.state.gamedata.info.participants[0].placement}</p>
          {this.createTeam(this.state.gamedata.info.participants[0].units)}
        </CardBody>
      </Card>

    );
  }
}

export default MatchBasic;
