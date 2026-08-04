import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { MenuItem } from '@dhis2/ui';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { DirectionalArrow } from '../../../utils/rtl';
import { eventStatuses } from '../../WidgetEventEdit/constants/status.const';

type Props = {
    eventId: string;
    eventStatus?: string;
    pendingApiResponse?: boolean;
    onClose: () => void;
    onStatusMutate?: (eventId: string, newStatus: string) => void;
    onStatusError?: (eventId: string, previousStatus: string) => void;
    onStatusUpdated?: (eventId: string, newStatus: string) => void;
};

export const SkipMenuItem = ({
    eventId,
    eventStatus,
    pendingApiResponse,
    onClose,
    onStatusMutate,
    onStatusError,
    onStatusUpdated,
}: Props) => {
    const dataEngine = useDataEngine();
    const { show: showError } = useAlert(({ message }) => message, { critical: true });

    const { mutate: updateEventStatus } = useMutation(
        async ({ status }: { status: string }) => {
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
                    events: [{ ...apiEvent, status }],
                },
            });
        },
        {
            onMutate: (payload: { status: string }) => {
                const previousStatus = eventStatus;
                onStatusMutate?.(eventId, payload.status);
                return { previousStatus };
            },
            onError: (error: unknown, payload: { status: string }, context?: { previousStatus?: string }) => {
                showError({ message: i18n.t('An error occurred when updating event status') });
                log.error(errorCreator('An error occurred when updating event status')({ error, payload, context }));
                if (context?.previousStatus) {
                    onStatusError?.(eventId, context.previousStatus);
                }
            },
            onSuccess: (_data, payload) => {
                onStatusUpdated?.(eventId, payload.status);
            },
        },
    );

    const handleClick = (nextStatus: string) => {
        onClose();
        if (!pendingApiResponse) {
            updateEventStatus({ status: nextStatus });
        }
    };

    if (eventStatus === eventStatuses.SKIPPED) {
        return (
            <MenuItem
                dense
                icon={<DirectionalArrow reverse />}
                label={i18n.t('Unskip')}
                onClick={() => handleClick(eventStatuses.SCHEDULE)}
                suffix={null}
                dataTest="event-overflow-unskip"
            />
        );
    }

    return (
        <MenuItem
            dense
            icon={<DirectionalArrow />}
            label={i18n.t('Skip')}
            onClick={() => handleClick(eventStatuses.SKIPPED)}
            suffix={null}
            dataTest="event-overflow-skip"
        />
    );
};
