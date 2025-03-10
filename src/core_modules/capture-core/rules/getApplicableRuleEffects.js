// @flow
import type { OutputEffects } from '@dhis2/rules-engine-javascript';
import { ruleEngine } from './rulesEngine';
import { constantsStore } from '../metaDataMemoryStores/constants/constants.store';
import { optionSetStore } from '../metaDataMemoryStores/optionSets/optionSets.store';
import { convertOptionSetsToRulesEngineFormat } from './converters/optionSetsConverter';
import { postProcessRulesEffects } from './postProcessRulesEffects';
import { buildEffectsHierarchy } from './buildEffectsHierarchy';
import { getDataElementsForRulesExecution } from './getDataElementsForRulesExecution';
import { getTrackedEntityAttributesForRulesExecution } from './getTrackedEntityAttributesForRulesExecution';
import type {
    GetApplicableRuleEffectsForTrackerProgramInput,
    GetApplicableRuleEffectsForEventProgramInput,
    GetApplicableRuleEffectsInput,
} from './rules.types';

const getRulesMetadata = (programRuleVariables, programRules, programStageRules) => ({
    programRuleVariables,
    programRules: [...programRules, ...programStageRules || []],
});

export const getApplicableRuleEffectsForEventProgram = ({
    program,
    orgUnit,
    currentEvent,
}: GetApplicableRuleEffectsForEventProgramInput) => {
    const { programRules, programRuleVariables } = program;
    if (!programRules.length) {
        return [];
    }

    if (currentEvent) {
        currentEvent.programStageName = program.stage.untranslatedName;
    }

    return buildEffectsHierarchy(
        getApplicableRuleEffects({
            orgUnit,
            currentEvent,
            programRules,
            programRuleVariables,
            stages: program.stages,
            foundationForPostProcessing: program.stage.stageForm,
        }),
    );
};
export const getApplicableRuleEffectsForTrackerProgram = ({
    program,
    stage,
    orgUnit,
    currentEvent,
    otherEvents,
    attributeValues,
    enrollmentData,
    formFoundation,
}: GetApplicableRuleEffectsForTrackerProgramInput,
flattenedResult: boolean = false,
) => {
    const { programRules, programRuleVariables } = getRulesMetadata(
        program.programRuleVariables,
        program.programRules,
        stage?.programRules,
    );
    const foundationForPostProcessing = formFoundation || (stage ? stage.stageForm : program.enrollment.enrollmentForm);
    if (!programRules.length) {
        return [];
    }

    if (currentEvent) {
        if (!currentEvent.programStageId && stage) {
            currentEvent.programStageId = stage.id;
        }
        currentEvent.programStageName = program.stages.get(currentEvent.programStageId)?.untranslatedName;
    }

    const effects = getApplicableRuleEffects({
        orgUnit,
        currentEvent,
        otherEvents,
        attributeValues,
        enrollmentData,
        stages: program.stages,
        programRules,
        programRuleVariables,
        trackedEntityAttributes: getTrackedEntityAttributesForRulesExecution(program.attributes),
        foundationForPostProcessing,
    });

    return flattenedResult ? effects : buildEffectsHierarchy(effects);
};

const getApplicableRuleEffects = ({
    orgUnit,
    currentEvent,
    otherEvents,
    attributeValues,
    enrollmentData,
    stages,
    programRules,
    programRuleVariables,
    trackedEntityAttributes,
    foundationForPostProcessing,
}: GetApplicableRuleEffectsInput) => {
    const dataElements = getDataElementsForRulesExecution(stages);

    const constants = constantsStore.get();
    const optionSets = convertOptionSetsToRulesEngineFormat(optionSetStore.get());

    const effects: OutputEffects = ruleEngine().getProgramRuleEffects({
        programRulesContainer: { programRuleVariables, programRules, constants },
        currentEvent,
        otherEvents,
        dataElements,
        trackedEntityAttributes,
        selectedEnrollment: enrollmentData,
        selectedEntity: attributeValues,
        selectedOrgUnit: orgUnit,
        optionSets,
    });

    return postProcessRulesEffects(
        effects,
        foundationForPostProcessing,
    );
};
