// @flow
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LoadingMask from '../../../../LoadingMasks/LoadingMask.component';


type Props = {
    isUpdatingWithDialog?: ?boolean,
};

class EventListUpdatingDialog extends Component<Props> {
    render() {
        const {
            isUpdatingWithDialog,
        } = this.props;
        const isOpen = !!isUpdatingWithDialog;

        return (
            <Dialog
                open={isOpen}
            >
                <DialogContent>
                    <LoadingMask />
                </DialogContent>
            </Dialog>
        );
    }
}

export default (EventListUpdatingDialog);
