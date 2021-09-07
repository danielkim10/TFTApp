import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import './help-dialog.css';

class HelpDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
        };
    }

    componentDidMount = () => {
    }

    handleClose = () => {
        this.setState({open: false});
        this.props.onClose();
    }

    render = () => {
        return (
            <Dialog onClose={this.handleClose} open={this.state.open}>
                <div className='dialog-size-help'>
                    <DialogTitle>How To Use Builder</DialogTitle>
                    <div className='dialog-content-help'>
                        <DialogContent>
                            <DialogContentText>
                                <ul>
                                    <li>Add champions to your team. Clicking on their portrait in the panel adds them to the first available hexagon slot. Champions can also be dragged into a desired slot.</li>
                                    <li>Champions on the grid can be dragged to new locations or swapped with other champions.</li>
                                    <li>To add an item onto a champion, drag it onto the corresponding hexagon slot.</li>
                                    <li>To remove a champion, drag it from the grid back to the champion panel.</li>
                                    <li>Teams can also be saved into the database (requires 1+ champions). The team composition, champion positions and equipped items will be saved.</li>
                                </ul>
                            </DialogContentText>
                            <DialogActions>
                                <Button onClick={this.handleClose}>Sounds Good</Button>
                            </DialogActions>
                        </DialogContent>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default HelpDialog;