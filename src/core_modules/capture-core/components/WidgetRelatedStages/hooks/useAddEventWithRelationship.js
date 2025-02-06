// @flow
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';
import { relatedStageActions } from '../constants';

const ReactQueryAppNamespace = 'capture';

const addEventWithRelationshipMutation = {
    resource: '/tracker?async=false&importStrategy=CREATE_AND_UPDATE',
    type: 'create',
    data: ({ serverData }) => serverData,
};

export const useAddEventWithRelationship = ({
    eventId,
    onUpdateOrAddEnrollmentEvents,
    onUpdateEnrollmentEventsSuccess,
    onUpdateEnrollmentEventsError,
    onNavigateToEvent,
}: {
    eventId: string,
    onUpdateOrAddEnrollmentEvents: (events: Array<ApiEnrollmentEvent>) => void,
    onUpdateEnrollmentEventsSuccess: (events: Array<ApiEnrollmentEvent>) => void,
    onUpdateEnrollmentEventsError: (events: Array<ApiEnrollmentEvent>) => void,
    onNavigateToEvent: (eventId: string) => void,
}) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showSccess } = useAlert(({ message }) => message, { success: true });
    const { show: showAlert } = useAlert(({ message }) => message, { critical: true });

    const { mutate } = useMutation<any, Error, { serverData: Object, linkMode: string, eventIdToRedirectTo?: string }>(
        ({ serverData }: Object) =>
            dataEngine.mutate(addEventWithRelationshipMutation, {
                variables: {
                    serverData,
                },
            }),
        {
            onMutate: (payload: { serverData: Object }) => {
                onUpdateOrAddEnrollmentEvents && onUpdateOrAddEnrollmentEvents(payload.serverData.events);
            },
            onSuccess: (_, payload: { linkMode: string, eventIdToRedirectTo?: string, serverData: Object }) => {
                const queryKey = [ReactQueryAppNamespace, 'linkedEventByOriginEvent', eventId];
                queryClient.refetchQueries(queryKey);
                onUpdateEnrollmentEventsSuccess && onUpdateEnrollmentEventsSuccess(payload.serverData.events);

                if (payload.linkMode === relatedStageActions.ENTER_DATA && payload.eventIdToRedirectTo) {
                    onNavigateToEvent(payload.eventIdToRedirectTo);
                } else {
                    showSccess({ message: i18n.t('The event was succesfully linked') });
                }
            },
            onError: (_, payload: { serverData: Object }) => {
                showAlert({ message: i18n.t('An error occurred while linking the event') });
                onUpdateEnrollmentEventsError && onUpdateEnrollmentEventsError(payload.serverData.events);
            },
        },
    );

    return {
        addEventWithRelationship: mutate,
    };
};
