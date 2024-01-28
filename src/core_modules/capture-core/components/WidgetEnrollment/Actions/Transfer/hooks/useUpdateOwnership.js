// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine, useConfig } from '@dhis2/app-runtime';
import { useMutation } from 'react-query';

type Props = {
    teiId: ?string,
    programId: ?string,
    refetchTEI: QueryRefetchFunction,
}


const UpdateEnrollmentOwnershipMutation = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ teiId, programId, orgUnitId, apiVersion }) => {
        const params = {
            program: programId,
            ou: orgUnitId,
            trackedEntityInstance: null,
            trackedEntity: null,
        };

        if (apiVersion <= 40) {
            params.trackedEntityInstance = teiId;
        } else {
            params.trackedEntity = teiId;
        }

        return params;
    },
};

export const useUpdateOwnership = ({ refetchTEI, programId, teiId }: Props) => {
    const dataEngine = useDataEngine();
    const { apiVersion } = useConfig();
    const { show: showErrorAlert } = useAlert(
        i18n.t('An error occurred while transferring ownership'),
        { critical: true },
    );
    const orgUnitIsInScope = async (orgUnitId: string) => {
        const captureScopeQuery = dataEngine.query({
            orgUnits: {
                resource: 'organisationUnits',
                params: {
                    paging: false,
                    userOnly: true,
                    fields: 'id,displayName',
                },
            },
        });

        const ancestorsQuery = dataEngine.query({
            ancestors: {
                resource: 'organisationUnits',
                id: orgUnitId,
                params: {
                    fields: 'ancestors[id,displayName]',
                },
            },
        });

        const result = await Promise.all([
            captureScopeQuery,
            ancestorsQuery,
        ]);

        const [{ orgUnits: { organisationUnits } }, { ancestors: { ancestors } }] = result;
        ancestors.push({ id: orgUnitId });
        debugger;
        return ancestors.some(({ id: ancestorId }) => organisationUnits.some(({ id }) => {
            return ancestorId === id;
        }));
    };

    // $FlowFixMe
    const { mutate: updateEnrollmentOwnership } = useMutation(
        (orgUnitId: string) => dataEngine.mutate(UpdateEnrollmentOwnershipMutation, {
            variables: {
                programId,
                teiId,
                orgUnitId,
                apiVersion,
            },
        }),
        {
            onMutate: (orgUnitId) => {
                orgUnitIsInScope(orgUnitId).then((isInScope) => {
                    if (isInScope) {
                        refetchTEI();
                    }
                });
            },
            onError: () => showErrorAlert(),
        },
    );

    return {
        updateEnrollmentOwnership,
    };
};
