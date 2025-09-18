import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { ReduxState } from '../../../App/withAppUrlSync.types';
import { dataEntryHasChanges } from '../../../DataEntry/common/dataEntryHasChanges';
import {
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    useResetTeiId,
    useResetEnrollmentId,
    useResetStageId,
    useResetEventId,
    buildEnrollmentsAsOptions,
} from '../../../ScopeSelector';
import { useTeiDisplayName } from '../../common/EnrollmentOverviewDomain/useTeiDisplayName';

export const useEnrollmentAddEventTopBar = (teiId: string, programId: string, enrollment?: any) => {
    const { setOrgUnitId } = useSetOrgUnitId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();
    const { resetEnrollmentId } = useResetEnrollmentId();
    const { resetTeiId } = useResetTeiId();
    const { resetStageId } = useResetStageId();
    const { resetEventId } = useResetEventId();
    const userInteractionInProgress = useSelector((state: ReduxState) => 
        dataEntryHasChanges(state, 'enrollmentEvent-newEvent'));

    const handleResetProgramId = useCallback(
        () => resetProgramIdAndEnrollmentContext('enrollment', { teiId, programId }), 
        [resetProgramIdAndEnrollmentContext, teiId, programId],
    );
    const handleResetEnrollmentId = useCallback(() => resetEnrollmentId('enrollment'), [resetEnrollmentId]);
    const handleResetTeiId = useCallback(() => resetTeiId('/'), [resetTeiId]);
    const handleResetStageId = useCallback(() => resetStageId('enrollmentEventNew'), [resetStageId]);
    const handleResetEventId = useCallback(() => resetEventId('enrollmentEventNew'), [resetEventId]);

    const { teiDisplayName, error: teiDisplayNameError } = useTeiDisplayName(teiId, programId);
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollment || {}], programId);

    return {
        handleSetOrgUnitId: setOrgUnitId,
        handleResetOrgUnitId: resetOrgUnitId,
        handleResetProgramId,
        handleResetEnrollmentId,
        handleResetTeiId,
        handleResetStageId,
        handleResetEventId,
        teiDisplayName,
        enrollmentsAsOptions,
        teiSelectorFailure: Boolean(teiDisplayNameError),
        userInteractionInProgress,
    };
};
