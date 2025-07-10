import i18n from '@dhis2/d2-i18n';
import { FEATURES, useFeature } from 'capture-core-utils';
import { useDataEngine, useAlert } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';

type Props = {
    teiId: string;
    onMutate?: () => void;
    onSuccess?: (apiResponse: Record<string, unknown>, requestData: Record<string, unknown>) => void;
};

const ReactQueryAppNamespace = 'capture';

export const useAddRelationship = ({ teiId, onMutate, onSuccess }: Props) => {
    const queryClient = useQueryClient();
    const queryKey: string = useFeature(FEATURES.exportablePayload) ? 'relationships' : 'instances';
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        i18n.t('An error occurred while adding the relationship'),
        { critical: true },
    );

    const { mutate } = useMutation(
        ({ apiData }: { apiData: any }) => dataEngine.mutate({
            resource: '/tracker?async=false&importStrategy=CREATE',
            type: 'create',
            data: apiData,
        }),
        {
            onError: (_: any, requestData: any) => {
                showAlert();
                const apiRelationshipId = requestData.clientRelationship.relationship;
                const apiResponse = queryClient.getQueryData([ReactQueryAppNamespace, 'relationships', teiId]);
                const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, apiResponse);

                if (apiRelationships.length === 0) return;

                const newRelationships = apiRelationships.reduce((acc: any[], relationship: any) => {
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
            onMutate: (payload: { apiData: any; clientRelationship: any }) => {
                onMutate && onMutate();
                const { clientRelationship } = payload;
                if (!clientRelationship) return;

                queryClient.setQueryData([ReactQueryAppNamespace, 'relationships', teiId], (apiResponse: any) => {
                    const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, apiResponse);
                    const updatedInstances = [clientRelationship, ...apiRelationships];
                    return { [queryKey]: updatedInstances };
                });
            },
            onSuccess: async (apiResponse: any, requestData: any) => {
                const apiRelationshipIds = apiResponse.bundleReport.typeReportMap.RELATIONSHIP.objectReports.reduce(
                    (acc: string[], report: any) => [...acc, report.uid],
                    [],
                );
                const currentRelationships = queryClient.getQueryData([ReactQueryAppNamespace, 'relationships', teiId]);
                const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, currentRelationships);
                if (apiRelationships.length === 0) return;

                const newRelationships = apiRelationships.map((relationship: any) => {
                    if (
                        apiRelationshipIds.find(
                            (apiRelationshipId: string) => apiRelationshipId === relationship.relationship,
                        )
                    ) {
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
