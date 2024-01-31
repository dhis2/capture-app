// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation } from 'react-query';
import { ProgramAccessLevels } from '../../../TransferModal/hooks/useProgramAccessLevel';
import { OrgUnitScopes } from '../../../TransferModal/hooks/useTransferValidation';
import { FEATURES, useFeature } from '../../../../../../capture-core-utils';

type Props = {
    teiId: ?string,
    programId: ?string,
    onTransferOutsideCaptureScope?: () => void,
    refetchTEI: QueryRefetchFunction,
}

export type UpdateEnrollmentOwnership = {|
    orgUnitId: string,
    programAccessLevel: ?$Values<typeof ProgramAccessLevels>,
    orgUnitScopes: {
        ORIGIN: ?$Values<typeof OrgUnitScopes>,
        DESTINATION: ?$Values<typeof OrgUnitScopes>,
    },
|} => void;


const UpdateEnrollmentOwnershipMutation = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ teiId, programId, orgUnitId, teiParamKey }) => {
        const params = {
            program: programId,
            ou: orgUnitId,
            [teiParamKey]: teiId,
        };

        return params;
    },
};

export const useUpdateOwnership = ({
    refetchTEI,
    programId,
    teiId,
    onTransferOutsideCaptureScope,
}: Props): { updateEnrollmentOwnership: UpdateEnrollmentOwnership } => {
    const dataEngine = useDataEngine();
    const teiParamKey = useFeature(FEATURES.newTransferQueryParam) ? 'trackedEntity' : 'trackedEntityInstance';
    const { show: showErrorAlert } = useAlert(
        i18n.t('An error occurred while transferring ownership'),
        { critical: true },
    );

    // $FlowFixMe
    const { mutate: updateEnrollmentOwnership } = useMutation(
        ({ orgUnitId }) => dataEngine.mutate(UpdateEnrollmentOwnershipMutation, {
            variables: {
                programId,
                teiId,
                orgUnitId,
                teiParamKey,
            },
        }),
        {
            onMutate: ({ programAccessLevel, orgUnitScopes }) => {
                // If the user is transferring ownership to a capture scope, we stay on the same page
                if (orgUnitScopes.DESTINATION === OrgUnitScopes.CAPTURE) {
                    refetchTEI();
                    return;
                }

                if ([ProgramAccessLevels.OPEN, ProgramAccessLevels.AUDITED].includes(programAccessLevel)) {
                    refetchTEI();
                    return;
                }

                // Assuming that all cases are outside the capture scope and program is protected or closed

                if (programAccessLevel === ProgramAccessLevels.PROTECTED) {
                    if (orgUnitScopes.ORIGIN === OrgUnitScopes.CAPTURE) {
                        onTransferOutsideCaptureScope && onTransferOutsideCaptureScope();
                        return;
                    } else if (orgUnitScopes.ORIGIN === OrgUnitScopes.SEARCH) {
                        refetchTEI();
                        return;
                    }
                }

                if (programAccessLevel === ProgramAccessLevels.CLOSED) {
                    onTransferOutsideCaptureScope && onTransferOutsideCaptureScope();
                }
            },
            onError: () => showErrorAlert(),
        },
    );

    return {
        updateEnrollmentOwnership,
    };
};
