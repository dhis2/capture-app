import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApplicableRuleEffectsForTrackerProgram } from '../../../../../rules';
import type { TrackerProgram } from '../../../../../metaData';
import { setEnrollmentRuleEffects } from '../enrollment.actions';
import { useAttributeValuesForRules, useEnrollmentData, useEventsData } from './rulesExecutionData';
import type { AttributeValue, EnrollmentData } from '../useCommonEnrollmentDomainData';

type Input = {
    enrollmentId?: string;
    orgUnit?: any;
    program: TrackerProgram;
    apiEnrollment?: EnrollmentData;
    apiAttributeValues?: Array<AttributeValue>;
};

export const useEnrollmentScopeRuleEffects = ({
    enrollmentId,
    orgUnit,
    program,
    apiEnrollment,
    apiAttributeValues,
}: Input) => {
    const dispatch = useDispatch();
    const domainAligned = useSelector(({ enrollmentDomain }: any) =>
        Boolean(enrollmentId) && enrollmentDomain?.enrollmentId === enrollmentId);
    const attributeValues = useAttributeValuesForRules(program, apiAttributeValues);
    const enrollmentData = useEnrollmentData(apiEnrollment);
    const otherEvents = useEventsData(apiEnrollment, program);

    useEffect(() => {
        if (!domainAligned || !orgUnit || !attributeValues || !enrollmentData || !otherEvents) return;
        const effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            orgUnit,
            otherEvents,
            attributeValues,
            enrollmentData,
        });
        dispatch(setEnrollmentRuleEffects(effects));
    }, [dispatch, domainAligned, attributeValues, enrollmentData, orgUnit, otherEvents, program]);
};
