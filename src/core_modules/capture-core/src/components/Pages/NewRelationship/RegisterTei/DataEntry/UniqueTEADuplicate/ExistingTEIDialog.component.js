// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import i18n from '@dhis2/d2-i18n';
import ExistingTEILoader from './ExistingTEILoader.container';

type Props = {
    open: boolean,
    onCancel: () => void,
    onLink: () => void,
};

const ExistingTEIDialog = (props: Props) => {
    const { open, onCancel, onLink, ...passOnProps } = props;
    return (
        <Dialog
            fullWidth
            maxWidth={'md'}
            open={open}
            onClose={onCancel}
        >
            <ExistingTEILoader
                {...passOnProps}
            />
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    {i18n.t('Cancel')}
                </Button>
                <Button onClick={onLink} color="primary" autoFocus>
                    {i18n.t('Link')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExistingTEIDialog;
