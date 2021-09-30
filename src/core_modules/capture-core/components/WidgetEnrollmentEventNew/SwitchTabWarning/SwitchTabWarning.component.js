

// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@dhis2/ui';
import type { Props } from './switchTabWarning.types';

export const SwitchTabWarning = ({ open, onClose, onContinue }: Props) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle id="complete-dialog-title">
            {i18n.t('Are you sure ?')}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                {i18n.t('Current data will be lost if you switch tab before saving it')}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} secondary>
                {i18n.t('No, stay here')}
            </Button>
            <Button onClick={onContinue} primary>
                {i18n.t('Yes, discard')}
            </Button>
        </DialogActions>
    </Dialog>
);
