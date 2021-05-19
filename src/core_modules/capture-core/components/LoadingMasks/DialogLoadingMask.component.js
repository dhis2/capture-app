// @flow
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { LoadingMask } from './LoadingMask.component';


type Props = {
};

export class DialogLoadingMask extends Component<Props> {
    render() {
        return (
            <Dialog
                open
            >
                <DialogContent>
                    <LoadingMask />
                </DialogContent>
            </Dialog>
        );
    }
}
