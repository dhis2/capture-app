// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';

export const EnrollmentAddEventPage = () => {
    const { programId, stageId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
        }),
        shallowEqual,
    );
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);
    if (!programStage) {
        return <span> {i18n.t('We could not find the stage in the program')}</span>;
    }
    return (
        <EnrollmentAddEventPageComponent icon={programStage.icon} name={programStage.stageForm.name} />
    );
};
