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
} from '@dhis2/rules-engine-javascript';
import { rulesEngine } from '../../../../rules/rulesEngine';
import type { RenderFoundation } from '../../../../metaData';
import {
    updateRulesEffects,
    postProcessRulesEffects,
    buildEffectsHierarchy,
    validateAssignEffects,
} from '../../../../rules';
import type { QuerySingleResource } from '../../../../utils/api';

const getEnrollmentForRulesExecution = enrollment =>
    enrollment && {
        // $FlowFixMe[prop-missing]
        enrollmentId: enrollment.enrollment,
        enrolledAt: enrollment.enrolledAt,
        occurredAt: enrollment.occurredAt,
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
}: {
    foundation: RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    enrollmentData?: ?Enrollment,
    teiValues?: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    optionSets: OptionSets,
    rulesContainer: ProgramRulesContainer,
    otherEvents?: ?EventsData,
    dataElements: ?DataElements,
    userRoles: Array<string>,
}) => {
    const effects: OutputEffects = rulesEngine.getProgramRuleEffects({
        programRulesContainer: rulesContainer,
        currentEvent: null,
        otherEvents,
        dataElements: getDataElementsForRulesExecution(dataElements),
        trackedEntityAttributes,
        selectedEnrollment: getEnrollmentForRulesExecution(enrollmentData),
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
    querySingleResource,
    onGetValidationContext,
}: {
    foundation: RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    enrollmentData?: ?Enrollment,
    teiValues?: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    optionSets: OptionSets,
    rulesContainer: ProgramRulesContainer,
    otherEvents?: ?EventsData,
    dataElements: ?DataElements,
    userRoles: Array<string>,
    querySingleResource: QuerySingleResource,
    onGetValidationContext: () => Object,
}) => {
    const effects: OutputEffects = rulesEngine.getProgramRuleEffects({
        programRulesContainer: rulesContainer,
        currentEvent: null,
        otherEvents,
        dataElements: getDataElementsForRulesExecution(dataElements),
        trackedEntityAttributes,
        selectedEnrollment: getEnrollmentForRulesExecution(enrollmentData),
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
