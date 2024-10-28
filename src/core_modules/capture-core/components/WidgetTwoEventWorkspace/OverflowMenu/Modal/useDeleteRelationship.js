// @flow
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useMutation } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';

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

export const useDeleteRelationship = (): { onDeleteRelationship: OnDeleteRelationship } => {
    const dataEngine = useDataEngine();
    const { show: showError } = useAlert(
        i18n.t('An error occurred while deleting the relationship.'),
        {
            critical: true,
        },
    );

    const { mutate: onDeleteRelationship } = useMutation(
        ({ relationshipId }) =>
            dataEngine.mutate(deleteRelationshipMutation, { variables: { relationshipId } }),
        {
            onError: (error, { relationshipId }) => {
                log.error(
                    errorCreator('An error occurred while deleting the relationship')({
                        error,
                        relationshipId,
                    }),
                );
                showError();
            },
        },
    );

    return { onDeleteRelationship };
};
