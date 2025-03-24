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
import type { OutputEffect } from '@dhis2/rules-engine-javascript';

type RulesMetadata = {
    programRuleVariables: any[];
    programRules: any[];
};

// Import the EffectsHierarchy type from buildEffectsHierarchy
type EffectsHierarchy = ReturnType<typeof buildEffectsHierarchy>;

const getRulesMetadata = (
    programRuleVariables: any[], 
    programRules: any[], 
    programStageRules?: any[]
): RulesMetadata => ({
    programRuleVariables,
    programRules: [...programRules, ...(programStageRules || [])],
});

export const getApplicableRuleEffectsForEventProgram = ({
    program,
    orgUnit,
    currentEvent,
}: GetApplicableRuleEffectsForEventProgramInput): EffectsHierarchy => {
    const { programRules, programRuleVariables } = program;
    if (!programRules.length) {
        return {};
    }

    if (currentEvent) {
        currentEvent.programStageName = program.stage.untranslatedName;
    }

    const effects = getApplicableRuleEffects({
        orgUnit,
        currentEvent,
        programRules: programRules as any,
        programRuleVariables: programRuleVariables as any,
        stages: program.stages,
        foundationForPostProcessing: program.stage.stageForm,
    });
    
    return buildEffectsHierarchy(effects || []);
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
): EffectsHierarchy | Array<OutputEffect> => {
    const { programRules, programRuleVariables } = getRulesMetadata(
        program.programRuleVariables,
        program.programRules,
        stage?.programRules,
    );
    const foundationForPostProcessing = formFoundation || (stage ? stage.stageForm : program.enrollment.enrollmentForm);
    if (!programRules.length) {
        return flattenedResult ? [] : {};
    }

    if (currentEvent) {
        if (!currentEvent.programStageId && stage) {
            currentEvent.programStageId = stage.id;
        }
        currentEvent.programStageName = program.stages.get(currentEvent.programStageId)?.untranslatedName;
    }

    const trackedEntityAttributes = getTrackedEntityAttributesForRulesExecution(program.attributes);
    
    const effects = getApplicableRuleEffects({
        orgUnit,
        currentEvent,
        otherEvents,
        attributeValues,
        enrollmentData,
        stages: program.stages,
        programRules: programRules as any,
        programRuleVariables: programRuleVariables as any,
        trackedEntityAttributes: trackedEntityAttributes as any,
        foundationForPostProcessing,
    });

    return flattenedResult ? (effects || []) : buildEffectsHierarchy(effects || []);
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
}: GetApplicableRuleEffectsInput): Array<OutputEffect> => {
    const dataElements = getDataElementsForRulesExecution(stages);

    const constants = constantsStore.get();
    const optionSets = convertOptionSetsToRulesEngineFormat(optionSetStore.get());

    try {
        const effects: OutputEffects = ruleEngine().getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            otherEvents,
            dataElements,
            trackedEntityAttributes: trackedEntityAttributes as any,
            selectedEnrollment: enrollmentData,
            selectedEntity: attributeValues,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        return postProcessRulesEffects(
            effects,
            foundationForPostProcessing,
        ) || [];
    } catch (error) {
        console.error('Error getting rule effects:', error);
        return [];
    }
};
