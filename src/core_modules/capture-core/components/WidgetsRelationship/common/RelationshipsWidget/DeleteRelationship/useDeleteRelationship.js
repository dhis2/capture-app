// @flow
import i18n from '@dhis2/d2-i18n';
import { useMutation, useQueryClient } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { ReactQueryAppNamespace } from '../../../../../utils/reactQueryHelpers';

type Props = {
    sourceId: string,
};

export type OnDeleteRelationship = ({ relationshipId: string }) => void;

const deleteRelationshipMutation = {
    resource: 'tracker?importStrategy=DELETE&async=false',
    type: 'create',
    data: ({ relationshipId }) => ({
        relationships: [
            {
                relationship: relationshipId,
            },
        ],
    }),
};
export const useDeleteRelationship = ({ sourceId }: Props): { onDeleteRelationship: OnDeleteRelationship } => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showError } = useAlert(
        i18n.t('An error occurred while deleting the relationship.'),
        {
            critical: true,
        },
    );
    const { mutate: onDeleteRelationship } = useMutation(
        ({ relationshipId }) => dataEngine.mutate(deleteRelationshipMutation, { variables: { relationshipId } }),
        {
            onMutate: ({ relationshipId }) => {
                const currentRelationships = queryClient
                    .getQueryData([ReactQueryAppNamespace, 'relationships', sourceId]);

                const newRelationships = currentRelationships
                    ?.instances
                    .filter(({ relationship }) => relationship !== relationshipId);

                queryClient.setQueryData(
                    [ReactQueryAppNamespace, 'relationships', sourceId],
                    { instances: newRelationships });
            },
            onError: showError,
        },
    );

    return { onDeleteRelationship };
};
