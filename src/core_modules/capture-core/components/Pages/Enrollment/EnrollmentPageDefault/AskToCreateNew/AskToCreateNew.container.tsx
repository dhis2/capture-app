import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../../../utils/routing';
import { clearAskToCreateNew } from '../../../common/EnrollmentOverviewDomain';
import { tabMode } from '../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.constants';
import { AskToCreateNewComponent } from './AskToCreateNew.component';

type AskToCreateNewState = {
    enrollmentId: string;
    stageId: string;
    availableProgramStageIds: Array<string>;
};

export const AskToCreateNew = () => {
    const { navigate } = useNavigate();
    const dispatch = useDispatch();
    const { enrollmentId, programId, teiId, orgUnitId } = useLocationQuery();
    const askToCreateNew: AskToCreateNewState | undefined = useSelector(
        ({ enrollmentDomain }: any) => enrollmentDomain?.askToCreateNew,
    );

    const handleCancel = useCallback(() => {
        dispatch(clearAskToCreateNew());
    }, [dispatch]);

    const handleConfirm = useCallback(() => {
        const availableProgramStageIds = askToCreateNew?.availableProgramStageIds ?? [];
        dispatch(clearAskToCreateNew());
        navigate(`/enrollmentEventNew?${buildUrlQueryString({
            enrollmentId,
            orgUnitId,
            programId,
            teiId,
            ...(availableProgramStageIds.length === 1 ? { stageId: availableProgramStageIds[0] } : {}),
            tab: tabMode.SCHEDULE,
        })}`);
    }, [dispatch, navigate, askToCreateNew, enrollmentId, orgUnitId, programId, teiId]);

    if (!askToCreateNew || askToCreateNew.enrollmentId !== enrollmentId) {
        return null;
    }

    return (
        <AskToCreateNewComponent
            stageId={askToCreateNew.stageId}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
        />
    );
};
