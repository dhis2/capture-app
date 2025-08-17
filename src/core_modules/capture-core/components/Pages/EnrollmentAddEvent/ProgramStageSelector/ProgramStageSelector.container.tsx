import React, { useEffect, useMemo, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { ProgramStageSelectorComponent } from './ProgramStageSelector.component';
import { Widget } from '../../../Widget';
import { errorCreator } from '../../../../../capture-core-utils';
import { useCommonEnrollmentDomainData, useRuleEffects } from '../../common/EnrollmentOverviewDomain';
import type { Props } from './ProgramStageSelector.types';
import { useProgramFromIndexedDB } from '../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useNavigate, useLocationQuery, buildUrlQueryString } from '../../../../utils/routing';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';


export const ProgramStageSelector = ({ programId, orgUnitId, teiId, enrollmentId }: Props) => {
    const { navigate } = useNavigate();
    const { tab } = useLocationQuery();
    const { error: enrollmentsError, enrollment, attributeValues } = useCommonEnrollmentDomainData(
        teiId,
        enrollmentId,
        programId,
    );
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

    const programStages = useMemo(() => !programLoading && program?.programStages?.reduce((accStage: any, currentStage: any) => {
        accStage.push({
            id: currentStage.id,
            dataAccess: currentStage.access.data,
            eventCount: (enrollment?.events
                ?.filter((event: any) => event.programStage === currentStage.id)
                ?.length
            ),
            displayName: currentStage.displayName,
            style: currentStage.style,
            repeatable: currentStage.repeatable,
            hiddenProgramStage: ruleEffects?.find(
                (ruleEffect: any) => ruleEffect.type === 'HIDEPROGRAMSTAGE' && ruleEffect.id === currentStage.id,
            ),
        });
        return accStage;
    }, []), [enrollment?.events, program?.programStages, programLoading, ruleEffects]);

    const onSelectProgramStage = useCallback((newStageId: string) =>
        navigate(`enrollmentEventNew?${buildUrlQueryString({
            programId,
            orgUnitId,
            teiId,
            enrollmentId,
            stageId: newStageId,
            tab,
        })}`), [navigate, programId, orgUnitId, teiId, enrollmentId, tab]);

    const onCancel = useCallback(() =>
        navigate(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`),
    [navigate, programId, orgUnitId, teiId, enrollmentId]);

    const availableStages = useMemo(() => {
        if (!Array.isArray(programStages) || !programStages.length) {
            return [];
        }
        return programStages.filter((stage) => {
            const isStageDisabled = !stage.dataAccess.write ||
                (!stage.repeatable && stage.eventCount > 0) ||
                stage.hiddenProgramStage;
            return !isStageDisabled;
        });
    }, [programStages]);

    useEffect(() => {
        if (programStages && !availableStages.length) {
            onCancel();
        }
        if (availableStages.length === 1) {
            onSelectProgramStage(availableStages[0].id);
        }
    }, [availableStages, onSelectProgramStage, onCancel, programStages]);

    return (
        <>
            {program ?
                <Widget
                    header={i18n.t('Choose a stage for a new event')}
                    noncollapsible
                    data-test="enrollment-newEvent-page"
                >
                    <ProgramStageSelectorComponent
                        programStages={availableStages}
                        onSelectProgramStage={onSelectProgramStage}
                        onCancel={onCancel}
                    />
                </Widget>
                : i18n.t('Program Stages could not be loaded')}
        </>
    );
};
