import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import {
    MenuItem,
    IconRedo16,
} from '@dhis2/ui';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { DirectionalArrow } from '../../../utils/rtl';

type Props = {
    eventId: string;
    eventDetails: ApiEnrollmentEvent;
    onMutate?: (newStatus: string) => void;
    onSuccess?: (newStatus: string) => void;
    onError?: () => void;
    onClose: () => void;
};

export const SkipMenuItem = ({
    eventId,
    eventDetails,
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

    const { mutate: updateEventStatus } = useMutation(
        ({ status }: { status: string }) => dataEngine.mutate({
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
            onMutate: (payload: { status: string }) => {
                onMutate?.(payload.status);
            },
            onError: (error: unknown, payload: { status: string }) => {
                showError({ message: i18n.t('An error occurred when updating event status') });
                log.error(errorCreator('An error occurred when updating event status')({ error, payload }));
                onError?.();
            },
            onSuccess: (_data: unknown, payload: { status: string }) => {
                onSuccess?.(payload.status);
            },
        },
    );

    const handleMenuItemClick = (status: string) => {
        onClose();
        updateEventStatus({ status });
    };

    if (eventDetails.status === eventStatuses.SKIPPED) {
        return (
            <MenuItem
                dense
                icon={<IconRedo16 />}
                label={i18n.t('Unskip')}
                onClick={() => handleMenuItemClick(eventStatuses.SCHEDULE)}
                suffix=""
            />
        );
    }

    return (
        <MenuItem
            dense
            icon={<DirectionalArrow />}
            label={i18n.t('Skip')}
            onClick={() => handleMenuItemClick(eventStatuses.SKIPPED)}
            suffix=""
        />
    );
};
