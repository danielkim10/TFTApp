import React, { Component } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import SynergiesTooltip from '../../../sub-components/synergies-tooltips.js';

class SynergiesPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  isToolTipOpen = (target) => {
    return this.state[target] ? this.state[target].tooltipOpen : false;
  }
  toggle = (target) => {
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

  compareSynergy = (a, b) => {
    const idA = a.synergy1.tier;
    const idB = b.synergy1.tier;

    let comparison = 0;
    if (idA < idB) {
      comparison = 1;
    }
    else if (idA > idB) {
      comparison = -1;
    }
    return comparison;
  }

  createSynergies = () => {
    const colors = {
      'BLACK_COLOR': '#404040', 
      'gold': '#ffd700', 
      'silver': '#acacac',
      'bronze': '#cd7f32',
      'chromatic': '#425af5'
    };
    let color = colors['BLACK_COLOR'];
    let iconColor = '';
    let synergiesUnsorted = [];
    let synergiesSorted = [];

    Object.keys(this.props.traits).forEach((key, index) => {
      color = colors['BLACK_COLOR'];
      let sets = this.props.traits[key].sets.length;

      if (this.props.traits[key].count !== 0) {
        for (let j = sets-1; j >= 0; j--) {
          if (this.props.traits[key].count >= this.props.traits[key].sets[j].min) {
            color = colors[this.props.traits[key].sets[j].style];
            iconColor = 'black-icon';
            this.props.traits[key].tier = j+1;
            break;
          }
          else {
            color = colors['BLACK_COLOR'];
            iconColor = '';
            this.props.traits[key].tier = 0;
          }
        }
        synergiesUnsorted.push({synergy: this.props.traits[key], color: color, iconcolor: iconColor});
      }
    })

    // synergiesUnsorted.sort(this.compareSynergy);
    for (let i = 0; i < synergiesUnsorted.length; i++) {
      let max = 0;
      if (synergiesUnsorted[i].synergy.tier === synergiesUnsorted[i].synergy.sets.length) {
        max = synergiesUnsorted[i].synergy.sets[synergiesUnsorted[i].synergy.tier-1].min;
      }
      else {
        max = synergiesUnsorted[i].synergy.sets[synergiesUnsorted[i].synergy.tier].min;
      }

      let image = synergiesUnsorted[i].synergy.patch_data.icon.substring(0, synergiesUnsorted[i].synergy.patch_data.icon.indexOf('dds')).toLowerCase();

      synergiesSorted.push(<div key={synergiesUnsorted[i].synergy.key}>
        <Card id={synergiesUnsorted[i].synergy.key}
        inverse={synergiesUnsorted[i].color === colors['BLACK_COLOR']}
        style={{ backgroundColor: synergiesUnsorted[i].color, borderColor: synergiesUnsorted[i].color }}>
        <CardBody><img src={"https://raw.communitydragon.org/latest/game/"+image+'png'} alt={synergiesUnsorted[i].synergy.name} width='24px' height='24px' className={synergiesUnsorted[i].iconcolor}/>{synergiesUnsorted[i].synergy.name + ": " + synergiesUnsorted[i].synergy.count + " / " + max}</CardBody>
        </Card>
        <SynergiesTooltip placement="right" isOpen={this.isToolTipOpen(synergiesUnsorted[i].synergy.key)} target={synergiesUnsorted[i].synergy.key} toggle={() => this.toggle(synergiesUnsorted[i].synergy.key)}
                          name={synergiesUnsorted[i].synergy.name} description={synergiesUnsorted[i].synergy.description ? synergiesUnsorted[i].synergy.description : ""} tier={synergiesUnsorted[i].synergy.tier}/>
        </div>);
    }
    return synergiesSorted;
  }

  render = () => {
    return(
      <Col>{this.createSynergies()}</Col>
    );
  }
}

export default SynergiesPanel;
