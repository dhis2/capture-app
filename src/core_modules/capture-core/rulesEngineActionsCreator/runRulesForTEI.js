// @flow
import log from 'loglevel';
import { errorCreator } from '../../capture-core-utils';
import { RulesEngine, processTypes } from '../../capture-core-utils/RulesEngine';
import { TrackerProgram, DataElement, RenderFoundation } from '../metaData';
import constantsStore from '../metaDataMemoryStores/constants/constants.store';
import optionSetsStore from '../metaDataMemoryStores/optionSets/optionSets.store';

import type {
    ProgramRulesContainer,
    TrackedEntityAttribute as TrackedEntityAttributeForRulesEngine,
    Enrollment,
    TEIValues,
} from '../../capture-core-utils/RulesEngine/rulesEngine.types';

const errorMessages = {
    PROGRAM_MISSING_OR_INVALID: 'Program is missing or is invalid',
    FOUNDATION_MISSING: 'Foundation missing',
};

function getProgramRulesContainer(program: TrackerProgram): ProgramRulesContainer {
    const programRulesVariables =
        program
            .programRuleVariables
            .filter(variable => variable.programRuleVariableSourceType === 'TEI_ATTRIBUTE');

    const programRules = program.programRules;

    const constants = constantsStore.get();
    return {
        programRulesVariables,
        programRules,
        constants,
    };
}

function getRulesEngineTrackedEntityAttributesAsObject(
    trackedEntityAttributes: Array<DataElement>): { [elementId: string]: TrackedEntityAttributeForRulesEngine } {
    return trackedEntityAttributes.reduce((accTeas, dataElement) => {
        accTeas[dataElement.id] = {
            id: dataElement.id,
            valueType: dataElement.type,
            optionSetId: dataElement.optionSet && dataElement.optionSet.id,
        };
        return accTeas;
    }, {});
}

function getTrackedEntityAttributes(
    program: TrackerProgram,
): { [elementId: string]: TrackedEntityAttributeForRulesEngine } {
    const enrollmentForm = program.enrollment.enrollmentForm;
    const teaAsArray = enrollmentForm ?
        Array.from(enrollmentForm.sections.values()).reduce((accElements, section) =>
            [...accElements, ...Array.from(section.elements.values())], []) :
        [];

    return getRulesEngineTrackedEntityAttributesAsObject(teaAsArray);
}

function getPrerequisitesError(
    foundation: ?RenderFoundation,
    program: ?TrackerProgram,
): ?string {
    if (!foundation) {
        return errorMessages.FOUNDATION_MISSING;
    }

    if (!program || !(program instanceof TrackerProgram)) {
        return errorMessages.PROGRAM_MISSING_OR_INVALID;
    }

    return null;
}

function prepare(
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,

) {
    const prerequisitesError = getPrerequisitesError(foundation, program);
    if (prerequisitesError) {
        log.error(
            errorCreator(
                prerequisitesError)(
                { program, method: 'getRulesActionsForTEI' }));
        return null;
    }

    if (program) {
        const { programRulesVariables, programRules, constants } = getProgramRulesContainer(program);
        if (!programRules || programRules.length === 0) {
            return null;
        }

        const trackedEntityAttributes = getTrackedEntityAttributes(program);
        const optionSets = optionSetsStore.get();


        return { optionSets, trackedEntityAttributes, programRulesVariables, programRules, constants };
    }
    return null;
}

export default function runRulesForTEI(
    rulesEngine: RulesEngine,
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    orgUnit: Object,
    enrollmentData: ?Enrollment,
    teiValues: ?TEIValues,

) {
    const data = prepare(program, foundation);

    if (data) {
        const {
            optionSets,
            programRulesVariables,
            programRules,
            constants,
            trackedEntityAttributes,
        } = data;

        // returns an array of effects that need to take place in the UI.
        return rulesEngine.executeRules(
            { programRulesVariables, programRules, constants },
            {},
            null,
            null,
            enrollmentData,
            teiValues,
            trackedEntityAttributes,
            orgUnit,
            optionSets,
            processTypes.TEI,
        );
    }
    return null;
}
