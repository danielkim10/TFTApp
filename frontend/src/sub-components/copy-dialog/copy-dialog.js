import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import FileCopy from '@material-ui/icons/FileCopy';

import './copy-dialog.css';

class CopyDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            team: "",
        };
    }

    componentDidMount = () => {
        let team = this.props.team;
        let teamString = '';

        if (this.props.name !== '') {
            teamString += this.props.name + ': ';
        }

        for (let champion in team) {
            teamString += team[champion].champion.name;
            teamString += ' [';
            for (let item in team[champion].items) {
                teamString += this.props.items[team[champion].items[item]].name
                if (item !== team[champion].items.length - 1) {
                    teamString += ', ';
                }
            }
            teamString += '], ';
        }
        this.setState({team: teamString});
    }

    handleClose = () => {
        this.setState({open: false});
        this.props.onClose();
    }

    copyToClipboard = () => {

    }

    render = () => {
        return (
            <Dialog onClose={this.handleClose} open={this.state.open}>
                <div className='dialog-size'>
                    <h3>Copy this string to share with others</h3>
                    <div className='dialog-content'>
                        <TextField className='textfield-size' defaultValue={this.state.team} InputProps={{readOnly: true}} variant="outlined"/>
                        <IconButton color="primary" className="copy-button" aria-label="copy to clipboard" component="span" onClick={() => {navigator.clipboard.writeText(this.state.team)}}>
                            <FileCopy/>
                        </IconButton>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default CopyDialog;