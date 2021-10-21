// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router-dom';
import log from 'loglevel';
import { ProgramStageSelectorComponent } from './ProgramStageSelector.component';
import { Widget } from '../../../Widget';
import { urlArguments } from '../../../../utils/url';
import { errorCreator } from '../../../../../capture-core-utils';
import { useCommonEnrollmentDomainData } from '../../common/EnrollmentOverviewDomain';
import type { Props } from './ProgramStageSelector.types';
import { useProgramFromIndexedDB } from '../../../../utils/cachedData/useProgramFromIndexedDB';
import { useLocationQuery } from '../../../../utils/routing';


export const ProgramStageSelector = ({ programId, orgUnitId, teiId, enrollmentId }: Props) => {
    const history = useHistory();
    const { tab } = useLocationQuery();
    const { error: enrollmentsError, enrollment } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const {
        loading: programLoading,
        error: programError,
        program,
    } = useProgramFromIndexedDB(programId);


    if (enrollmentsError || programError) {
        log.error(errorCreator('Enrollment page could not be loaded')({
            enrollmentsError,
            programError,
        }));
    }

    const programStages = useMemo(() => !programLoading && program?.programStages?.reduce((accStage, currentStage) => {
        accStage.push({
            id: currentStage.id,
            eventCount: (enrollment?.events
                ?.filter(event => event.programStage === currentStage.id)
                ?.length
            ),
            displayName: currentStage.displayName,
            style: currentStage.style,
            repeatable: currentStage.repeatable,
        });
        return accStage;
    }, []), [enrollment?.events, program?.programStages, programLoading]);

    const onSelectProgramStage = (newStageId) => {
        history.push(`enrollmentEventNew?${urlArguments({ programId, orgUnitId, teiId, enrollmentId, stageId: newStageId, tab })}`);
    };

    const onCancel = () => history.push(`enrollment?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`);
    return (
        <>
            {program ?
                <Widget
                    header={i18n.t('Choose a stage for a new event')}
                    noncollapsible
                >
                    <ProgramStageSelectorComponent
                        programStages={programStages || []}
                        onSelectProgramStage={onSelectProgramStage}
                        onCancel={onCancel}
                    />
                </Widget>
                : i18n.t('Program Stages could not be loaded')}
        </>
    );
};
