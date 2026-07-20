import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { MenuItem, IconCheckmark16 } from '@dhis2/ui';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { eventStatuses } from '../constants/status.const';
import type { Props } from './UncompleteEventMenuItem.types';

export const UncompleteEventMenuItem = ({ eventId, onUncompleted, onClose }: Props) => {
    const dataEngine = useDataEngine();
    const { show: showError } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const { mutate: uncompleteEvent, isLoading } = useMutation(
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
                        status: eventStatuses.ACTIVE,
                    }],
                },
            });
        },
        {
            onError: (error: unknown) => {
                showError({ message: i18n.t('An error occurred when uncompleting the event') });
                log.error(errorCreator('An error occurred when uncompleting the event')({ error, eventId }));
            },
            onSuccess: () => {
                onUncompleted();
            },
        },
    );

    return (
        <MenuItem
            dense
            dataTest="uncomplete-event-menu-item"
            icon={<IconCheckmark16 />}
            label={i18n.t('Mark incomplete')}
            suffix=""
            onClick={() => {
                onClose();
                !isLoading && uncompleteEvent();
            }}
        />
    );
};
