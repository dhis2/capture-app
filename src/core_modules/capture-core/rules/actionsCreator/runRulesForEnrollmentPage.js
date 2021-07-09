// @flow
import type {
    EventsDataContainer,
    OrgUnit,
    DataElements,
    TEIValues,
    Enrollment,
    TrackedEntityAttributes,
} from 'capture-core-utils/rulesEngine';
import { rulesEngine } from '../rulesEngine';
import type { Program } from '../../metaData';
import { constantsStore } from '../../metaDataMemoryStores/constants/constants.store';
import { optionSetStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';
import { convertOptionSetsToRulesEngineFormat } from '../converters/optionSetsConverter';

type RuleEnrollmentData = {
    program: Program,
    orgUnit: OrgUnit,
    eventsData: EventsDataContainer,
    dataElementsInProgram: DataElements,
    teiValues: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    enrollmentData: ?Enrollment,
}

export function runRulesForEnrollmentPage(data: RuleEnrollmentData) {
    const {
        program,
        orgUnit,
        eventsData,
        dataElementsInProgram,
        teiValues,
        trackedEntityAttributes,
        enrollmentData,
    } = data;
    const { programRuleVariables: programRulesVariables } = program;
    const programRules = [...program.programRules];

    const constants = constantsStore.get();
    const optionSets = convertOptionSetsToRulesEngineFormat(optionSetStore.get());

    // returns an array of effects that need to take place in the UI.
    return rulesEngine.getProgramRuleEffects({
        programRulesContainer: { programRulesVariables, programRules, constants },
        currentEvent: null,
        eventsContainer: eventsData,
        dataElements: dataElementsInProgram,
        selectedEntity: teiValues,
        trackedEntityAttributes,
        selectedEnrollment: enrollmentData,
        selectedOrgUnit: orgUnit,
        optionSets,
    });
}
