// @flow
import { RulesEngine } from 'capture-core-utils/rulesEngine';
import type { Program } from '../../metaData';
import type {
    EventsDataContainer,
    OrgUnit,
    DataElements,
    TEIValues,
    Enrollment,
    TrackedEntityAttributes,
} from 'capture-core-utils/rulesEngine';
import { constantsStore } from '../../metaDataMemoryStores/constants/constants.store';
import { optionSetStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';

type RuleEnrollmentData = {
    program: Program,
    orgUnit: OrgUnit,
    eventsData: EventsDataContainer,
    dataElementsInProgram: DataElements,
    teiValues: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    enrollmentData: ?Enrollment,
}

export default function runRulesForEnrollmentPage(data: RuleEnrollmentData) {
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
    const optionSets = optionSetStore.get();

    // returns an array of effects that need to take place in the UI.
    return RulesEngine.programRuleEffectsForEnrollment(
        { programRulesVariables, programRules, constants },
        eventsData,
        orgUnit,
        dataElementsInProgram,
        teiValues,
        trackedEntityAttributes,
        enrollmentData,
        // $FlowFixMe[prop-missing] automated comment
        optionSets,
    );
}
