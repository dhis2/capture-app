// @flow
import React, { useCallback, type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import D2UISharingDialog from '@dhis2/d2-ui-sharing-dialog';
import { getD2 } from '../../../../d2';
import type { Props } from './sharingDialog.types';

const SHARING_DIALOG_TYPE = {
    teiList: 'trackedEntityInstanceFilter',
    eventList: 'eventFilter',
};

const styles = {
    dialog: {
        width: 1000,
        display: 'flex',
    },
};

const SharingDialogPlain = ({ onClose, open, templateId, classes, storeId }: Props) => {
    const handleClose = useCallback(({
        externalAccess,
        publicAccess,
        userAccesses,
        userGroupAccesses,
    }) =>
        onClose({
            externalAccess,
            publicAccess,
            userAccesses: userAccesses.map(({ id, access }) => ({ id, access })),
            userGroupAccesses: userGroupAccesses.map(({ id, access }) => ({ id, access })),
        }),
    [onClose]);

    return (
        <D2UISharingDialog
            open={open}
            id={templateId}
            onRequestClose={handleClose}
            type={SHARING_DIALOG_TYPE[storeId]}
            d2={getD2()}
            className={classes.dialog}
        />
    );
};

export const SharingDialog: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(SharingDialogPlain);
