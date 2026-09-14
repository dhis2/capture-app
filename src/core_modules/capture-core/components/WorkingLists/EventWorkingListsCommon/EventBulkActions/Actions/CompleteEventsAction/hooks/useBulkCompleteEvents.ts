import { useCallback, useMemo } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { useBulkMutationWithValidation } from '../../../../../WorkingListsCommon/BulkActionBar/hooks';

type Event = { event: string; [key: string]: any };

const bucketEventsByStatus = (apiEvents: any[]): {
    activeEvents: Event[];
    completedEvents: Event[];
} => apiEvents.reduce(
    (acc, event) => {
        if (event.status === 'ACTIVE') acc.activeEvents.push(event);
        else acc.completedEvents.push(event);
        return acc;
    },
    { activeEvents: [] as Event[], completedEvents: [] as Event[] },
);

const buildCompleteEventsPayload = (activeEvents: Event[], fallbackProgramId?: string): Event[] =>
    activeEvents.map(event => ({
        ...event,
        status: 'COMPLETED',
        program: event.program || fallbackProgramId || event.programId,
    }));

type Props = {
    selectedRows: Record<string, boolean>;
    programId?: string;
    isModalOpen: boolean;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    setIsModalOpen: (open: boolean) => void;
};

export const useBulkCompleteEvents = ({
    selectedRows,
    programId,
    isModalOpen,
    onUpdateList,
    removeRowsFromSelection,
    setIsModalOpen,
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
            params: () => ({
                fields: '*,!completedAt,!completedBy,!dataValues,!relationships',
                pageSize: 100,
                program: programId,
                events: Object.keys(selectedRows).join(','),
            }),
        },
        {
            enabled: isModalOpen && Object.keys(selectedRows).length > 0 && !!programId,
            staleTime: 0,
            cacheTime: 0,
            select: (data: any) => bucketEventsByStatus(handleAPIResponse(REQUESTED_ENTITIES.events, data)),
        },
    );

    const mutationFn = useCallback(
        ({ payload }: { payload: Event[] }) => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=UPDATE&atomicMode=OBJECT',
            type: 'create',
            data: { events: payload },
        }) as Promise<any>,
        [dataEngine],
    );

    const {
        mutate: mutateCompleteEvents,
        isPending,
        validationError,
    } = useBulkMutationWithValidation<any, { payload: Event[] }>({
        mutationFn,
        active: isModalOpen,
        onSuccess: () => {
            onUpdateList();
            setIsModalOpen(false);
        },
        onPartialSuccess: (report, { payload }) => {
            const erroredUids = new Set(report.validationReport.errorReports.map(e => e.uid));
            const validEventIds = payload
                .map(event => event.event)
                .filter(id => !erroredUids.has(id));
            removeRowsFromSelection(validEventIds);
            onUpdateList(true);
        },
        onValidationError: (report) => {
            log.error(errorCreator('A validation error occurred while completing events')({ report }));
        },
        onFatalError: (serverResponse) => {
            log.error(errorCreator('An error occurred while completing events')({ serverResponse }));
            showAlert({ message: i18n.t('An error occurred while completing events') });
        },
    });

    const completeEvents = useCallback(() => {
        if (!events) return;
        mutateCompleteEvents({ payload: buildCompleteEventsPayload(events.activeEvents, programId) });
    }, [mutateCompleteEvents, events, programId]);

    const eventCounts = useMemo(() => {
        if (!events) return null;
        return {
            active: events.activeEvents.length,
            completed: events.completedEvents.length,
        };
    }, [events]);

    return {
        completeEvents,
        isPending,
        isLoading: isInitialLoading,
        validationError,
        eventCounts,
    };
};
