// @flow
import i18n from '@dhis2/d2-i18n';
// $FlowFixMe - useAlert is exported from app-runtime
import { useDataEngine, useAlert } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';

type Props = {
    teiId: string;
    onMutate?: () => void;
    onSuccess?: () => void;
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

    const { mutate } = useMutation(
        ({ apiData }) => dataEngine.mutate(addRelationshipMutation, {
            variables: {
                apiData,
            },
        }),
        {
            onError: () => {
                queryClient.invalidateQueries([ReactQueryAppNamespace, 'relationships']);
                showSnackbar();
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
