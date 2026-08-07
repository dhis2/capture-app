import { useCallback, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { FEATURES, featureAvailable } from 'capture-core-utils';
import { useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { useBulkMutationWithValidation } from '../../../../../WorkingListsCommon/BulkActionBar/hooks';

type Props = {
    selectedRows: Record<string, boolean>;
    isCompleteDialogOpen: boolean;
    setIsCompleteDialogOpen: (isCompleteDialogOpen: boolean) => void;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    programId?: string;
};

type Payload = Array<{ event: string; [key: string]: any }>;

export const useBulkCompleteEvents = ({
    selectedRows,
    isCompleteDialogOpen,
    setIsCompleteDialogOpen,
    removeRowsFromSelection,
    onUpdateList,
    programId,
}: Props) => {
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const { data: events, isInitialLoading } = useApiDataQuery(
        ['WorkingLists', 'BulkActionBar', 'CompleteAction', 'Events', selectedRows, programId],
        {
            resource: 'tracker/events',
            params: () => {
                const supportForFeature = featureAvailable(FEATURES.newEntityFilterQueryParam);
                const filterQueryParam: string = supportForFeature ? 'events' : 'event';

                return {
                    fields: '*,!completedAt,!completedBy,!dataValues,!relationships',
                    pageSize: 100,
                    program: programId,
                    [filterQueryParam]: Object.keys(selectedRows).join(supportForFeature ? ',' : ';'),
                };
            },
        },
        {
            enabled: Object.keys(selectedRows).length > 0 && isCompleteDialogOpen && !!programId,
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

    const mutationFn = useCallback(
        ({ payload }: { payload: Payload }) => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=UPDATE&atomicMode=OBJECT',
            type: 'create',
            data: { events: payload },
        }) as Promise<any>,
        [dataEngine],
    );

    const {
        mutate: completeEvents,
        isPending: isCompletingEvents,
        validationError,
    } = useBulkMutationWithValidation<any, { payload: Payload }>({
        mutationFn,
        active: isCompleteDialogOpen,
        onSuccess: () => {
            onUpdateList();
            setIsCompleteDialogOpen(false);
        },
        onPartialSuccess: (report, { payload }) => {
            const errorReports = report.validationReport.errorReports;
            const erroredUids = new Set(errorReports.map(e => e.uid).filter(Boolean));
            const validEventIds = payload
                .map(event => event.event)
                .filter(id => !erroredUids.has(id));
            removeRowsFromSelection(validEventIds);
            onUpdateList(true);
        },
        onFatalError: () => {
            showAlert({ message: i18n.t('An error occurred while completing events') });
        },
    });

    const onCompleteEvents = useCallback(() => {
        if (!events) return;

        const serverPayload: Payload = events.activeEvents.map((event: any) => ({
            ...event,
            status: 'COMPLETED',
            program: event.program || programId || event.programId,
        }));

        completeEvents({ payload: serverPayload });
    }, [completeEvents, events, programId]);

    const eventCounts = useMemo(() => {
        if (!events) return null;
        return {
            active: events.activeEvents.length,
            completed: events.completedEvents.length,
        };
    }, [events]);

    return {
        eventCounts,
        validationError,
        onCompleteEvents,
        isCompletingEvents,
        isLoading: isInitialLoading,
    };
};
