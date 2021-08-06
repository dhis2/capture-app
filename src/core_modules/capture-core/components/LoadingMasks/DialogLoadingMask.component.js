// @flow
import React, { Component } from 'react';
import { CircularLoader } from '@dhis2/ui';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

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
