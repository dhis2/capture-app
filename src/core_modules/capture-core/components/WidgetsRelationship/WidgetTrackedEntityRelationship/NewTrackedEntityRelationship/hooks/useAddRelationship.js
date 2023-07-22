// @flow
import { useMutation, useQueryClient } from 'react-query';
import { useDataEngine } from '@dhis2/app-runtime';

type Props = {
    teiId: string;
    onMutate?: () => void;
    onSuccess?: () => void;
}

const ReactQueryAppNamespace = 'capture';

const addRelationshipMutation = {
    resource: '/tracker?async=false&importStrategy=CREATE',
    type: 'create',
    data: ({ relationship }) => ({
        relationships: [relationship],
    }),
};

export const useAddRelationship = ({ teiId, onMutate, onSuccess }: Props) => {
    const queryClient = useQueryClient();
    const dataEngine = useDataEngine();
    // $FlowFixMe - Is there something wrong with the types?
    const { mutate } = useMutation(
        ({ relationship }) => dataEngine.mutate(addRelationshipMutation, {
            variables: {
                relationship,
            },
        }),
        {
            onMutate: (...props) => {
                onMutate && onMutate(...props);
                const { clientRelationship } = props[0];
                queryClient.setQueryData([ReactQueryAppNamespace, 'relationships', teiId], (oldData) => {
                    const instances = oldData?.instances || [];
                    const updatedInstances = [clientRelationship, ...instances];
                    return { instances: updatedInstances };
                });
            },
            onSuccess: (...props) => {
                queryClient.invalidateQueries([ReactQueryAppNamespace, 'relationships']);
                onSuccess && onSuccess(...props);
            },
        },
    );

    return {
        mutate,
    };
};
