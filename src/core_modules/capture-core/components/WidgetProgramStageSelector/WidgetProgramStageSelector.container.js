// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router';
import log from 'loglevel';
import { WidgetProgramStageSelectorComponent } from './WidgetProgramStageSelector.component';
import { Widget } from '../Widget';
import { urlArguments } from '../../utils/url';
import { useProgramMetadata, useProgramStages } from '../Pages/Enrollment/EnrollmentPageDefault/hooks';
import { errorCreator } from '../../../capture-core-utils';
import { useProgramInfo } from '../../hooks/useProgramInfo';
import { useCommonEnrollmentDomainData } from '../Pages/common/EnrollmentOverviewDomain';
import type { Props } from './WidgetProgramStageSelector.types';

export const WidgetProgramStageSelector = ({ programId, orgUnitId, teiId, enrollmentId }: Props) => {
    const history = useHistory();
    const { program } = useProgramInfo(programId);
    const { error: programMetaDataError, programMetadata } = useProgramMetadata(programId);
    const { error: enrollmentsError, enrollment } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const stages = useProgramStages(program, programMetadata.programStages);

    if (programMetaDataError || enrollmentsError) {
        log.error(errorCreator('Enrollment page could not be loaded')({
            programMetaDataError,
            enrollmentsError,
        }));
    }

    const programStages = useMemo(() => stages.map((stage) => {
        stage.eventCount = (enrollment?.events
            ?.filter(event => event.programStage === stage.id)
            ?.length
        );
        return stage;
    }), [enrollment?.events, stages]);

    const onSelectProgramStage = (newStageId) => {
        history.push(`enrollmentEventNew?${urlArguments({ programId, orgUnitId, teiId, enrollmentId, stageId: newStageId })}`);
    };

    const onCancel = () => history.push(`enrollment?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`);
    return (
        <>
            <Widget
                header={i18n.t('Choose a stage for a new event')}
                noncollapsible
            >
                <WidgetProgramStageSelectorComponent
                    programStages={programStages}
                    onSelectProgramStage={onSelectProgramStage}
                    onCancel={onCancel}
                />
            </Widget>
        </>
    );
};
