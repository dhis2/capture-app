// @flow
import type {
    Enrollment,
    TEIValues,
    OutputEffects,
    OrgUnit,
    TrackedEntityAttributes,
    OptionSets,
    ProgramRulesContainer,
    EventsData,
    DataElements,
} from '../../../../rules/RuleEngine';
import { ruleEngine } from '../../../../rules/rulesEngine';
import {
    dataElementTypes,
    type RenderFoundation,
} from '../../../../metaData';
import {
    updateRulesEffects,
    postProcessRulesEffects,
    buildEffectsHierarchy,
    validateAssignEffects,
} from '../../../../rules';
import { convertServerToClient } from '../../../../converters';
import type { QuerySingleResource } from '../../../../utils/api';
import type { EnrollmentData } from '../Types';

const getEnrollmentForRulesExecution = (enrollment: ?EnrollmentData, programName: string): ?Enrollment =>
    enrollment && {
        enrollmentId: enrollment.enrollment,
        // $FlowFixMe
        enrolledAt: convertServerToClient(enrollment.enrolledAt, dataElementTypes.DATE),
        // $FlowFixMe
        occurredAt: convertServerToClient(enrollment.occurredAt, dataElementTypes.DATE),
        enrollmentStatus: enrollment.status,
        programName,
    };

const getDataElementsForRulesExecution = (dataElements: ?DataElements) =>
    dataElements &&
    Object.values(dataElements).reduce(
        (acc, dataElement: any) => ({
            ...acc,
            [dataElement.id]: {
                id: dataElement.id,
                valueType: dataElement.valueType,
                optionSetId: dataElement.optionSet && dataElement.optionSet.id,
            },
        }),
        {},
    );

export const getRulesActionsForTEI = ({
    foundation,
    formId,
    orgUnit,
    enrollmentData,
    teiValues,
    trackedEntityAttributes,
    optionSets,
    rulesContainer,
    otherEvents,
    dataElements,
    userRoles,
    programName,
}: {
    foundation: RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    enrollmentData?: EnrollmentData,
    teiValues?: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    optionSets: OptionSets,
    rulesContainer: ProgramRulesContainer,
    otherEvents?: ?EventsData,
    dataElements: ?DataElements,
    userRoles: Array<string>,
    programName: string,
}) => {
    const effects: OutputEffects = ruleEngine().getProgramRuleEffects({
        programRulesContainer: rulesContainer,
        currentEvent: null,
        otherEvents,
        dataElements: getDataElementsForRulesExecution(dataElements),
        trackedEntityAttributes,
        selectedEnrollment: getEnrollmentForRulesExecution(enrollmentData, programName),
        selectedEntity: teiValues,
        selectedOrgUnit: orgUnit,
        selectedUserRoles: userRoles,
        optionSets,
    });
    const effectsHierarchy = buildEffectsHierarchy(postProcessRulesEffects(effects, foundation));
    return updateRulesEffects(effectsHierarchy, formId);
};

export const getRulesActionsForTEIAsync = async ({
    foundation,
    formId,
    orgUnit,
    enrollmentData,
    teiValues,
    trackedEntityAttributes,
    optionSets,
    rulesContainer,
    otherEvents,
    dataElements,
    userRoles,
    programName,
    querySingleResource,
    onGetValidationContext,
}: {
    foundation: RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    enrollmentData?: EnrollmentData,
    teiValues?: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    optionSets: OptionSets,
    rulesContainer: ProgramRulesContainer,
    otherEvents?: ?EventsData,
    dataElements: ?DataElements,
    userRoles: Array<string>,
    programName: string,
    querySingleResource: QuerySingleResource,
    onGetValidationContext: () => Object,
}) => {
    const effects: OutputEffects = ruleEngine().getProgramRuleEffects({
        programRulesContainer: rulesContainer,
        currentEvent: null,
        otherEvents,
        dataElements: getDataElementsForRulesExecution(dataElements),
        trackedEntityAttributes,
        // $FlowFixMe (flow doesn't understand that selectedEnrollment.enrolledAt/occurredAt are strings)
        selectedEnrollment: getEnrollmentForRulesExecution(enrollmentData, programName),
        selectedEntity: teiValues,
        selectedOrgUnit: orgUnit,
        selectedUserRoles: userRoles,
        optionSets,
    });
    const effectsHierarchy = buildEffectsHierarchy(postProcessRulesEffects(effects, foundation));
    const effectsWithValidations = await validateAssignEffects({
        dataElements: foundation.getElements(),
        effects: effectsHierarchy,
        querySingleResource,
        onGetValidationContext,
    });
    return updateRulesEffects(effectsWithValidations, formId);
};
