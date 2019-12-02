// @flow
import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../../Buttons/Button.component';

type Props = {
    open: boolean,
    onClose: () => void,
    onSaveConfig: () => void,
};

const SaveConfigDialog = (props: Props) => {
    const { open, onClose, onSaveConfig } = props;

    return (
        <Dialog
            open={!!open}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle>{i18n.t('Save')}</DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
                <Button onClick={onSaveConfig} color="primary">
                    {i18n.t('Save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SaveConfigDialog;
