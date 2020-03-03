// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import Button from '../../../../Buttons/Button.component';

const getStyles = () => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

type Props = {
    open: boolean,
    onClose: () => void,
    onDeleteTemplate: () => void,
    templateName: string,
    classes: Object,
};

const DeleteConfirmationDialog = (props: Props) => {
    const {
        open,
        onClose,
        onDeleteTemplate,
        templateName,
        classes,
    } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{i18n.t('Delete view')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {i18n.t('Do you really want to delete the \'{{templateName}}\' view?', { templateName })}
                </DialogContentText>
            </DialogContent>
            <DialogActions
                className={classes.buttonContainer}
            >
                <Button onClick={onClose}>
                    {i18n.t('Cancel')}
                </Button>
                <Button onClick={onDeleteTemplate} primary>
                    {i18n.t('Confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(getStyles)(DeleteConfirmationDialog);
