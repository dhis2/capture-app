// @flow
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator, FEATURES, useFeature } from 'capture-core-utils';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
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
    const queryKey: string = useFeature(FEATURES.exportablePayload) ? 'relationships' : 'instances';
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
                const prevRelationships = queryClient
                    .getQueryData([ReactQueryAppNamespace, 'relationships', sourceId]);

                const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, prevRelationships);

                const newRelationships = apiRelationships
                    ?.filter(({ relationship }) => relationship !== relationshipId);

                queryClient.setQueryData(
                    [ReactQueryAppNamespace, 'relationships', sourceId],
                    { [queryKey]: newRelationships });

                return { prevRelationships };
            },
            onError: (error, { relationshipId }, context) => {
                log.error(errorCreator('An error occurred while deleting the relationship')({ error, relationshipId }));
                showError();

                if (!context?.prevRelationships) return;
                queryClient.setQueryData(
                    [ReactQueryAppNamespace, 'relationships', sourceId],
                    context.prevRelationships,
                );
            },
        },
    );

    return { onDeleteRelationship };
};
