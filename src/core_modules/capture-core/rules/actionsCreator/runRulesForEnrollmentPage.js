// @flow
import { RulesEngine } from '../engine';
import type { Program } from '../../metaData';
import type {
    EventsData,
    OrgUnit,
    DataElements,
    TEIValues,
    Enrollment,
    TrackedEntityAttributes,
} from '../engine';
import { constantsStore } from '../../metaDataMemoryStores/constants/constants.store';
import { optionSetStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';

type RuleEnrollmentData = {
    program: Program,
    orgUnit: OrgUnit,
    allEventsData: EventsData,
    dataElementsInProgram: DataElements,
    teiValues: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    enrollmentData: ?Enrollment,
}

export default function runRulesForEnrollmentPage(data: RuleEnrollmentData) {
    const {
        program,
        orgUnit,
        allEventsData,
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
        allEventsData,
        orgUnit,
        dataElementsInProgram,
        teiValues,
        trackedEntityAttributes,
        enrollmentData,
        // $FlowFixMe[prop-missing] automated comment
        optionSets,
    );
}
