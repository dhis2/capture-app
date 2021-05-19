// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '../Buttons';

type Props = {
    open: boolean,
    header: string,
    text: string,
    confirmText: string,
    cancelText: string,
    onCancel: () => void,
    onConfirm: () => void,
};

const StyledDialog = withStyles({ root: { zIndex: 3000 } })(Dialog);
const StyledDialogActions = withStyles({ root: { margin: '8px 8px 12px 0' } })(DialogActions);

export class ConfirmDialog extends Component<Props> {
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
            <StyledDialog
                open={open}
                onClose={onCancel}
            >
                <DialogTitle>{header}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                </DialogContent>
                <StyledDialogActions>
                    <Button onClick={onCancel} secondary>
                        {cancelText}
                    </Button>
                    <Button onClick={onConfirm} primary>
                        {confirmText}
                    </Button>
                </StyledDialogActions>
            </StyledDialog>
        );
    }
}
