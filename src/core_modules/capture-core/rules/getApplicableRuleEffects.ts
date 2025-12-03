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

export const getApplicableRuleEffectsForEventProgram = async ({
    program,
    orgUnit,
    currentEvent,
    executionEnvironment,
}: GetApplicableRuleEffectsForEventProgramInput) => {
    const { programRules, programRuleVariables } = program;
    if (!programRules.length) {
        return [];
    }

    if (currentEvent) {
        currentEvent.programStageName = program.stage.untranslatedName;
    }

    return buildEffectsHierarchy(
        await getApplicableRuleEffects({
            orgUnit,
            currentEvent,
            programRules,
            programRuleVariables,
            stages: program.stages,
            foundationForPostProcessing: program.stage.stageForm,
            executionEnvironment,
        }),
    );
};
export const getApplicableRuleEffectsForTrackerProgram = async ({
    program,
    stage,
    orgUnit,
    currentEvent,
    otherEvents,
    attributeValues,
    enrollmentData,
    formFoundation,
    executionEnvironment,
}: GetApplicableRuleEffectsForTrackerProgramInput,
flattenedResult = false,
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
        currentEvent.programStageName = program.stages.get(currentEvent.programStageId as string)?.untranslatedName;
    }

    const effects = await getApplicableRuleEffects({
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
        executionEnvironment,
    });

    return flattenedResult ? effects : buildEffectsHierarchy(effects);
};

const getApplicableRuleEffects = async ({
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
    executionEnvironment,
}: GetApplicableRuleEffectsInput) => {
    const dataElements = getDataElementsForRulesExecution(stages);

    const constants = constantsStore.get();
    const optionSets = convertOptionSetsToRulesEngineFormat(optionSetStore.get());

    const effects: OutputEffects = await ruleEngine.getProgramRuleEffects({
        programRulesContainer: { programRuleVariables, programRules, constants },
        currentEvent,
        otherEvents,
        dataElements,
        trackedEntityAttributes,
        selectedEnrollment: enrollmentData,
        selectedEntity: attributeValues,
        selectedOrgUnit: orgUnit || null,
        optionSets,
        executionEnvironment,
    });

    return postProcessRulesEffects(
        effects,
        foundationForPostProcessing,
    );
};
