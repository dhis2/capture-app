// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useMutation } from 'react-query';
import { useAlert, useConfig, useDataEngine } from '@dhis2/app-runtime';
import { useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { FEATURES, hasAPISupportForFeature } from '../../../../../../../../capture-core-utils';

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
    const { serverVersion: { minor } } = useConfig();
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const { data: events, isLoading } = useApiDataQuery(
        ['WorkingLists', 'BulkActionBar', 'CompleteAction', 'Events', selectedRows],
        {
            resource: 'tracker/events',
            params: () => {
                const supportForFeature = hasAPISupportForFeature(minor, FEATURES.newEntityFilterQueryParam);
                const filterQueryParam: string = supportForFeature ? 'events' : 'event';

                return ({
                    fields: '*,!dataValues,!relationships',
                    [filterQueryParam]: Object.keys(selectedRows).join(supportForFeature ? ',' : ';'),
                });
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
