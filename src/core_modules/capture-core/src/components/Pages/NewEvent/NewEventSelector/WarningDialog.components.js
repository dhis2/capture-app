// @flow
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
    onAcceptClick: () => void,
    onClose: () => void,
    open: boolean,
    titleText: string,
    contentText: string,
};

class WarningDialog extends Component<Props> {
    handleClose: () => void;
    handleAcceptClick: () => void;

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleAcceptClick = this.handleAcceptClick.bind(this);
    }

    handleClose() {
        this.props.onClose();
    }

    handleAcceptClick() {
        this.props.onAcceptClick();
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose}
            >
                <DialogTitle>{this.props.titleText}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.contentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleAcceptClick} color="primary" autoFocus>
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default (WarningDialog);
