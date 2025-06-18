import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useMutation } from 'react-query';
import { errorCreator, FEATURES, useFeature } from 'capture-core-utils';
import type { QueryRefetchFunction } from 'capture-core-utils/types/app-runtime';
import { ProgramAccessLevels } from '../../../TransferModal/hooks/useProgramAccessLevel';
import { OrgUnitScopes } from '../../../TransferModal/hooks/useTransferValidation';

export type UpdateEnrollmentOwnership = (params: {
    orgUnitId: string;
    programAccessLevel?: any;
    orgUnitScopes: {
        origin?: any;
        destination?: any;
    };
}) => Promise<any>;

type Props = {
    teiId?: string | null;
    programId?: string | null;
    onAccessLostFromTransfer?: () => void;
    refetchTEI: QueryRefetchFunction;
};

type ReturnTypes = {
    updateEnrollmentOwnership: UpdateEnrollmentOwnership;
    isTransferLoading: boolean;
};

const updateEnrollmentOwnershipMutation: any = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ teiId, programId, orgUnitId, teiParamKey, orgUnitKey }: any) => ({
        program: programId,
        [orgUnitKey]: orgUnitId,
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
    const { show: showErrorAlert } = useAlert(
        i18n.t('An error occurred while transferring ownership'),
        { critical: true },
    );
    const teiParamKey = useFeature(FEATURES.newTrackedEntityQueryParam) ? 'trackedEntity' : 'trackedEntityInstance';
    const orgUnitKey = useFeature(FEATURES.orgUnitReplaceOuQueryParam) ? 'orgUnit' : 'ou';

    const { mutateAsync: mutateOwnership, isLoading } = useMutation(
        ({ orgUnitId }: { orgUnitId: string }) => dataEngine.mutate(updateEnrollmentOwnershipMutation, {
            variables: {
                programId,
                teiId,
                orgUnitId,
                orgUnitKey,
                teiParamKey,
            },
        }),
        {
            onSuccess: (_, { programAccessLevel, orgUnitScopes }: any) => {
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

    const updateEnrollmentOwnership: UpdateEnrollmentOwnership = params => mutateOwnership(params);

    return {
        updateEnrollmentOwnership,
        isTransferLoading: isLoading,
    };
};
