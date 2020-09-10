import React, { Component } from 'react';
import { Alert, Button, Card, CardHeader, CardBody, Col, Collapse, Row, Input, Tooltip } from 'reactstrap';
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
    const BLACK_COLOR = '#404040';
    const GOLD_COLOR = '#ffd700';
    const SILVER_COLOR = '#acacac';
    const BRONZE_COLOR = '#cd7f32';
    const DIAMOND_COLOR = '#425af5'; // used for things like 8 sorcs
    let color = BLACK_COLOR;
    let iconColor = '';
    let synergiesUnsorted = [];
    let synergiesSorted = [];

    let synergies = {};
    for (let i = 0; i < this.props.classes.length; ++i) {
      synergies[this.props.classes[i].key] = this.props.classes[i];
    }

    for (let i = 0; i < this.props.origins.length; ++i) {
      synergies[this.props.origins[i].key] = this.props.origins[i];
    }

    Object.keys(this.props.synergies).forEach((key, index) => {
      color = BLACK_COLOR;
      let synergyTiers = synergies[key.toLowerCase()].bonuses.length;

      for (let j = synergyTiers-1; j >= 0; --j) {
        if (this.props.synergies[key].count >= synergies[key.toLowerCase()].bonuses[j].needed) {
          if (j === synergyTiers - 1) {
            color = GOLD_COLOR;
            iconColor = 'black-icon';
            this.props.synergies[key].tier = 3;
            break;
          }
          else if (j === synergyTiers - 2 && synergyTiers === 3) {
            color =  SILVER_COLOR;
            iconColor = 'black-icon';
            this.props.synergies[key].tier = 2;
            break;
          }
          else {
            if ((synergies[key.toLowerCase()].mustBeExact && this.props.synergies[key].count === synergies[key.toLowerCase()].bonuses[j].needed) || !synergies[key.toLowerCase()].mustBeExact) {
              color = BRONZE_COLOR;
              iconColor = 'black-icon';
              this.props.synergies[key].tier = 1;
              break;
            }
          }
        }
        else {
          color = BLACK_COLOR;
          iconColor = '';
          this.props.synergies[key].tier = 0;
        }
      }
      synergiesUnsorted.push({synergy1: this.props.synergies[key], synergy2: synergies[key.toLowerCase()], color: color, iconcolor: iconColor});
    })

    synergiesUnsorted.sort(this.compareSynergy);
    for (let i = 0; i < synergiesUnsorted.length; i++) {
      synergiesSorted.push(<div>
        <Card id={synergiesUnsorted[i].synergy2.key}
        inverse={synergiesUnsorted[i].color === '#404040'}
        style={{ backgroundColor: synergiesUnsorted[i].color, borderColor: synergiesUnsorted[i].color }}>
        <CardBody><img src={synergiesUnsorted[i].synergy2.image} className={synergiesUnsorted[i].iconcolor}/>{synergiesUnsorted[i].synergy2.name + ": " + synergiesUnsorted[i].synergy1.count} / {synergiesUnsorted[i].synergy1.tier >= synergiesUnsorted[i].synergy2.bonuses.length ? synergiesUnsorted[i].synergy2.bonuses[synergiesUnsorted[i].synergy2.bonuses.length - 1].needed : synergiesUnsorted[i].synergy2.bonuses[synergiesUnsorted[i].synergy1.tier].needed}</CardBody>
        </Card>
        <SynergiesTooltip placement="right" isOpen={this.isToolTipOpen(synergiesUnsorted[i].synergy2.key)} target={synergiesUnsorted[i].synergy2.key} toggle={() => this.toggle(synergiesUnsorted[i].synergy2.key)}
                          name={synergiesUnsorted[i].synergy2.name} description={synergiesUnsorted[i].synergy2.description ? synergiesUnsorted[i].synergy2.description : ""} tier={synergiesUnsorted[i].synergy1.tier} bonuses={synergiesUnsorted[i].synergy2.bonuses}/>
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
