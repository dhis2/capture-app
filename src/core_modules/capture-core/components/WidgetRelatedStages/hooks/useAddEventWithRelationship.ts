import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { relatedStageActions } from '../constants';
import { useTermLabel } from '../../../metaData';
import { tCustomTerm } from '../../../utils/tCustomTerm';

const ReactQueryAppNamespace = 'capture';

const addEventWithRelationshipMutation = {
    resource: '/tracker?async=false&importStrategy=CREATE_AND_UPDATE',
    type: 'create',
    data: ({ serverData }) => serverData,
} as const;

export const useAddEventWithRelationship = ({
    eventId,
    onUpdateOrAddEnrollmentEvents,
    onUpdateEnrollmentEventsSuccess,
    onUpdateEnrollmentEventsError,
    onNavigateToEvent,
    setIsLinking,
}: {
    eventId: string;
    onUpdateOrAddEnrollmentEvents: (events: Array<any>) => void;
    onUpdateEnrollmentEventsSuccess: (events: Array<any>) => void;
    onUpdateEnrollmentEventsError: (events: Array<any>) => void;
    onNavigateToEvent: (eventIdToNavigate: string) => void;
    setIsLinking: (isLinking: boolean) => void;
}) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showSuccess } = useAlert(({ message }) => message, { success: true });
    const { show: showAlert } = useAlert(({ message }) => message, { critical: true });
    const eventLabel = useTermLabel('event');

    const { mutate } = useMutation(
        ({ serverData }: { serverData: any }) =>
            dataEngine.mutate(addEventWithRelationshipMutation, {
                variables: {
                    serverData,
                },
            }),
        {
            onMutate: (payload: { serverData: Record<string, unknown> }) => {
                onUpdateOrAddEnrollmentEvents && onUpdateOrAddEnrollmentEvents((payload.serverData as any).events);
            },
            onSuccess: (_, payload: {
                linkMode: string;
                eventIdToRedirectTo?: string;
                serverData: Record<string, unknown>
            }) => {
                setIsLinking(false);
                const queryKey = [ReactQueryAppNamespace, 'linkedEventByOriginEvent', eventId];
                queryClient.refetchQueries(queryKey);
                onUpdateEnrollmentEventsSuccess && onUpdateEnrollmentEventsSuccess((payload.serverData as any).events);

                if (payload.linkMode === relatedStageActions.ENTER_DATA && payload.eventIdToRedirectTo) {
                    onNavigateToEvent(payload.eventIdToRedirectTo);
                } else {
                    showSuccess({ message: tCustomTerm('The {{eventLabel}} was successfully linked', { eventLabel }) });
                }
            },
            onError: (_, payload: { serverData: Record<string, unknown> }) => {
                setIsLinking(false);
                showAlert({ message: tCustomTerm('An error occurred while linking the {{eventLabel}}', { eventLabel }) });
                onUpdateEnrollmentEventsError && onUpdateEnrollmentEventsError((payload.serverData as any).events);
            },
        },
    );

    return {
        addEventWithRelationship: mutate,
    };
};
