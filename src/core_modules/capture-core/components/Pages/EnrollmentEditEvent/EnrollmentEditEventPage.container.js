// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode } from './EnrollmentEditEventPage.const';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';

export const EnrollmentEditEventPage = () => {
    const { programId, stageId, teiId, enrollmentId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
            teiId: query.teiId,
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
    const mode = showEditEvent ? pageMode.EDIT : pageMode.VIEW;
    const outputEffects = useWidgetDataFromStore(`singleEvent-${mode}`);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);

    return (
        <EnrollmentEditEventPageComponent
            mode={mode}
            programStage={programStage}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            teiId={teiId}
            enrollmentId={enrollmentId}
            programId={programId}
        />
    );
};
