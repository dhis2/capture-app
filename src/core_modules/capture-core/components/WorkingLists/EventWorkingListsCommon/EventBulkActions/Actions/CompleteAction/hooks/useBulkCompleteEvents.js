// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useMutation } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';

type Props = {|
    selectedRows: { [key: string]: boolean },
    isCompleteDialogOpen: boolean,
    setIsCompleteDialogOpen: (isCompleteDialogOpen: boolean) => void,
    onUpdateList: (disableClearSelection?: boolean) => void,
|}

export const useBulkCompleteEvents = ({
    selectedRows,
    isCompleteDialogOpen,
    setIsCompleteDialogOpen,
    onUpdateList,
}: Props) => {
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const { data: events, isLoading } = useApiDataQuery(
        ['WorkingLists', 'BulkActionBar', 'CompleteAction', 'Events', selectedRows],
        {
            resource: 'tracker/events',
            params: {
                fields: '*,!dataValues,!relationships',
                events: Object.keys(selectedRows).join(','),
            },
        },
        {
            enabled: Object.keys(selectedRows).length > 0 && isCompleteDialogOpen,
            select: (data: any) => {
                const apiEvents = handleAPIResponse(REQUESTED_ENTITIES.events, data);

                return apiEvents.reduce((acc, event) => {
                    if (event.status === 'ACTIVE') {
                        acc.activeEvents.push(event);
                    } else {
                        acc.completedEvents.push(event);
                    }

                    return acc;
                }, { activeEvents: [], completedEvents: [] });
            },
        },
    );

    const { mutate: completeEvents, isLoading: isCompletingEvents } = useMutation<any>(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=UPDATE',
            type: 'create',
            data: {
                // $FlowFixMe - business logic dictates that events are not undefined
                events: events.activeEvents.map(event => ({
                    ...event,
                    status: 'COMPLETED',
                })),
            },
        }),
        {
            onError: () => {
                showAlert({ message: i18n.t('An error occurred while completing events') });
            },
            onSuccess: () => {
                onUpdateList();
                setIsCompleteDialogOpen(false);
            },
        },
    );

    const eventCounts = useMemo(() => {
        if (!events) {
            return null;
        }

        return {
            active: events.activeEvents.length,
            completed: events.completedEvents.length,
        };
    }, [events]);

    return {
        eventCounts,
        completeEvents,
        isCompletingEvents,
        isLoading,
    };
};
