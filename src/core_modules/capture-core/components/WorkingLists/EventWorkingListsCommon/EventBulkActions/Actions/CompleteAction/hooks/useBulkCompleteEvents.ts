import { useCallback, useEffect, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useMutation } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { FEATURES, featureAvailable } from '../../../../../../../../capture-core-utils';

type Props = {
    selectedRows: { [key: string]: boolean };
    isCompleteDialogOpen: boolean;
    setIsCompleteDialogOpen: (isCompleteDialogOpen: boolean) => void;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
};

export const useBulkCompleteEvents = ({
    selectedRows,
    isCompleteDialogOpen,
    setIsCompleteDialogOpen,
    removeRowsFromSelection,
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
            params: () => {
                const supportForFeature = featureAvailable(FEATURES.newEntityFilterQueryParam);
                const filterQueryParam: string = supportForFeature ? 'events' : 'event';

                return ({
                    fields: '*,!completedAt,!completedBy,!dataValues,!relationships',
                    pageSize: 100,
                    [filterQueryParam]: Object.keys(selectedRows).join(supportForFeature ? ',' : ';'),
                });
            },
        },
        {
            enabled: Object.keys(selectedRows).length > 0 && isCompleteDialogOpen,
            staleTime: 0,
            cacheTime: 0,
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

    const {
        mutate: completeEvents,
        isLoading: isCompletingEvents,
        data: validationError,
        error,
        reset: resetCompleteEvents,
    } = useMutation<any, unknown, { payload: any }>(
        ({ payload }: { payload: any }) => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=UPDATE&atomicMode=OBJECT',
            type: 'create',
            data: {
                events: payload,
            },
        }),
        {
            onError: () => {
                showAlert({ message: i18n.t('An error occurred while completing events') });
            },
            onSuccess: (response, { payload }: any) => {
                const errorReports = response?.validationReport?.errorReports;
                if (errorReports && errorReports.length) {
                    const eventIds = payload.map(event => event.event);
                    const validEventIds = eventIds
                        .filter(eventId => !errorReports
                            .find(errorReport => errorReport.uid === eventId),
                        );

                    removeRowsFromSelection(validEventIds);
                    onUpdateList(true);
                } else {
                    onUpdateList();
                    setIsCompleteDialogOpen(false);
                }
            },
        },
    );

    const onCompleteEvents = useCallback(() => {
        if (!events) {
            return;
        }

        const serverPayload = events.activeEvents.map(event => ({
            ...event,
            status: 'COMPLETED',
        }));

        completeEvents({ payload: serverPayload });
    }, [completeEvents, events]);

    const eventCounts = useMemo(() => {
        if (!events) {
            return null;
        }

        return {
            active: events.activeEvents.length,
            completed: events.completedEvents.length,
        };
    }, [events]);

    useEffect(() => {
        if (!isCompleteDialogOpen) {
            resetCompleteEvents();
        }
    }, [isCompleteDialogOpen, resetCompleteEvents]);

    return {
        eventCounts,
        error,
        validationError,
        onCompleteEvents,
        isCompletingEvents,
        isLoading,
    };
};
