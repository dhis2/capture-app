// @flow
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


type Props = {
    open: boolean,
    header: string,
    text: string,
    confirmText: string,
    cancelText: string,
    onCancel: () => void,
    onConfirm: () => void,
};

class ConfirmDialog extends Component<Props> {
    render() {
        const {
            open,
            header,
            text,
            confirmText,
            onConfirm,
            cancelText,
            onCancel,
        } = this.props;

        return (
            <Dialog
                open={open}
                onClose={onCancel}
            >
                <DialogTitle>{header}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        {cancelText}
                    </Button>
                    <Button onClick={onConfirm} color="primary">
                        {confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default (ConfirmDialog);
