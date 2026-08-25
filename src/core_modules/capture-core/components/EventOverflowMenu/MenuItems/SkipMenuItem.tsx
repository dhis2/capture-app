import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { MenuItem } from '@dhis2/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { removeEventChangelogQueries } from '../../WidgetsChangelog';
import { DirectionalArrow } from '../../../utils/rtl';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';

type Props = {
    eventId: string;
    eventStatus?: string;
    onMutate?: (newStatus: string) => void;
    onSuccess?: (newStatus: string) => void;
    onError?: () => void;
    onClose: () => void;
    canMutateEvent: boolean;
    readOnlyMessage: string;
};

export const SkipMenuItem = ({
    eventId,
    eventStatus,
    onMutate,
    onSuccess,
    onError,
    onClose,
    canMutateEvent,
    readOnlyMessage,
}: Props) => {
    const disabled = !canMutateEvent;
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
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
                removeEventChangelogQueries(queryClient, eventId);
                onSuccess?.(newStatus);
            },
        },
    );

    return (
        <ConditionalTooltip content={readOnlyMessage} enabled={disabled}>
            <MenuItem
                dense
                disabled={disabled}
                dataTest={isSkipped ? 'unskip-event-menu-item' : 'skip-event-menu-item'}
                icon={isSkipped ? <DirectionalArrow reverse /> : <DirectionalArrow />}
                label={isSkipped ? i18n.t('Unskip') : i18n.t('Skip')}
                suffix={null}
                onClick={() => {
                    onClose();
                    updateEventStatus();
                }}
            />
        </ConditionalTooltip>
    );
};
