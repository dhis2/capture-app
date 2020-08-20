// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Button from '../../../../Buttons/Button.component';

const getStyles = () => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

type Props = {
    onSaveTemplate: () => void,
    onClose: () => void,
    classes: Object,
};

const ExistingTemplateContents = (props: Props) => {
    const { onSaveTemplate, onClose, classes } = props;
    return (
        <React.Fragment>
            <DialogTitle>{i18n.t('Save')}</DialogTitle>
            <DialogContent />
            <DialogActions
                className={classes.buttonContainer}
            >
                <Button onClick={onClose}>
                    {i18n.t('Cancel')}
                </Button>
                <Button onClick={onSaveTemplate} primary>
                    {i18n.t('Save')}
                </Button>
            </DialogActions>
        </React.Fragment>
    );
};

export default withStyles(getStyles)(ExistingTemplateContents);
