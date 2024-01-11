// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';
import { useDataEngine } from '@dhis2/app-runtime';
import { useMutation } from 'react-query';

type Props = {
    teiId: ?string,
    programId: ?string,
    refetchTEI: QueryRefetchFunction,
}

const UpdateEnrollmentOwnershipMutation = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ teiId, programId, orgUnitId }) => ({
        trackedEntity: teiId,
        program: programId,
        ou: orgUnitId,
    }),
};

export const useUpdateOwnership = ({ refetchTEI, programId, teiId }: Props) => {
    const dataEngine = useDataEngine();
    // $FlowFixMe
    const { mutate: updateEnrollmentOwnership } = useMutation(
        (orgUnitId: string) => dataEngine.mutate(UpdateEnrollmentOwnershipMutation, {
            variables: {
                programId,
                teiId,
                orgUnitId,
            },
        }),
        {
            onSuccess: () => {
                refetchTEI();
            },
        },
    );

    return {
        updateEnrollmentOwnership,
    };
};
