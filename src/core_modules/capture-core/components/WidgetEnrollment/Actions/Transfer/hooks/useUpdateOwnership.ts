import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useMutation } from 'react-query';
import { ProgramAccessLevels } from '../../../TransferModal/hooks/useProgramAccessLevel';
import { OrgUnitScopes } from '../../../TransferModal/hooks/useTransferValidation';
import { errorCreator, FEATURES, useFeature } from '../../../../../../capture-core-utils';

type QueryRefetchFunction = () => void;

export type UpdateEnrollmentOwnership = (params: {
    orgUnitId: string;
    programAccessLevel: typeof ProgramAccessLevels[keyof typeof ProgramAccessLevels] | null;
    orgUnitScopes: {
        origin: typeof OrgUnitScopes[keyof typeof OrgUnitScopes] | null;
        destination: typeof OrgUnitScopes[keyof typeof OrgUnitScopes] | null;
    };
}) => Promise<void>;

type Props = {
    teiId: string | null;
    programId: string | null;
    onAccessLostFromTransfer?: () => void;
    refetchTEI: QueryRefetchFunction;
};

type ReturnTypes = {
    updateEnrollmentOwnership: UpdateEnrollmentOwnership;
    isTransferLoading: boolean;
};

const updateEnrollmentOwnershipMutation = {
    resource: 'tracker/ownership/transfer',
    type: 'update',
    params: ({ teiId, programId, orgUnitId, teiParamKey }: { teiId: string | null; programId: string | null; orgUnitId: string; teiParamKey: string }) => ({
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
    const teiParamKey = useFeature(FEATURES.newTrackedEntityQueryParam) ? 'trackedEntity' : 'trackedEntityInstance';
    const { show: showErrorAlert } = useAlert(
        i18n.t('An error occurred while transferring ownership'),
        { critical: true },
    );

    const { mutateAsync: updateEnrollmentOwnershipFn, isLoading } = useMutation(
        ({ orgUnitId }: { orgUnitId: string }) => dataEngine.mutate(updateEnrollmentOwnershipMutation as any, {
            variables: {
                programId,
                teiId,
                orgUnitId,
                teiParamKey,
            },
        }),
        {
            onSuccess: (_, params: any) => {
                const { programAccessLevel, orgUnitScopes } = params;
                if (orgUnitScopes.destination === OrgUnitScopes.CAPTURE) {
                    refetchTEI();
                    return;
                }

                if ([ProgramAccessLevels.OPEN, ProgramAccessLevels.AUDITED].includes(programAccessLevel)) {
                    refetchTEI();
                    return;
                }

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

    const updateEnrollmentOwnership: UpdateEnrollmentOwnership = async (params) => {
        await updateEnrollmentOwnershipFn({ orgUnitId: params.orgUnitId });
    };

    return {
        updateEnrollmentOwnership,
        isTransferLoading: isLoading,
    };
};
