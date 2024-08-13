// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import {
    MenuItem,
    IconArrowRight16, IconRedo16,
} from '@dhis2/ui';
import { useMutation } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { EventStatuses } from '../EventRow';
import { errorCreator } from '../../../../../../../../capture-core-utils';

type Props = {|
    eventId: string,
    eventDetails: ApiEnrollmentEvent,
    pendingApiResponse: boolean,
    onUpdateEventStatus: (eventId: string, status: string) => void,
    setActionsOpen: (open: boolean) => void,
|}

export const SkipAction = ({
    eventId,
    eventDetails,
    pendingApiResponse,
    setActionsOpen,
    onUpdateEventStatus,
}: Props) => {
    const dataEngine = useDataEngine();
    const { show: showError } = useAlert(
        ({ message }) => message,
        { critical: true },
    );
    const { mutate: updateEventStatus } = useMutation(
        ({ status }) => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=UPDATE',
            type: 'create',
            data: {
                events: [
                    {
                        ...eventDetails,
                        event: eventId,
                        status,
                    },
                ],
            },
        }),
        {
            onMutate: (payload) => {
                const status = EventStatuses[payload.status];
                const previousStatus = eventDetails.status;

                status && onUpdateEventStatus(eventId, status);

                return { previousStatus };
            },
            onError: (error, payload, context) => {
                showError({ message: i18n.t('An error occurred when updating event status') });
                log.error(errorCreator('An error occurred when updating event status')({ error, payload, context }));
                context && onUpdateEventStatus(eventId, context.previousStatus);
            },
        },
    );

    const handleMenuItemClick = (status) => {
        setActionsOpen(false);
        !pendingApiResponse && updateEventStatus({ status });
    };

    if (eventDetails.status === EventStatuses.SKIPPED) {
        return (
            <MenuItem
                dense
                icon={<IconRedo16 />}
                label={i18n.t('Unskip')}
                onClick={() => handleMenuItemClick(EventStatuses.SCHEDULE)}
            />
        );
    }

    return (
        <MenuItem
            dense
            icon={<IconArrowRight16 />}
            label={i18n.t('Skip')}
            onClick={() => handleMenuItemClick(EventStatuses.SKIPPED)}
        />
    );
};
