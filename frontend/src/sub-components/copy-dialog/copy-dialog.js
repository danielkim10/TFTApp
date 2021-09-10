import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import FileCopy from '@material-ui/icons/FileCopy';

import './copy-dialog.css';

const CopyDialog = (props) => {
    const [open, setOpen] = useState(props.open);
    const [team, setTeam] = useState("");

    useEffect(() => {
        let teamString = '';

        if (props.name !== '') {
            teamString += props.name + ': ';
        }

        for (let champion in props.team) {
            teamString += props.team[champion].champion.name;
            teamString += ' [';
            for (let item in props.team[champion].items) {
                teamString += props.items[props.team[champion].items[item]].name
                if (item !== props.team[champion].items.length - 1) {
                    teamString += ', ';
                }
            }
            teamString += '], ';
        }
        setTeam(teamString);
    }, [props]);

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <div className='dialog-size'>
                <DialogTitle>Copy this string to share with others</DialogTitle>
                <div className='dialog-content'>
                    <DialogContent>
                        <TextField className='textfield-size' defaultValue={team} InputProps={{readOnly: true}} variant="outlined"/>
                        <IconButton color="primary" className="copy-button" aria-label="copy to clipboard" component="span" onClick={() => {navigator.clipboard.writeText(team)}}>
                            <FileCopy/>
                        </IconButton>
                    </DialogContent>
                </div>
            </div>
        </Dialog>
    );
}

export default CopyDialog;