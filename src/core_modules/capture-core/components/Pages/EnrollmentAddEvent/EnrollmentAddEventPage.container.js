// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';

export const EnrollmentAddEventPage = () => {
    const { programId, stageId, orgUnitId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
            orgUnitId: query.orgUnitId,
        }),
        shallowEqual,
    );
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);
    if (!programStage) {
        return <span>[program stage placeholder]</span>;
    }
    return <EnrollmentAddEventPageComponent programStage={programStage} programId={programId} orgUnitId={orgUnitId} />;
};
