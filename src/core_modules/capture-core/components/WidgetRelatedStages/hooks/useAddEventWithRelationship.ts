import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';
import { relatedStageActions } from '../constants';

const ReactQueryAppNamespace = 'capture';

type ApiEnrollmentEvent = {
    event: string;
    [key: string]: any;
};

const addEventWithRelationshipMutation = {
    resource: '/tracker?async=false&importStrategy=CREATE_AND_UPDATE',
    type: 'create',
    data: ({ serverData }: { serverData: any }) => serverData,
    id: 'addEventWithRelationship',
};

type Props = {
    eventId: string;
    onUpdateOrAddEnrollmentEvents: (events: Array<ApiEnrollmentEvent>) => void;
    onUpdateEnrollmentEventsSuccess: (events: Array<ApiEnrollmentEvent>) => void;
    onUpdateEnrollmentEventsError: (events: Array<ApiEnrollmentEvent>) => void;
    onNavigateToEvent: (eventId: string) => void;
    setIsLinking: (isLinking: boolean) => void;
};

type MutationPayload = {
    serverData: Record<string, any>;
    linkMode: string;
    eventIdToRedirectTo?: string;
};

export const useAddEventWithRelationship = ({
    eventId,
    onUpdateOrAddEnrollmentEvents,
    onUpdateEnrollmentEventsSuccess,
    onUpdateEnrollmentEventsError,
    onNavigateToEvent,
    setIsLinking,
}: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showSuccess } = useAlert(({ message }) => message, { success: true });
    const { show: showAlert } = useAlert(({ message }) => message, { critical: true });

    const { mutate } = useMutation<any, Error, MutationPayload>(
        ({ serverData }) =>
            dataEngine.mutate(addEventWithRelationshipMutation as any, {
                variables: {
                    serverData,
                },
            }),
        {
            onMutate: (payload: { serverData: Record<string, any> }) => {
                onUpdateOrAddEnrollmentEvents && onUpdateOrAddEnrollmentEvents(payload.serverData.events);
            },
            onSuccess: (_, payload: MutationPayload) => {
                setIsLinking(false);
                const queryKey = [ReactQueryAppNamespace, 'linkedEventByOriginEvent', eventId];
                queryClient.refetchQueries(queryKey);
                onUpdateEnrollmentEventsSuccess && onUpdateEnrollmentEventsSuccess(payload.serverData.events);

                if (payload.linkMode === relatedStageActions.ENTER_DATA && payload.eventIdToRedirectTo) {
                    onNavigateToEvent(payload.eventIdToRedirectTo);
                } else {
                    showSuccess({ message: i18n.t('The event was successfully linked') });
                }
            },
            onError: (_, payload: MutationPayload) => {
                setIsLinking(false);
                showAlert({ message: i18n.t('An error occurred while linking the event') });
                onUpdateEnrollmentEventsError && onUpdateEnrollmentEventsError(payload.serverData.events);
            },
        },
    );

    return {
        addEventWithRelationship: mutate,
    };
};
