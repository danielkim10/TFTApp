// import React, { Component } from 'react';
// import {Button, Row, Col, Card, CardHeader,
//         CardBody, CardFooter } from 'reactstrap';
// import { renderFormGroup, renderFormGroupCheckbox } from '../../sub-components/formgroup.js';
// import { updateData } from '../../api-helper/api.js';

// class Class extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tempStrings: {
//         bonuses: "",
//       },
//       class: {
//         id: 0,
//         key: "",
//         name: "",
//         description: "",
//         bonuses: [],
//         mustBeExact: false,
//         set: "",
//         image: "",
//       },
//     }

//     this.handleClasses = this.handleClasses.bind(this);
//     this.handleClick = this.handleClick.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   componentDidMount() {
//     // getDataFromId('classes', this.props.match.params.id).then(data => {
//       // if (data.key) {
//         let classe = Object.assign({}, this.props.location.state.data);
//         let tempStrings = Object.assign({}, this.state.tempStrings);
//         // classe = data;

//         let bonus = "";

//         for (let i = 0; i < classe.bonuses.length; i++) {
//           bonus += classe.bonuses[i].needed + ',' + classe.bonuses[i].effect;
//           if (i < classe.bonuses.length - 1) {
//             bonus += '^';
//           }
//         }
//         // let checkpoint = "";
//         // for (let i = 0; i < classe.bonuses.length; i++) {
//         //   needed.push(classe.bonuses[i].needed);
//         //   checkpoint += needed[i].toString();
//         //   if (i < classe.bonuses.length -1) {
//         //     checkpoint += '^';
//         //   }
//         // }
//         // checkpoint += '/'
//         // for (let i = 0; i < classe.bonuses.length; i++) {
//         //   effect.push(classe.bonuses[i].effect);
//         //   checkpoint += effect[i];
//         //   if (i < classe.bonuses.length - 1) {
//         //     checkpoint += '^'
//         //   }
//         // }
//         tempStrings.bonuses = bonus;

//         this.setState({class: classe, tempStrings: tempStrings});
//       // }
//     // });
//   }

//   handleClasses(event) {
//     if (event.target.name === "bonuses") {
//       let tempStrings = Object.assign({}, this.state.tempStrings);
//       tempStrings.bonuses = event.target.value;
//       this.setState({tempStrings: tempStrings});
//     }
//     else {
//       let classe = Object.assign({}, this.state.class);
//       classe[event.target.name] = event.target.value;
//       this.setState({class: classe});
//     }
//   }

//   handleClick(event) {
//     let classe = Object.assign({}, this.state.class);
//     classe.mustBeExact = event.target.checked;
//     this.setState({class: classe})
//   }

//   handleSubmit(e) {
//     e.preventDefault();
//     let classe = Object.assign({}, this.state.class);
//     classe.bonuses = [];

//     let bonusString = this.state.tempStrings.bonuses.split('^');

//     for (let i in bonusString) {
//       let bonusString2 = bonusString[i].split(',');
//       classe.bonuses.push({needed: parseInt(bonusString2[0]), effect: bonusString2[1]});
//     }

//     this.setState({ class: classe }, function() {
//       const _class = {
//         id: this.state.class.id,
//         key: this.state.class.key,
//         name: this.state.class.name,
//         description: this.state.class.description,
//         bonuses: this.state.class.bonuses,
//         mustBeExact: this.state.class.mustBeExact,
//         set: this.state.class.set,
//         image: this.state.class.image,
//       }
//       updateData('classes', this.props.match.params.id, _class, '/edit');
//     });
//   }

//   render() {
//     return (
//       <div>
//       <Card style={{width: "100%"}}>
//       <CardHeader>
//         <i class="fa fa-align-justify"></i><strong>Classes</strong>
//       </CardHeader>
//       <CardBody>
//           <Row>
//             <Col>
//             {renderFormGroup("Id: ", "number", "id", "id", this.handleClasses, this.state.class.id)}
//             {renderFormGroup("Key: ", "text", "key", "key", this.handleClasses, this.state.class.key)}
//             {renderFormGroup("Name: ", "text", "name", "name", this.handleClasses, this.state.class.name)}
//             {renderFormGroup("Description: ", "text", "description", "description", this.handleClasses, this.state.class.description)}
//             {renderFormGroup("Bonuses: ", "text", "bonuses", "bonuses", this.handleClasses, this.state.tempStrings.bonuses)}
//             {renderFormGroup("Set: ", "number", "set", "set", this.handleClasses, this.state.class.set)}
//             {renderFormGroup("Image: ", "text", "image", "image", this.handleClasses, this.state.class.image)}
//             {renderFormGroupCheckbox("Must be exact: ", "checkbox", "exact", "exact", this.handleClick, this.state.class.mustBeExact)}
//             </Col>
//           </Row>
//       </CardBody>
//       <CardFooter>
//         <Button type="button" color="primary" onClick={this.handleSubmit}>Submit</Button>
//       </CardFooter>
//       </Card>
//       </div>
//     )
//   }
// }

// export default Class;
