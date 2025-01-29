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
    onUpdateEnrollment,
    onUpdateEnrollmentSuccess,
    onUpdateEnrollmentError,
    onNavigateToEvent,
}: {
    eventId: string,
    onUpdateEnrollment: (enrollment: Object) => void,
    onUpdateEnrollmentSuccess: ({ redirect?: boolean }) => void,
    onUpdateEnrollmentError: (message: string) => void,
    onNavigateToEvent: (eventId: string) => void,
}) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showAlert } = useAlert(({ message }) => message, { success: true });

    const { mutate } = useMutation<any, Error, { serverData: Object, linkMode: string, eventIdToRedirectTo?: string }>(
        ({ serverData }: Object) =>
            dataEngine.mutate(addEventWithRelationshipMutation, {
                variables: {
                    serverData,
                },
            }),
        {
            onMutate: (payload: { serverData: Object }) => {
                const enrollmentToUpdate = payload.serverData.enrollments?.[0];
                enrollmentToUpdate && onUpdateEnrollment(enrollmentToUpdate);
            },
            onSuccess: (_, payload: { linkMode: string, eventIdToRedirectTo?: string }) => {
                const queryKey = [ReactQueryAppNamespace, 'linkedEventByOriginEvent', eventId];
                queryClient.refetchQueries(queryKey);
                onUpdateEnrollmentSuccess({});

                if (payload.linkMode === relatedStageActions.ENTER_DATA && payload.eventIdToRedirectTo) {
                    onNavigateToEvent(payload.eventIdToRedirectTo);
                } else {
                    showAlert({ message: i18n.t('The event was succesfully linked') });
                }
            },
            onError: () => {
                onUpdateEnrollmentError(i18n.t('An error occurred while linking the event'));
            },
        },
    );

    return {
        addEventWithRelationship: mutate,
    };
};
