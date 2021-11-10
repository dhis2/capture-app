// @flow
import type {
    EventData,
    EventsData,
    OrgUnit,
    TEIValues,
    Enrollment,
    OutputEffects,
} from 'capture-core-utils/rulesEngine';
import { rulesEngine } from '../rulesEngine';
import type { DataElement, RenderFoundation, TrackerProgram } from '../../metaData';
import { constantsStore } from '../../metaDataMemoryStores/constants/constants.store';
import { optionSetStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';
import { convertOptionSetsToRulesEngineFormat } from '../converters/optionSetsConverter';

type RuleEnrollmentData = {|
    program: TrackerProgram,
    foundation: RenderFoundation,
    orgUnit: OrgUnit,
    currentEvent: EventData,
    eventsData: EventsData,
    attributeValues: TEIValues,
    enrollmentData: Enrollment,
|};

const getDataElementsForRulesExecution = (dataElements: Array<DataElement>) =>
    dataElements.reduce((accRulesDataElements, dataElement) => {
        accRulesDataElements[dataElement.id] = {
            id: dataElement.id,
            valueType: dataElement.type,
            optionSetId: dataElement.optionSet && dataElement.optionSet.id,
        };
        return accRulesDataElements;
    }, {});

const getTrackedEntityAttributesForRulesExecution = (attributes: Array<DataElement>) =>
    attributes.reduce((accRulesAttributes, attribute) => {
        accRulesAttributes[attribute.id] = {
            id: attribute.id,
            valueType: attribute.type,
            optionSetId: attribute.optionSet && attribute.optionSet.id,
        };
        return accRulesAttributes;
    }, {});


const createEventsContainer = (eventsData: EventsData) => {
    const eventsDataByStage = eventsData.reduce((accEventsByStage, event) => {
        accEventsByStage[event.programStageId] = accEventsByStage[event.programStageId] || [];
        accEventsByStage[event.programStageId].push(event);
        return accEventsByStage;
    }, {});

    return { all: eventsData, byStage: eventsDataByStage };
};

export const runRulesForEnrollmentEvent = ({
    program,
    foundation,
    orgUnit,
    currentEvent,
    eventsData,
    attributeValues,
    enrollmentData,
}: RuleEnrollmentData) => {
    const {
        programRuleVariables: programRulesVariables,
        programRules,
    } = program;

    if (!programRules || !programRules.length) {
        return null;
    }

    const constants = constantsStore.get();
    const optionSets = convertOptionSetsToRulesEngineFormat(optionSetStore.get());
    const dataElements = getDataElementsForRulesExecution(foundation.getElements());
    const trackedEntityAttributes = getTrackedEntityAttributesForRulesExecution(program.attributes);
    const eventsContainer = createEventsContainer(eventsData);


    // returns an array of effects that need to take place in the UI.
    const effects: OutputEffects = rulesEngine.getProgramRuleEffects({
        programRulesContainer: { programRulesVariables, programRules, constants },
        currentEvent,
        eventsContainer,
        dataElements,
        trackedEntityAttributes,
        selectedEnrollment: enrollmentData,
        selectedEntity: attributeValues,
        selectedOrgUnit: orgUnit,
        optionSets,
    });

    return (effects.length > 0) ? effects : null;
};
