import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { MenuItem } from '@dhis2/ui';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { DirectionalArrow } from '../../../utils/rtl';

type Props = {
    eventId: string;
    eventStatus?: string;
    onMutate?: (newStatus: string) => void;
    onSuccess?: (newStatus: string) => void;
    onError?: () => void;
    onClose: () => void;
};

export const SkipMenuItem = ({
    eventId,
    eventStatus,
    onMutate,
    onSuccess,
    onError,
    onClose,
}: Props) => {
    const dataEngine = useDataEngine();
    const { show: showError } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const isSkipped = eventStatus === eventStatuses.SKIPPED;
    const newStatus = isSkipped ? eventStatuses.SCHEDULE : eventStatuses.SKIPPED;

    const { mutate: updateEventStatus } = useMutation(
        async () => {
            const { event: apiEvent } = await dataEngine.query({
                event: {
                    resource: 'tracker/events',
                    id: eventId,
                    params: {
                        fields: '*,!dataValues,!relationships',
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
                onSuccess?.(newStatus);
            },
        },
    );

    return (
        <MenuItem
            dense
            dataTest={isSkipped ? 'unskip-event-menu-item' : 'skip-event-menu-item'}
            icon={isSkipped ? <DirectionalArrow reverse /> : <DirectionalArrow />}
            label={isSkipped ? i18n.t('Unskip') : i18n.t('Skip')}
            suffix=""
            onClick={() => {
                onClose();
                updateEventStatus();
            }}
        />
    );
};
