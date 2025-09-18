import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';
import { relatedStageActions } from '../constants';

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

    const { mutate } = useMutation(
        ({ serverData }: { serverData: any }) =>
            dataEngine.mutate(addEventWithRelationshipMutation, {
                variables: {
                    serverData,
                },
            }),
        {
            onMutate: (payload: { serverData: Record<string, unknown> }) => {
                onUpdateOrAddEnrollmentEvents && 
                    onUpdateOrAddEnrollmentEvents((payload.serverData as any).events);
            },
            onSuccess: (_, payload: { linkMode: string; eventIdToRedirectTo?: string; serverData: Record<string, unknown> }) => {
                setIsLinking(false);
                const queryKey = [ReactQueryAppNamespace, 'linkedEventByOriginEvent', eventId];
                queryClient.refetchQueries(queryKey);
                onUpdateEnrollmentEventsSuccess && 
                    onUpdateEnrollmentEventsSuccess((payload.serverData as any).events);

                if (payload.linkMode === relatedStageActions.ENTER_DATA && payload.eventIdToRedirectTo) {
                    onNavigateToEvent(payload.eventIdToRedirectTo);
                } else {
                    showSuccess({ message: i18n.t('The event was successfully linked') });
                }
            },
            onError: (_, payload: { serverData: Record<string, unknown> }) => {
                setIsLinking(false);
                showAlert({ message: i18n.t('An error occurred while linking the event') });
                onUpdateEnrollmentEventsError && 
                    onUpdateEnrollmentEventsError((payload.serverData as any).events);
            },
        },
    );

    return {
        addEventWithRelationship: mutate,
    };
};
