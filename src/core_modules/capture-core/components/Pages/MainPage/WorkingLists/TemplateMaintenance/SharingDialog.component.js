// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import D2UISharingDialog from '@dhis2/d2-ui-sharing-dialog';
import { getD2 } from '../../../../../d2';

const getStyles = () => ({
    dialog: {
        width: 1000,
        display: 'flex',
    },
});

type Props = {
    onClose: () => void,
    open: boolean,
    templateId: string,
    classes: Object,
};

const SharingDialog = (props: Props) => {
    const { onClose, open, templateId, classes } = props;
    return (
        <D2UISharingDialog
            open={open}
            id={templateId}
            onRequestClose={onClose}
            type={'eventFilter'}
            d2={getD2()}
            className={classes.dialog}
        />
    );
};

export default withStyles(getStyles)(SharingDialog);
