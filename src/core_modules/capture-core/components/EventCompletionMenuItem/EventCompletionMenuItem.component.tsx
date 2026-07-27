import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { MenuItem, IconCheckmark16, IconUndo16 } from '@dhis2/ui';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { eventStatuses } from '../WidgetEventEdit/constants/status.const';

type Props = {
    eventId: string;
    eventStatus?: string;
    onUpdated: (newStatus: string) => void;
    onClose: () => void;
};

export const EventCompletionMenuItem = ({ eventId, eventStatus, onUpdated, onClose }: Props) => {
    const dataEngine = useDataEngine();
    const { show: showError } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const isCompleted = eventStatus === eventStatuses.COMPLETED;
    const newStatus = isCompleted ? eventStatuses.ACTIVE : eventStatuses.COMPLETED;

    const { mutate: updateCompletionStatus, isLoading } = useMutation(
        async () => {
            const { event: apiEvent } = await dataEngine.query({
                event: {
                    resource: 'tracker/events',
                    id: eventId,
                    params: {
                        fields: '*,!completedAt,!completedBy,!dataValues,!relationships',
                    },
                },
            }) as any;
            return dataEngine.mutate({
                resource: 'tracker?async=false&importStrategy=UPDATE&atomicMode=OBJECT',
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
            onError: (error: unknown) => {
                showError({ message: i18n.t('An error occurred when updating event status') });
                log.error(errorCreator('An error occurred when updating event status')({ error, eventId, newStatus }));
            },
            onSuccess: () => {
                onUpdated(newStatus);
            },
        },
    );

    return (
        <MenuItem
            dense
            dataTest={isCompleted ? 'uncomplete-event-menu-item' : 'complete-event-menu-item'}
            icon={isCompleted ? <IconUndo16 /> : <IconCheckmark16 />}
            label={isCompleted ? i18n.t('Mark incomplete') : i18n.t('Mark complete')}
            suffix=""
            onClick={() => {
                onClose();
                !isLoading && updateCompletionStatus();
            }}
        />
    );
};
