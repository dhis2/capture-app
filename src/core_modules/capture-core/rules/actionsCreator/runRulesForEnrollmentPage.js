// @flow
import { RulesEngine } from '../engine';
import type { Program } from '../../metaData';
import type {
    EventsData,
    EventData,
    OrgUnit,
    DataElement,
} from '../engine';
import constantsStore from '../../metaDataMemoryStores/constants/constants.store';
import optionSetsStore from '../../metaDataMemoryStores/optionSets/optionSets.store';


export default function runRulesForEnrollmentPage(
    program: Program,
    orgUnit: OrgUnit,
    currentEvent: EventData,
    allEventsData: EventsData,
    dataElementsInProgram: { [string]: DataElement },
) {
    const { programRuleVariables: programRulesVariables } = program;
    const programRules = [...program.programRules];

    const constants = constantsStore.get();
    const optionSets = optionSetsStore.get();

    // returns an array of effects that need to take place in the UI.
    return RulesEngine.programRuleEffectsForEvent(
        { programRulesVariables, programRules, constants },
        { currentEvent, allEventsData },
        dataElementsInProgram,
        orgUnit,
        // $FlowFixMe[prop-missing] automated comment
        optionSets,
    );
}
