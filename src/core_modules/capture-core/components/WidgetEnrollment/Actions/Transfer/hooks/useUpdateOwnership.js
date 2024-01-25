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
    const orgUnitIsInScope = async (orgUnitId: string) => {
        const captureScopeQuery = dataEngine.query({
            orgUnits: {
                resource: 'organisationUnits',
                params: {
                    paging: false,
                    userOnly: true,
                    fields: 'id',
                },
            },
        });

        const ancestorsQuery = dataEngine.query({
            ancestors: {
                resource: 'organisationUnits',
                id: orgUnitId,
                params: {
                    fields: 'ancestors',
                },
            },
        });

        const result = await Promise.all([
            captureScopeQuery,
            ancestorsQuery,
        ]);

        const [{ orgUnits: { organisationUnits } }, { ancestors: { ancestors } }] = result;
        debugger;
        ancestors.push({ id: orgUnitId });
        return ancestors.some(({ id: ancestorId }) => organisationUnits.some(({ id }) => ancestorId === id));
    };

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
            onMutate: (orgUnitId) => {
                orgUnitIsInScope(orgUnitId).then((isInScope) => {
                    debugger;
                    if (isInScope) {
                        refetchTEI();
                    }
                });
            },
        },
    );

    return {
        updateEnrollmentOwnership,
    };
};
