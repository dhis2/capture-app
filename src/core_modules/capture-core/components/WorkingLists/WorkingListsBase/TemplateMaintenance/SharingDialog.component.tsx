import React, { useMemo, useCallback } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { SharingDialog as UISharingDialog } from '@dhis2/ui';
import type { Props } from './sharingDialog.types';


export const SharingDialog = ({ onClose, open, templateId, templateSharingType, dataTest }: Props) => {
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
            onComplete: ({ sharing }: any) => {
                const {
                    externalAccess,
                    publicAccess,
                    userAccesses,
                    userGroupAccesses,
                } = sharing;

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
                type={templateSharingType as any}
                id={templateId}
                onClose={handleClose}
                // @ts-expect-error - UI library expects a dataTest prop, but it is not defined in the types
                dataTest={dataTest}
            /> : null
    );
};
