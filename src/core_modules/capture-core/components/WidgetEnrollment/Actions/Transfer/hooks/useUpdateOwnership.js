// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useMutation } from 'react-query';
import { ProgramAccessLevels } from '../../../TransferModal/hooks/useProgramAccessLevel';
import { OrgUnitScopes } from '../../../TransferModal/hooks/useTransferValidation';
import { errorCreator, FEATURES, useFeature } from '../../../../../../capture-core-utils';

export type UpdateEnrollmentOwnership = {|
    orgUnitId: string,
    programAccessLevel: ?$Values<typeof ProgramAccessLevels>,
    orgUnitScopes: {
        origin: ?$Values<typeof OrgUnitScopes>,
        destination: ?$Values<typeof OrgUnitScopes>,
    },
|} => Promise<void>;

type Props = {
    teiId: ?string,
    programId: ?string,
    onAccessLostFromTransfer?: () => void,
    refetchTEI: QueryRefetchFunction,
}

type ReturnTypes = {
    updateEnrollmentOwnership: UpdateEnrollmentOwnership,
    isTransferLoading: boolean,
}

const updateEnrollmentOwnershipMutation = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ teiId, programId, orgUnitId, teiParamKey }) => ({
        program: programId,
        ou: orgUnitId,
        [teiParamKey]: teiId,
    }),
};

export const useUpdateOwnership = ({
    refetchTEI,
    programId,
    teiId,
    onAccessLostFromTransfer,
}: Props): ReturnTypes => {
    const dataEngine = useDataEngine();
    const teiParamKey = useFeature(FEATURES.newTransferQueryParam) ? 'trackedEntity' : 'trackedEntityInstance';
    const { show: showErrorAlert } = useAlert(
        i18n.t('An error occurred while transferring ownership'),
        { critical: true },
    );

    // $FlowFixMe
    const { mutateAsync: updateEnrollmentOwnership, isLoading } = useMutation(
        ({ orgUnitId }) => dataEngine.mutate(updateEnrollmentOwnershipMutation, {
            variables: {
                programId,
                teiId,
                orgUnitId,
                teiParamKey,
            },
        }),
        {
            onSuccess: (_, { programAccessLevel, orgUnitScopes }) => {
                // If the user is transferring ownership to a capture scope, we stay on the same page
                if (orgUnitScopes.destination === OrgUnitScopes.CAPTURE) {
                    refetchTEI();
                    return;
                }

                if ([ProgramAccessLevels.OPEN, ProgramAccessLevels.AUDITED].includes(programAccessLevel)) {
                    refetchTEI();
                    return;
                }

                // Assuming that all cases are outside the capture scope and program is protected or closed
                if (programAccessLevel === ProgramAccessLevels.PROTECTED) {
                    if (orgUnitScopes.origin === OrgUnitScopes.CAPTURE) {
                        onAccessLostFromTransfer && onAccessLostFromTransfer();
                        return;
                    } else if (orgUnitScopes.origin === OrgUnitScopes.SEARCH) {
                        refetchTEI();
                        return;
                    }
                }

                if (programAccessLevel === ProgramAccessLevels.CLOSED) {
                    onAccessLostFromTransfer && onAccessLostFromTransfer();
                }
            },
            onError: (error) => {
                showErrorAlert();
                log.error(
                    errorCreator('Failed to transfer ownership')({
                        error,
                    }),
                );
            },
        },
    );

    return {
        updateEnrollmentOwnership,
        isTransferLoading: isLoading,
    };
};
