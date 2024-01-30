// @flow
import i18n from '@dhis2/d2-i18n';
import { FEATURES, useFeature } from 'capture-core-utils';
import { useDataEngine, useAlert } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';

type Props = {
    teiId: string;
    onMutate?: () => void;
    onSuccess?: (apiResponse: Object, requestData: Object) => void;
}

const ReactQueryAppNamespace = 'capture';

const addRelationshipMutation = {
    resource: '/tracker?async=false&importStrategy=CREATE',
    type: 'create',
    data: ({ apiData }) => apiData,
};

export const useAddRelationship = ({ teiId, onMutate, onSuccess }: Props) => {
    const queryClient = useQueryClient();
    const queryKey: string = useFeature(FEATURES.exportablePayload) ? 'relationships' : 'instances';
    const dataEngine = useDataEngine();
    const { show: showSnackbar } = useAlert(
        i18n.t('An error occurred while adding the relationship'),
        { critical: true },
    );

    // $FlowFixMe
    const { mutate } = useMutation(
        ({ apiData }) => dataEngine.mutate(addRelationshipMutation, {
            variables: {
                apiData,
            },
        }),
        {
            onError: (_, requestData) => {
                showSnackbar();
                const apiRelationshipId = requestData.clientRelationship.relationship;
                const apiResponse = queryClient.getQueryData([ReactQueryAppNamespace, 'relationships', teiId]);
                const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, apiResponse);

                if (apiRelationships.length === 0) return;

                const newRelationships = apiRelationships.reduce((acc, relationship) => {
                    if (relationship.relationship === apiRelationshipId) {
                        return acc;
                    }
                    acc.push(relationship);
                    return acc;
                }, []);

                queryClient.setQueryData(
                    [ReactQueryAppNamespace, 'relationships', teiId],
                    { [queryKey]: newRelationships },
                );
            },
            onMutate: (...props) => {
                onMutate && onMutate(...props);
                const { clientRelationship } = props[0];
                if (!clientRelationship) return;

                queryClient.setQueryData([ReactQueryAppNamespace, 'relationships', teiId], (apiResponse) => {
                    const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, apiResponse);
                    const updatedInstances = [clientRelationship, ...apiRelationships];
                    return { [queryKey]: updatedInstances };
                });
            },
            onSuccess: async (apiResponse, requestData) => {
                const apiRelationshipId = apiResponse.bundleReport.typeReportMap.RELATIONSHIP.objectReports[0].uid;
                const currentRelationships = queryClient.getQueryData([ReactQueryAppNamespace, 'relationships', teiId]);
                const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, currentRelationships);
                if (apiRelationships.length === 0) return;

                const newRelationships = apiRelationships.map((relationship) => {
                    if (relationship.relationship === apiRelationshipId) {
                        return {
                            ...relationship,
                            pendingApiResponse: false,
                        };
                    }
                    return relationship;
                });

                queryClient.setQueryData(
                    [ReactQueryAppNamespace, 'relationships', teiId],
                    { [queryKey]: newRelationships },
                );
                onSuccess && onSuccess(apiResponse, requestData);
            },
        },
    );

    return {
        addRelationship: mutate,
    };
};
