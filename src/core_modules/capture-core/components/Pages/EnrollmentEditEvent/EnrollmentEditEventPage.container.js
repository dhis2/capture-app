// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode } from './EnrollmentEditEventPage.const';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { urlArguments } from '../../../utils/url';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';

export const EnrollmentEditEventPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { programId, stageId, teiId, enrollmentId, orgUnitId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
            teiId: query.teiId,
            orgUnitId: query.orgUnitId,
            enrollmentId: query.enrollmentId,
        }),
        shallowEqual,
    );
    const { program } = useProgramInfo(programId);
    const showEditEvent = useSelector(
        ({ viewEventPage }) =>
            viewEventPage?.eventDetailsSection?.showEditEvent,
    );
    const programStage = [...program.stages?.values()].find(
        item => item.id === stageId,
    );
    const currentPageMode = showEditEvent ? pageMode.EDIT : pageMode.VIEW;
    const outputEffects = useWidgetDataFromStore(`singleEvent-${currentPageMode}`);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);

    const onDelete = () => {
        history.push(`/enrollment?${urlArguments({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onGoBack = () => history.push(`/enrollment?${urlArguments({ orgUnitId, programId, teiId, enrollmentId })}`);

    return (
        <EnrollmentEditEventPageComponent
            mode={currentPageMode}
            programStage={programStage}
            onGoBack={onGoBack}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            teiId={teiId}
            enrollmentId={enrollmentId}
            programId={programId}
            onDelete={onDelete}
        />
    );
};
