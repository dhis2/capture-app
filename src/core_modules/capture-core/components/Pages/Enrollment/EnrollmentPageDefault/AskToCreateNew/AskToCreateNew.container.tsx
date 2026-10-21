import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../../../utils/routing';
import { clearAskToCreateNew } from '../../../common/EnrollmentOverviewDomain';
import type { AskToCreateNew as AskToCreateNewState } from '../../../common/EnrollmentOverviewDomain';
import { tabMode } from '../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.constants';
import { AskToCreateNewComponent } from './AskToCreateNew.component';

export const AskToCreateNew = () => {
    const { navigate } = useNavigate();
    const dispatch = useDispatch();
    const { enrollmentId } = useLocationQuery();
    const askToCreateNew: AskToCreateNewState | undefined = useSelector(
        ({ enrollmentDomain }: any) => enrollmentDomain?.askToCreateNew,
    );

    // Only ask while the user stays on the dashboard they were sent to after saving
    useEffect(() => () => {
        dispatch(clearAskToCreateNew());
    }, [dispatch, enrollmentId]);

    const handleCancel = useCallback(() => {
        dispatch(clearAskToCreateNew());
    }, [dispatch]);

    const handleConfirm = useCallback(() => {
        if (!askToCreateNew) {
            return;
        }
        const { availableProgramStageIds, stageId, ...params } = askToCreateNew;
        dispatch(clearAskToCreateNew());
        navigate(`/enrollmentEventNew?${buildUrlQueryString({
            ...params,
            ...(availableProgramStageIds.length === 1 ? { stageId: availableProgramStageIds[0] } : {}),
            tab: tabMode.SCHEDULE,
        })}`);
    }, [dispatch, navigate, askToCreateNew]);

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
