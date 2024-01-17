// @flow
import React, { useMemo, useCallback, type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useDataQuery } from '@dhis2/app-runtime';
import { SharingDialog as UISharingDialog } from '@dhis2/ui';
import type { Props } from './sharingDialog.types';

const styles = {
    dialog: {
        width: 1000,
        display: 'flex',
    },
};

const SharingDialogPlain = ({ onClose, open, templateId, classes, templateSharingType, dataTest }: Props) => {
    const { refetch } = useDataQuery(
        useMemo(
            () => ({
                sharing: {
                    resource: 'sharing',
                    params: ({
                        variables: {
                            templateId: updatedTemplateId,
                            templateSharingType: updateTemplateSharingType,
                        },
                    }) => ({
                        id: updatedTemplateId,
                        type: updateTemplateSharingType,
                    }),
                },
            }),
            [],
        ),
        { lazy: true,
            onComplete: ({ sharing }) => {
                const {
                    externalAccess,
                    publicAccess,
                    userAccesses,
                    userGroupAccesses,
                } = sharing.object;

                onClose({
                    externalAccess,
                    publicAccess,
                    userAccesses: userAccesses.map(({ id, access }) => ({ id, access })),
                    userGroupAccesses: userGroupAccesses.map(({ id, access }) => ({ id, access })),
                });
            } },
    );

    const handleClose = useCallback(() => {
        refetch({ variables: { templateId, templateSharingType } });
    },
    [refetch, templateId, templateSharingType]);

    return (
        open ?
            <UISharingDialog
                type={templateSharingType}
                id={templateId}
                onClose={handleClose}
                className={classes.dialog}
                dataTest={dataTest}
            /> : null
    );
};

export const SharingDialog: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(SharingDialogPlain);
