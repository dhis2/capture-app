// @flow
import type {
    EventsDataContainer,
    OrgUnit,
    DataElements,
    TEIValues,
    Enrollment,
    TrackedEntityAttributes,
    OutputEffects,
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

export function runRulesForEnrollmentPage(data: RuleEnrollmentData): ?OutputEffects {
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
    const effects = rulesEngine.getProgramRuleEffects({
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

    return (effects.length > 0) ? effects : null;
}
