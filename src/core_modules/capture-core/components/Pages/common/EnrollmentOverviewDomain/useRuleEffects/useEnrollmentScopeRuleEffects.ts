import { useEffect, useRef } from 'react';
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
    force?: boolean;
};

export const useEnrollmentScopeRuleEffects = ({
    enrollmentId,
    orgUnit,
    program,
    apiEnrollment,
    apiAttributeValues,
    force = false,
}: Input) => {
    const dispatch = useDispatch();
    const hasWarmStoreOnMount = useSelector(({ enrollmentDomain }: any) =>
        enrollmentDomain?.enrollmentId === enrollmentId && enrollmentDomain?.ruleEffects != null);
    const skipOnce = useRef(!force && hasWarmStoreOnMount);
    const attributeValues = useAttributeValuesForRules(program, apiAttributeValues);
    const enrollmentData = useEnrollmentData(apiEnrollment);
    const otherEvents = useEventsData(apiEnrollment, program);

    useEffect(() => {
        if (enrollmentId && orgUnit && attributeValues && enrollmentData && otherEvents) {
            if (skipOnce.current) {
                skipOnce.current = false;
                return;
            }
            const effects = getApplicableRuleEffectsForTrackerProgram({
                program,
                orgUnit,
                otherEvents,
                attributeValues,
                enrollmentData,
            });
            dispatch(setEnrollmentRuleEffects(effects));
        }
    }, [dispatch, enrollmentId, attributeValues, enrollmentData, orgUnit, otherEvents, program]);
};
