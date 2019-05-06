// @flow
/* eslint-disable complexity */
import log from 'loglevel';
import OptionSetHelper from '../OptionSetHelper/OptionSetHelper';
import typeKeys from '../typeKeys.const';
import variablePrefixes from '../variablePrefixes';

import type {
    ProgramRulesContainer,
    ProgramRuleVariable,
    EventData,
    EventsDataContainer,
    OptionSets,
    DataElement,
    DataElements,
    TrackedEntityAttribute,
    TrackedEntityAttributes,
    Entity,
    Enrollment,
    Constants,
    OrgUnit,
    DateUtils,
} from '../rulesEngine.types';

type SourceData = {
    executingEvent: ?EventData,
    eventsContainer: ?EventsDataContainer,
    dataElements: ?DataElements,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    selectedEntity: ?Entity,
    selectedEnrollment: ?Enrollment,
    optionSets: OptionSets,
    selectedOrgUnit: OrgUnit,
};

type Variable = {
    variableValue: any,
    useCodeForOptionSet: boolean,
    variableType: string,
    hasValue: boolean,
    variableEventDate: ?string,
    variablePrefix: string,
    allValues: ?Array<any>,
};

const variableSourceTypesDataElementSpecific = {
    DATAELEMENT_CURRENT_EVENT: 'DATAELEMENT_CURRENT_EVENT',
    DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE: 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE',
    DATAELEMENT_NEWEST_EVENT_PROGRAM: 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
    DATAELEMENT_PREVIOUS_EVENT: 'DATAELEMENT_PREVIOUS_EVENT',
};

const variableSourceTypesTrackedEntitySpecific = {
    TEI_ATTRIBUTE: 'TEI_ATTRIBUTE',
};

const variableSourceTypes = {
    ...variableSourceTypesDataElementSpecific,
    ...variableSourceTypesTrackedEntitySpecific,
    CALCULATED_VALUE: 'CALCULATED_VALUE',
};

const EMPTY_STRING = '';

export default class VariableService {
    static getDataElementValueForVariable(value: any, dataElementId: string, useNameForOptionSet: ?boolean, dataElements: ?DataElements, optionSets: OptionSets) {
        const hasValue = !!value || value === 0 || value === false;
        return (hasValue && useNameForOptionSet && dataElements && dataElements[dataElementId] && dataElements[dataElementId].optionSetId) ?
            OptionSetHelper.getName(optionSets[dataElements[dataElementId].optionSetId].options, value) :
            value;
    }

    static getTrackedEntityValueForVariable(value: any, trackedEntityAttributeId: string, useNameForOptionSet: ?boolean, trackedEntityAttributes: ?TrackedEntityAttributes, optionSets: OptionSets) {
        const hasValue = !!value || value === 0 || value === false;
        return hasValue && useNameForOptionSet && trackedEntityAttributes && trackedEntityAttributes[trackedEntityAttributeId] && trackedEntityAttributes[trackedEntityAttributeId].optionSetId ?
            OptionSetHelper.getName(optionSets[trackedEntityAttributes[trackedEntityAttributeId].optionSetId].options, value)
            : value;
    }

    /*
    static getDataElementValueOrCode(useCodeForOptionSet, event, dataElementId, allDes, optionSets) {
        return VariableService.getDataElementValueOrCodeForValue(useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
    }
    */

    onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any;
    dateUtils: DateUtils;
    mapSourceTypeToGetterFn: { [sourceType: string]: (programVariable: ProgramRuleVariable, sourceData: SourceData) => ?Variable };
    constructor(onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any, dateUtils: DateUtils) {
        this.onProcessValue = onProcessValue;
        this.dateUtils = dateUtils;

        this.mapSourceTypeToGetterFn = {
            [variableSourceTypes.DATAELEMENT_CURRENT_EVENT]: this.getVariableForCurrentEvent,
            [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM]: this.getVariableForNewestEventProgram,
            [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE]: this.getVariableForNewestEventProgramStage,
            [variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT]: this.getVariableForPreviousEventProgram,
            [variableSourceTypes.TEI_ATTRIBUTE]: this.getVariableForSelectedEntityAttributes,
            [variableSourceTypes.CALCULATED_VALUE]: this.getVariableForCalculatedValue,
        };
    }

    getVariables(
        programRulesContainer: ProgramRulesContainer,
        executingEvent: ?EventData,
        eventsContainer: ?EventsDataContainer,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedEntity: ?Entity,
        selectedEnrollment: ?Enrollment,
        selectedOrgUnit: OrgUnit,
        optionSets: OptionSets,
    ) {
        const programVariables = programRulesContainer.programRulesVariables || [];
        const sourceData = {
            executingEvent,
            eventsContainer,
            dataElements,
            trackedEntityAttributes,
            selectedEntity,
            selectedEnrollment,
            optionSets,
            selectedOrgUnit,
        };

        const variables = programVariables.reduce((accVariables, programVariable) => {
            let variable;
            const variableKey = programVariable.displayName;

            const sourceType = programVariable.programRuleVariableSourceType;
            const getterFn = this.mapSourceTypeToGetterFn[sourceType];
            if (!getterFn) {
                log.error(`Unknown programRuleVariableSourceType:${programVariable.programRuleVariableSourceType}`);
                variable = this.buildVariable(EMPTY_STRING, null, typeKeys.TEXT, false, variablePrefixes.DATAELEMENT, null, programVariable.useNameForOptionSet);
                accVariables[variableKey] = variable;
                return accVariables;
            }

            // execute prechecks
            if (variableSourceTypesDataElementSpecific[sourceType]) {
                variable = this.preCheckDataElementSpecificSourceType(programVariable, dataElements);
            } else if (variableSourceTypesTrackedEntitySpecific[sourceType]) {
                variable = this.preCheckTrackedEntitySpecificSourceType(programVariable, trackedEntityAttributes);
            }

            if (variable) {
                accVariables[variableKey] = variable;
                return accVariables;
            }

            // run main builder
            variable = getterFn.bind(this)(programVariable, sourceData);

            if (!variable) {
                // run post getter
                if (variableSourceTypesDataElementSpecific[sourceType]) {
                    // $FlowSuppress preChecked
                    variable = this.postGetVariableForDataElementSpecificSourceType(programVariable, dataElements);
                }
            }

            if (variable) {
                accVariables[variableKey] = variable;
            }

            return accVariables;
        }, {});

        // add context variables
        const variablesWithContextVariables = { ...variables, ...this.getContextVariables(sourceData) };

        // add constant variables
        const variablesWithContextAndConstantVariables = { ...variablesWithContextVariables, ...this.getConstantVariables(programRulesContainer.constants) };

        return variablesWithContextAndConstantVariables;
    }

    processValue(value: any, type: $Values<typeof typeKeys>) {
        return this.onProcessValue(value, type);
    }

    buildVariable(value: any, allValues: ?Array<any>, type: string, valueFound: boolean, variablePrefix: string, variableEventDate: ?string, useNameForOptionSet?: ?boolean): Variable {
        const processedValues = allValues ? allValues.map(alternateValue => this.onProcessValue(alternateValue, type)) : null;

        return {
            variableValue: this.onProcessValue(value, type),
            useCodeForOptionSet: !useNameForOptionSet,
            variableType: useNameForOptionSet ? typeKeys.TEXT : type,
            hasValue: valueFound,
            variableEventDate,
            variablePrefix,
            allValues: processedValues,
        };
    }

    preCheckDataElementSpecificSourceType(programVariable: ProgramRuleVariable, dataElements: ?DataElements) {
        const dataElementId = programVariable.dataElementId;
        const dataElement = dataElementId && dataElements && dataElements[dataElementId];
        if (!dataElement) {
            log.warn(`Variable id:${programVariable.id} name:${programVariable.displayName} contains an invalid dataelement id (id: ${dataElementId || ''})`);
            return this.buildVariable(EMPTY_STRING, null, typeKeys.TEXT, false, variablePrefixes.DATAELEMENT, null, programVariable.useNameForOptionSet);
        }
        return null;
    }

    preCheckTrackedEntitySpecificSourceType(programVariable: ProgramRuleVariable, trackedEntityAttributes: ?TrackedEntityAttributes) {
        const attributeId = programVariable.trackedEntityAttributeId;
        const attribute = attributeId && trackedEntityAttributes && trackedEntityAttributes[attributeId];
        if (!attribute) {
            log.warn(`Variable id:${programVariable.id} name:${programVariable.displayName} contains an invalid trackedEntityAttribute id (id: ${attributeId || ''})`);
            return this.buildVariable(EMPTY_STRING, null, typeKeys.TEXT, false, variablePrefixes.TRACKED_ENTITY_ATTRIBUTE, null, programVariable.useNameForOptionSet);
        }
        return null;
    }

    postGetVariableForDataElementSpecificSourceType(programVariable: ProgramRuleVariable, dataElements: DataElements) {
        const dataElementId = programVariable.dataElementId;
        // $FlowSuppress: based on precheck over, dataElement should be found
        const dataElement: DataElement = dataElements[dataElementId];
        return this.buildVariable(EMPTY_STRING, null, dataElement.valueType, false, variablePrefixes.DATAELEMENT, EMPTY_STRING, programVariable.useNameForOptionSet);
    }

    getVariableForCalculatedValue(programVariable: ProgramRuleVariable): ?Variable {
        return this.buildVariable(EMPTY_STRING, null, typeKeys.TEXT, false, variablePrefixes.CALCULATED_VALUE, EMPTY_STRING, programVariable.useNameForOptionSet);
    }

    getVariableForSelectedEntityAttributes(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        if (!sourceData.selectedEntity) {
            log.warn(
                `Variable id:${programVariable.id} name:${programVariable.displayName} has sourcetype${programVariable.programRuleVariableSourceType}, but no selectedEntity was found`,
            );
            return this.buildVariable(EMPTY_STRING, null, typeKeys.TEXT, false, variablePrefixes.TRACKED_ENTITY_ATTRIBUTE, null, programVariable.useNameForOptionSet);
        }

        // $FlowSuppress preChecked
        const trackedEntityAttributeId: string = programVariable.trackedEntityAttributeId;
        // $FlowSuppress preChecked
        const attribute: TrackedEntityAttribute = sourceData.trackedEntityAttributes[trackedEntityAttributeId];
        const attributeValue = sourceData.selectedEntity[trackedEntityAttributeId];

        const hasValue = !!attributeValue || attributeValue === 0 || attributeValue === false;
        if (!hasValue) {
            return this.buildVariable(EMPTY_STRING, null, attribute.valueType, false, variablePrefixes.TRACKED_ENTITY_ATTRIBUTE, null, programVariable.useNameForOptionSet);
        }

        const variableValue = VariableService.getTrackedEntityValueForVariable(attributeValue, trackedEntityAttributeId, programVariable.useNameForOptionSet, sourceData.trackedEntityAttributes, sourceData.optionSets);
        return this.buildVariable(variableValue, null, attribute.valueType, true, variablePrefixes.TRACKED_ENTITY_ATTRIBUTE, null, programVariable.useNameForOptionSet);
    }

    getVariableForCurrentEvent(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        // $FlowSuppress: prechecked
        const dataElementId:string = programVariable.dataElementId;
        // $FlowSuppress: prechecked
        const dataElement: DataElement = sourceData.dataElements[dataElementId];
        const executingEvent = sourceData.executingEvent;
        if (!executingEvent) {
            return null;
        }

        const dataElementValue = executingEvent && executingEvent[dataElementId];
        if (!dataElementValue && dataElementValue !== 0 && dataElementValue !== false) {
            return null;
        }

        const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
        return this.buildVariable(value, null, dataElement.valueType, true, variablePrefixes.DATAELEMENT, executingEvent.eventDate, programVariable.useNameForOptionSet);
    }

    getVariableForNewestEventProgramStage(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        const programStageId = programVariable.programStageId;
        if (!programStageId) {
            log.warn(`Variable id:${programVariable.id} name:${programVariable.displayName} does not have a programstage defined, despite that the variable has sourcetype${programVariable.programRuleVariableSourceType}`);
            return null;
        }

        const stageEvents = sourceData.eventsContainer && sourceData.eventsContainer.byStage[programStageId];
        if (!stageEvents) {
            return null;
        }

        // $FlowSuppress: prechecked
        const dataElementId: string = programVariable.dataElementId;
        // $FlowSuppress: prechecked
        const dataElement: DataElement = sourceData.dataElements[dataElementId];

        const allValues = stageEvents
            .map(event =>
                VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets)
            )
            .filter(value => !!value || value === false || value === 0);

        const clonedEvents = [...stageEvents];
        const reversedEvents = clonedEvents.reverse();

        const eventWithValue = reversedEvents.find((event) => {
            const dataElementValue = event[dataElementId];
            return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
        });

        if (!eventWithValue) {
            return null;
        }

        const dataElementValue = eventWithValue[dataElementId];
        const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
        return this.buildVariable(value, allValues, dataElement.valueType, true, variablePrefixes.DATAELEMENT, eventWithValue.eventDate, programVariable.useNameForOptionSet);
    }

    getVariableForNewestEventProgram(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        const events = sourceData.eventsContainer && sourceData.eventsContainer.all;
        if (!events || events.length === 0) {
            return null;
        }

        // $FlowSuppress: prechecked
        const dataElementId: string = programVariable.dataElementId;
        // $FlowSuppress: prechecked
        const dataElement: DataElement = sourceData.dataElements[dataElementId];

        const allValues = events
            .map(event =>
                VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets)
            )
            .filter(value => !!value || value === false || value === 0);

        const clonedEvents = [...events];
        const reversedEvents = clonedEvents.reverse();

        const eventWithValue = reversedEvents.find((event) => {
            const dataElementValue = event[dataElementId];
            return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
        });

        if (!eventWithValue) {
            return null;
        }

        const dataElementValue = eventWithValue[dataElementId];
        const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
        return this.buildVariable(value, allValues, dataElement.valueType, true, variablePrefixes.DATAELEMENT, eventWithValue.eventDate, programVariable.useNameForOptionSet);
    }

    getVariableForPreviousEventProgram(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        const events = sourceData.eventsContainer && sourceData.eventsContainer.all;
        if (!events || events.length === 0) {
            return null;
        }

        const currentEvent = sourceData.executingEvent;
        if (!currentEvent) {
            return null;
        }

        const currentEventIndex = events.findIndex(event => event.eventId === currentEvent.eventId);
        const previousEventIndex = currentEventIndex - 1;
        if (previousEventIndex < 0) {
            return null;
        }

        // $FlowSuppress: prechecked
        const dataElementId: string = programVariable.dataElementId;
        // $FlowSuppress: prechecked
        const dataElement: DataElement = sourceData.dataElements[dataElementId];

        const previousEvents = events.slice(0, currentEventIndex);
        const allValues = previousEvents
            .map(event =>
                VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets),
            )
            .filter(value => !!value || value === false || value === 0);

        const clonedEvents = [...previousEvents];
        const reversedEvents = clonedEvents.reverse();

        const eventWithValue = reversedEvents.find((event) => {
            const dataElementValue = event[dataElementId];
            return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
        });

        if (!eventWithValue) {
            return null;
        }

        const dataElementValue = eventWithValue[dataElementId];
        const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
        return this.buildVariable(value, allValues, dataElement.valueType, true, variablePrefixes.DATAELEMENT, eventWithValue.eventDate, programVariable.useNameForOptionSet);
    }

    getContextVariables(sourceData: SourceData): { [key: string]: Variable } {
        let variables = {};

        // TODO: need to build some kind of date service and change this codeline
        variables.current_date = this.buildVariable(this.dateUtils.getToday(), null, typeKeys.DATE, true, variablePrefixes.CONTEXT_VARIABLE, null, false);

        variables = { ...variables, ...this.getEventContextVariables(sourceData.executingEvent, sourceData.eventsContainer) };
        variables = { ...variables, ...this.getEnrollmentContextVariables(sourceData.selectedEnrollment) };
        variables = { ...variables, ...this.getOrganisationContextVariables(sourceData.selectedOrgUnit) };

        return variables;
    }

    getEventContextVariables(executingEvent: ?EventData, eventsContainer: ?EventsDataContainer) {
        const variables = {};

        if (executingEvent) {
            variables.event_date = this.buildVariable(executingEvent.eventDate, null, typeKeys.DATE, true, variablePrefixes.CONTEXT_VARIABLE, null, false);
            variables.due_date = this.buildVariable(executingEvent.dueDate, null, typeKeys.DATE, true, variablePrefixes.CONTEXT_VARIABLE, null, false);
            variables.event_id = this.buildVariable(executingEvent.eventId || EMPTY_STRING, null, typeKeys.TEXT, !!executingEvent, variablePrefixes.CONTEXT_VARIABLE, executingEvent.eventDate, false);
        }

        if (eventsContainer) {
            variables.event_count = this.buildVariable((eventsContainer.all && eventsContainer.all.length) || 0, null, typeKeys.INTEGER, true, variablePrefixes.CONTEXT_VARIABLE, null, false);
        }

        return variables;
    }

    getEnrollmentContextVariables(selectedEnrollment: ?Enrollment) {
        const variables = {};

        if (selectedEnrollment) {
            variables.enrollment_date = this.buildVariable((selectedEnrollment && selectedEnrollment.enrollmentDate) || EMPTY_STRING, null, typeKeys.DATE, !!(selectedEnrollment && selectedEnrollment.enrollmentDate), variablePrefixes.CONTEXT_VARIABLE, null, false);
            variables.enrollment_id = this.buildVariable((selectedEnrollment && selectedEnrollment.enrollment) || EMPTY_STRING, null, typeKeys.TEXT, !!(selectedEnrollment && selectedEnrollment.enrollmentDate), variablePrefixes.CONTEXT_VARIABLE, null, false);
            variables.enrollment_count = this.buildVariable(selectedEnrollment ? 1 : 0, null, typeKeys.INTEGER, true, variablePrefixes.CONTEXT_VARIABLE, null, false);
            variables.tei_count = this.buildVariable(selectedEnrollment ? 1 : 0, null, typeKeys.INTEGER, true, variablePrefixes.CONTEXT_VARIABLE, null, false);
            variables.incident_date = this.buildVariable((selectedEnrollment && selectedEnrollment.incidentDate) || EMPTY_STRING, null, typeKeys.DATE, !!selectedEnrollment, variablePrefixes.CONTEXT_VARIABLE, null, false);
        }

        return variables;
    }

    getOrganisationContextVariables(orgUnit: OrgUnit) {
        const variables = {};
        variables.orgunit_code = this.buildVariable(orgUnit.code, null, typeKeys.TEXT, !!orgUnit.code, variablePrefixes.CONTEXT_VARIABLE, null, false);
        return variables;
    }

    getConstantVariables(constants: ?Constants) {
        const constantVariables = constants ? constants.reduce((accConstantVariables, constant) => {
            accConstantVariables[constant.id] = this.buildVariable(constant.value, null, typeKeys.INTEGER, true, variablePrefixes.CONSTANT_VARIABLE, null, false);
            return accConstantVariables;
        }, {}) : {};

        return constantVariables;
    }
}
