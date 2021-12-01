// @flow
import React, { Component } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { CircularLoader } from '@dhis2/ui';

type Props = {
};

export class DialogLoadingMask extends Component<Props> {
    render() {
        return (
            <Dialog
                open
            >
                <DialogContent>
                    <CircularLoader />
                </DialogContent>
            </Dialog>
        );
    }
}
