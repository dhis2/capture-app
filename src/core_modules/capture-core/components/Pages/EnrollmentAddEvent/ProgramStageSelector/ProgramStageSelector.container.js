// @flow
import React, { useEffect, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router-dom';
import log from 'loglevel';
import { ProgramStageSelectorComponent } from './ProgramStageSelector.component';
import { Widget } from '../../../Widget';
import { errorCreator } from '../../../../../capture-core-utils';
import { useCommonEnrollmentDomainData, useRuleEffects } from '../../common/EnrollmentOverviewDomain';
import type { Props } from './ProgramStageSelector.types';
import { useProgramFromIndexedDB } from '../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useLocationQuery, buildUrlQueryString } from '../../../../utils/routing';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';


export const ProgramStageSelector = ({ programId, orgUnitId, teiId, enrollmentId }: Props) => {
    const history = useHistory();
    const { tab } = useLocationQuery();
    const { error: enrollmentsError, enrollment, attributeValues } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const {
        program,
        isLoading: programLoading,
        isError: programError,
    } = useProgramFromIndexedDB(programId);

    const { orgUnit } = useCoreOrgUnit(orgUnitId);
    const programRules = useTrackerProgram(programId);

    const ruleEffects = useRuleEffects({
        orgUnit,
        program: programRules,
        apiEnrollment: enrollment,
        apiAttributeValues: attributeValues,
    });

    useEffect(() => {
        if (enrollmentsError || programError) {
            log.error(errorCreator('Enrollment page could not be loaded')({
                enrollmentsError,
                programError,
            }));
        }
    }, [enrollmentsError, programError]);

    const programStages = useMemo(() => !programLoading && program?.programStages?.reduce((accStage, currentStage) => {
        accStage.push({
            id: currentStage.id,
            dataAccess: currentStage.access.data,
            eventCount: (enrollment?.events
                ?.filter(event => event.programStage === currentStage.id)
                ?.length
            ),
            displayName: currentStage.displayName,
            style: currentStage.style,
            repeatable: currentStage.repeatable,
            hiddenProgramStage: ruleEffects?.find(
                ruleEffect => ruleEffect.type === 'HIDEPROGRAMSTAGE' && ruleEffect.id === currentStage.id,
            ),
        });
        return accStage;
    }, []), [enrollment?.events, program?.programStages, programLoading, ruleEffects]);

    const onSelectProgramStage = (newStageId: string) =>
        history.push(`enrollmentEventNew?${buildUrlQueryString({
            programId,
            orgUnitId,
            teiId,
            enrollmentId,
            stageId: newStageId,
            tab,
        })}`);

    const onCancel = () =>
        history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);

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
