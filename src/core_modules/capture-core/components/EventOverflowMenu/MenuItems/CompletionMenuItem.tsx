import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { MenuItem, IconCheckmark16, IconUndo16 } from '@dhis2/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { removeEventChangelogQueries } from '../../WidgetsChangelog';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';

type Props = {
    eventId: string;
    eventStatus?: string;
    onMutate?: (newStatus: string) => void;
    onSuccess?: (newStatus: string) => void;
    onError?: () => void;
    onClose: () => void;
    canToggleCompletion: boolean;
    readOnlyMessage: string;
};

export const CompletionMenuItem = ({
    eventId,
    eventStatus,
    onMutate,
    onSuccess,
    onError,
    onClose,
    canToggleCompletion,
    readOnlyMessage,
}: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showError } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const isCompleted = eventStatus === eventStatuses.COMPLETED;
    const newStatus = isCompleted ? eventStatuses.ACTIVE : eventStatuses.COMPLETED;

    const { mutate: updateCompletionStatus } = useMutation(
        async () => {
            const { event: apiEvent } = await dataEngine.query({
                event: {
                    resource: 'tracker/events',
                    id: eventId,
                    params: {
                        fields: 'event,status,program,programStage,orgUnit,occurredAt,scheduledAt,' +
                            'enrollment,trackedEntity,attributeOptionCombo,notes,assignedUser,geometry,followUp',
                    },
                },
            }) as any;
            return dataEngine.mutate({
                resource: 'tracker?async=false&importStrategy=UPDATE',
                type: 'create',
                data: {
                    events: [{
                        ...apiEvent,
                        status: newStatus,
                    }],
                },
            });
        },
        {
            onMutate: () => {
                onMutate?.(newStatus);
            },
            onError: (error: unknown) => {
                showError({ message: i18n.t('An error occurred when updating event status') });
                log.error(errorCreator('An error occurred when updating event status')({ error, eventId, newStatus }));
                onError?.();
            },
            onSuccess: () => {
                removeEventChangelogQueries(queryClient, eventId);
                onSuccess?.(newStatus);
            },
        },
    );

    return (
        <ConditionalTooltip content={readOnlyMessage} enabled={!canToggleCompletion}>
            <MenuItem
                dense
                disabled={!canToggleCompletion}
                dataTest={isCompleted ? 'uncomplete-event-menu-item' : 'complete-event-menu-item'}
                icon={isCompleted ? <IconUndo16 /> : <IconCheckmark16 />}
                label={isCompleted ? i18n.t('Mark incomplete') : i18n.t('Mark complete')}
                suffix={null}
                onClick={() => {
                    onClose();
                    updateCompletionStatus();
                }}
            />
        </ConditionalTooltip>
    );
};
