import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApplicableRuleEffectsForTrackerProgram, updateRulesEffects } from '../../../../../rules';
import type { TrackerProgram } from '../../../../../metaData';
import { getEnrollmentScopeFormId } from './getEnrollmentScopeFormId';
import { useAttributeValuesForRules, useEnrollmentData, useEventsData } from './rulesExecutionData';
import type { AttributeValue, EnrollmentData } from '../useCommonEnrollmentDomainData';

type Input = {
    enrollmentId?: string;
    orgUnit?: any;
    program?: TrackerProgram;
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
    const formId = enrollmentId ? getEnrollmentScopeFormId(enrollmentId) : undefined;

    const hasWarmStoreOnMount = useSelector(({ rulesEffectsHiddenFields }: any) =>
        (formId ? rulesEffectsHiddenFields?.[formId] !== undefined : false));
    const skipOnce = useRef(!force && hasWarmStoreOnMount);

    const attributeValues = useAttributeValuesForRules(
        program as TrackerProgram,
        apiAttributeValues,
    );
    const enrollmentData = useEnrollmentData(apiEnrollment);
    const otherEvents = useEventsData(apiEnrollment, program as TrackerProgram);

    useEffect(() => {
        if (!formId || !program) return;
        if (!(orgUnit && attributeValues && enrollmentData && otherEvents)) return;
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
        dispatch(updateRulesEffects(effects, formId));
    }, [
        dispatch,
        formId,
        program,
        orgUnit,
        attributeValues,
        enrollmentData,
        otherEvents,
    ]);
};
