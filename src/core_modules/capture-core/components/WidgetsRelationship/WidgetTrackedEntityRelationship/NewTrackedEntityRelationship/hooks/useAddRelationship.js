// @flow
import i18n from '@dhis2/d2-i18n';
import { useDataEngine, useAlert } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';

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
                const currentRelationships = queryClient.getQueryData([ReactQueryAppNamespace, 'relationships', teiId]);

                if (!currentRelationships?.instances) return;

                const newRelationships = currentRelationships.instances.reduce((acc, relationship) => {
                    if (relationship.relationship === apiRelationshipId) {
                        return acc;
                    }
                    acc.push(relationship);
                    return acc;
                }, []);

                queryClient.setQueryData(
                    [ReactQueryAppNamespace, 'relationships', teiId],
                    { instances: newRelationships },
                );
            },
            onMutate: (...props) => {
                onMutate && onMutate(...props);
                const { clientRelationship } = props[0];
                if (!clientRelationship) return;

                queryClient.setQueryData([ReactQueryAppNamespace, 'relationships', teiId], (oldData) => {
                    const instances = oldData?.instances || [];
                    const updatedInstances = [clientRelationship, ...instances];
                    return { instances: updatedInstances };
                });
            },
            onSuccess: async (apiResponse, requestData) => {
                const apiRelationshipId = apiResponse.bundleReport.typeReportMap.RELATIONSHIP.objectReports[0].uid;
                const currentRelationships = queryClient.getQueryData([ReactQueryAppNamespace, 'relationships', teiId]);
                if (!currentRelationships?.instances) return;

                const newRelationships = currentRelationships.instances.map((relationship) => {
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
                    { instances: newRelationships },
                );
                onSuccess && onSuccess(apiResponse, requestData);
            },
        },
    );

    return {
        addRelationship: mutate,
    };
};
