/* eslint-disable complexity */
import log from 'loglevel';
import OptionSetService from '../OptionSetService/OptionSetService';
import typeKeys from '../typeKeys.const';
import variablePrefixes from '../variablePrefixes';

import type { ProgramRuleVariable, EventData, EventsData, EventsDataContainer, OptionSets, DataElements, TrackedEntityAttributes, Entity, Enrollment, Constants } from '../rulesEngine.types';

type SourceData = {
    executingEvent: EventData,
    eventsContainer: EventsDataContainer,
    dataElements: DataElements,
    trackedEntityAttributes: Object,
    selectedEntity: Object,
    selectedEnrollment: Object,
    optionSets: Array<any>,
};


type Variable = {
    variableValue: any,
    useCodeForOptionSet: boolean,
    variableType: string,
    hasValue: boolean,
    variableEventDate: string,
    variablePrefix: string,
    allValues: ?Array<any>,
};

const variableSourceTypesDataElementSpecific = {
    DATAELEMENT_CURRENT_EVENT: 'DATAELEMENT_CURRENT_EVENT',
    DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE: 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE',
    DATAELEMENT_NEWEST_EVENT_PROGRAM: 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
    DATAELEMENT_PREVIOUS_EVENT: 'DATAELEMENT_PREVIOUS_EVENT',
};

const variableSourceTypes = {
    ...variableSourceTypesDataElementSpecific,
    TEI_ATTRIBUTE: 'TEI_ATTRIBUTE',
    CALCULATED_VALUE: 'CALCULATED_VALUE',
};

const errorMessages = {
    DATAELEMENT_NOT_FOUND: 'Could not find dataelement with id: {0}',
};

const EMPTY_STRING = '';


class VariableService {
    static getDataElementValueForVariable(value: any, dataElementId: string, useNameForOptionSet: boolean, dataElements: DataElements, optionSets: OptionSets) {
        const hasValue = !!value || value === 0 || value === false;
        return (hasValue && useNameForOptionSet && dataElements && dataElements[dataElementId].optionSetId) ?
            OptionSetService.getName(optionSets[dataElements[dataElementId].optionSetId].options, value) :
            value;
    }

    static getTrackedEntityValueForVariable(value: any, trackedEntityAttributeId: string, useNameForOptionSet: boolean, trackedEntityAttributes: TrackedEntityAttributes, optionSets: OptionSets) {
        return useNameForOptionSet && trackedEntityAttributes && trackedEntityAttributes[trackedEntityAttributeId].optionSetId ?
            OptionSetService.getName(optionSets[trackedEntityAttributes[trackedEntityAttributeId].optionSetId].options, value)
            : value;
    }

    static getDataElementValueOrCode(useCodeForOptionSet, event, dataElementId, allDes, optionSets) {
        return VariableService.getDataElementValueOrCodeForValue(useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
    }

    constructor(onProcessValue) {
        this.onProcessValue = onProcessValue;
        this.mapSourceTypeToGetterFn = {
            [variableSourceTypes.DATAELEMENT_CURRENT_EVENT]: this.getVariableForCurrentEvent,
            [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM]: this.getVariableForNewestEventProgram,
            [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE]: this.getVariableForNewestEventProgramStage,
            [variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT]: this.getVariableForPreviousEventProgram,
            [variableSourceTypes.TEI_ATTRIBUTE]: this.getVariableForSelectedEntityAttributes,
            [variableSourceTypes.CALCULATED_VALUE]: this.getVariableForCalculatedValue,     
        };
    }

    buildVariable(value: any, allValues: ?Array<any>, type: string, valueFound: boolean, variablePrefix: string, variableEventDate: string, useNameForOptionSet: boolean): Variable {
        const processedValues = allValues ? allValues.map(alternateValue => this.onProcessValue(alternateValue, varType)) : null;

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

    pushVariable(variables, variablename, varValue, allValues, varType, variablefound, variablePrefix, variableEventDate, useCodeForOptionSet) {
        const processedValues = allValues ? allValues.map(alternateValue => this.onProcessValue(alternateValue, varType)) : null;

        variables[variablename] = {
            variableValue: this.onProcessValue(varValue, varType),
            useCodeForOptionSet,
            variableType: varType,
            hasValue: variablefound,
            variableEventDate,
            variablePrefix,
            allValues: processedValues,
        };
        return variables;
    }

    processValue(value, type) {
        return this.onProcessValue(value, type);
    }

    preCheckDataElementSpecificSourceType(programVariable: ProgramRuleVariable, dataElements: DataElements) {        
        const dataElementId = programVariable.dataElement && programVariable.dataElement.id;
        const dataElement = dataElements[dataElementId];
        if (!dataElement) {
            log.warn('Variable id:' + programVariable.id + ' name:' + programVariable.displayName + 'contains an invalid dataelement id (id: ' + dataElementId + ')');
            return this.buildVariable('', null, typeKeys.TEXT, false, variablePrefixes.DATAELEMENT, '', programVariable.useNameForOptionSet);
        }
        return null;
    }

    postGetVariableForDataElementSpecificSourceType(programVariable: ProgramRuleVariable, dataElements: DataElements) {
        const dataElementId = programVariable.dataElement && programVariable.dataElement.id;
        const dataElement = dataElements[dataElementId];
        return this.buildVariable('', null, dataElement.valueType, false, variablePrefixes.DATAELEMENT, '', programVariable.useNameForOptionSet);
    }

    getVariables(
        programRulesContainer: ProgramRulesContainer,
        executingEvent: EventData,
        eventsContainer: EventsDataContainer,
        dataElements: DataElements,
        trackedEntityAttributes: TrackedEntityAttributes,
        selectedEntity: Entity,
        selectedEnrollment: Enrollment,
        optionSets: OptionSets) {       
        const programVariables = programRulesContainer.programVariables;
        const sourceData = {
            executingEvent,
            eventsContainer,
            dataElements,
            trackedEntityAttributes,
            selectedEntity,
            selectedEnrollment,
            optionSets
        };

        const variables = programVariables.reduce((accVariables, programVariable) => {
            let variable;
            const variableKey = programVariable.displayName;

            const sourceType = programVariable.programRuleVariableSourceType;
            const getterFn = this.mapSourceTypeToGetterFn[sourceType];
            if (!getterFn) {
                log.error('Unknown programRuleVariableSourceType:' + programVariable.programRuleVariableSourceType);
                variable = this.buildVariable(EMPTY_STRING, null, typeKeys.TEXT, false, variablePrefixes.DATAELEMENT, EMPTY_STRING, programVariable.useNameForOptionSet);
                accVariables[variableKey] = variable;
                return accVariables;
            }

            // execute prechecks
            if (variableSourceTypesDataElementSpecific[sourceType]) {
                variable = this.preCheckDataElementSpecificSourceType(programVariable, dataElements);                
            }

            if (variable) {
                accVariables[variableKey] = variable;
                return accVariables;
            }

            // run main builder
            variable = getterFn(programVariable, sourceData);

            if (!variable) {
                // run post getter
                if (variableSourceTypesDataElementSpecific[sourceType]) {
                    variable = this.postGetVariableForDataElementSpecificSourceType(programVariable, dataElements);
                }
            }

            if (variable) {
                 accVariables[variableKey] = variable;
            }
           
            return accVariables;
        });

        // add context variables
        const variablesWithContextVariables = { ...variables, ...this.getContextVariables(sourceData) };

        // add constant variables
        const variablesWithContextAndConstantVariables = { ...variablesWithContextVariables, ...this.getConstantVariables(ProgramRulesContainer.constants) };

        /*
        let orgUnitUid = selectedEnrollment ? selectedEnrollment.orgUnit : executingEvent.orgUnit;
        let orgUnitCode = '';
        let def = $q.defer();
        if (orgUnitUid) {
            OrgUnitFactory.getFromStoreOrServer(orgUnitUid).then((response) => {
                orgUnitCode = response.code;
                variables = this.pushVariable(variables, 'orgunit_code', orgUnitCode, null, 'TEXT', orgUnitCode ? true : false, 'V', '', false);
                def.resolve(variables);
            });
        }else {
            def.resolve(variables);
        }
        return def.promise;
        */

        return variablesWithContextAndConstantVariables;
    }

    getVariableForCalculatedValue(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        return this.buildVariable(EMPTY_STRING, null, typeKeys.TEXT, false, variablePrefixes.CALCULATED_VALUE, EMPTY_STRING, programVariable.useNameForOptionSet);
    }

    getVariableForSelectedEntityAttributes(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        const trackedEntityAttributeId = programVariable.trackedEntityAttribute && programVariable.trackedEntityAttribute.id;
        if (!trackedEntityAttributeId) {
            log.warn(
                'Variable id:' + programVariable.id + ' name:' + programVariable.displayName
                + ' does not have a trackedEntityAttribute defined, despite that the variable has sourcetype' + programVariable.programRuleVariableSourceType
            );
            return this.buildVariable(EMPTY_STRING, null, typeKeys.TEXT, true, variablePrefixes.TRACKED_ENTITY_ATTRIBUTE, EMPTY_STRING, programVariable.useNameForOptionSet);
        }

        const attributes = sourceData.selectedEntity.attributes;
        
        const attribute = attributes.find((attribute) => {
            return attribute.id === trackedEntityAttributeId; 
        });

        const attributeValue = attribute.value;
        const hasValue = !!attributeValue || attributeValue === 0 || attributeValue === false;        
        if (!hasValue) {
            return this.buildVariable(EMPTY_STRING, null, attribute.valueType, true, variablePrefixes.TRACKED_ENTITY_ATTRIBUTE, EMPTY_STRING, programVariable.useNameForOptionSet);           
        }

        const variableValue = getTrackedEntityValueForVariable(attributeValue, trackedEntityAttributeId, programVariable.useNameForOptionSet, attributes, sourceData.optionSets);
        return this.buildVariable(variableValue, null, attribute.valueType, true, variablePrefixes.TRACKED_ENTITY_ATTRIBUTE, EMPTY_STRING, programVariable.useNameForOptionSet);
    }

    getVariableForCurrentEvent(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        const dataElementValue = executingEvent[dataElementId];
        if (!dataElementValue && dataElementValue !== 0 && dataElementValue !== false) {
            return null;
        }
        
        const dataElementId = programVariable.dataElementId;
        const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
        return this.buildVariable(value, null, sourceData.dataElements[dataElementId].valueType, true, variablePrefixes.DATAELEMENT, event.eventDate, programVariable.useNameForOptionSet);
    }

    getVariableForNewestEventProgramStage(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        const programStageId = programVariable.programStage && programVariable.programStage.id;
        if (!programStageId) {
            log.warn('Variable id:' + programVariable.id + ' name:' + programVariable.displayName
                            + ' does not have a programstage defined, despite that the variable has sourcetype' + programVariable.programRuleVariableSourceType);
            return null;
        }

        const stageEvents = sourceData.eventsContainer.byStage[programStageId];
        if (!stageEvents) {
            return null;
        }
        
        const dataElementId = programVariable.dataElementId;

        const allValues = stageEvents
        .map(event =>  
            VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
        )
        .filter(value => !!value || value === false || value === 0);

        const clonedEvents = [...stageEvents];
        const reversedEvents = clonedEvents.reverse();

        const eventWithValue = reversedEvents.find((event) => {
            const dataElementValue = event[dataElementId];
            return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
        });

        if (eventWithValue) {
            const dataElementValue = eventWithValue[dataElementId];
            const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
            return this.buildVariable(value, allValues, sourceData.dataElements[dataElementId].valueType, true, variablePrefixes.DATAELEMENT, event.eventDate, programVariable.useNameForOptionSet);        
        } else {
            return this.buildVariable(EMPTY_STRING, allValues, sourceData.dataElements[dataElementId].valueType, false, variablePrefixes.DATAELEMENT, event.eventDate, programVariable.useNameForOptionSet); 
        }
    }

    getVariableForNewestEventProgram(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        const events = sourceData.eventsContainer.all;
        if (!events || events.length === 0) {
            return null;
        }

        const dataElementId = programVariable.dataElementId;

        const allValues = events
        .map(event =>  
            VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
        )
        .filter(value => !!value || value === false || value === 0);

        const clonedEvents = [...events];
        const reversedEvents = clonedEvents.reverse();

        const eventWithValue = reversedEvents.find((event) => {
            const dataElementValue = event[dataElementId];
            return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
        });

        if (eventWithValue) {
            const dataElementValue = eventWithValue[dataElementId];
            const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
            return this.buildVariable(value, allValues, sourceData.dataElements[dataElementId].valueType, true, variablePrefixes.DATAELEMENT, event.eventDate, programVariable.useNameForOptionSet);        
        } else {
            return this.buildVariable(EMPTY_STRING, allValues, sourceData.dataElements[dataElementId].valueType, false, variablePrefixes.DATAELEMENT, event.eventDate, programVariable.useNameForOptionSet); 
        }
    }

    getVariableForPreviousEventProgram(programVariable: ProgramRuleVariable, sourceData: SourceData): ?Variable {
        const events = sourceData.eventsContainer.all;
        if (!events || events.length === 0) {
            return null;
        }

        const currentEvent = sourceData.executingEvent;
        const currentEventIndex = events.findIndex(event => event.eventId === currentEvent.eventId);
        const previousEventIndex -= 1;
        if (previousEventIndex < 0) {
            return null;
        }

        const dataElementId = programVariable.dataElementId;      

        const previousEvents = events.slice(0, currentEventIndex);          
        const allValues = previousEvents
        .map(event =>  
            VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
        )
        .filter(value => !!value || value === false || value === 0);

        const clonedEvents = [...previosEvents];
        const reversedEvents = clonedEvents.reverse();

        const eventWithValue = reversedEvents.find((event) => {
            const dataElementValue = event[dataElementId];
            return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
        });

        if (eventWithValue) {
            const dataElementValue = eventWithValue[dataElementId];
            const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
            return this.buildVariable(value, allValues, sourceData.dataElements[dataElementId].valueType, true, variablePrefixes.DATAELEMENT, event.eventDate, programVariable.useNameForOptionSet);        
        } else {
            return this.buildVariable(EMPTY_STRING, allValues, sourceData.dataElements[dataElementId].valueType, false, variablePrefixes.DATAELEMENT, event.eventDate, programVariable.useNameForOptionSet); 
        }
    }



    getContextVariables(sourceData: SourceData): { [key: string]: Variable } (
        const variables = {};
        variables['current_date'] = this.buildVariable(DateUtils.getToday(), null, typeKeys.DATE, true, variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);
        variables['event_date'] = this.buildVariable(executingEvent.eventDate, null, typeKeys.DATE, true, variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);
        variables['due_date'] = this.buildVariable(executingEvent.dueDate, null, typeKeys.DATE, true, variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);  
        variables['event_count'] = this.buildVariable((sourceData.eventsContainer.all && sourceData.eventsContainer.all.length) || 0, null, typeKeys.INTEGER, true, variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);
        variables['event_id'] = this.buildVariable((executingEvent && executingEvent.eventId) || EMPTY_STRING, null, typeKeys.TEXT, !!executingEvent, variablePrefixes.CONTEXT_VARIABLE, (executingEvent && executingEvent.eventDate) || EMPTY_STRING, false);

        const variablesWithEnrollmentVariables = { ...variables, ...this.getEnrollmentContextVariables(SourceData.selectedEnrollment) };
        return variablesWithEnrollmentVariables;
    )

    getEnrollmentContextVariables(selectedEnrollment: Enrollment) {
        const variables = {};
        const selectedEnrollment = sourceData.selectedEnrollment;

        if (selectedEnrollment) {
            variables['enrollment_date'] = this.buildVariable((sourceData.selectedEnrollment && sourceData.selectedEnrollment.enrollmentDate) || EMPTY_STRING, null, typeKeys.DATE, !!(sourceData.selectedEnrollment && sourceData.selectedEnrollment.enrollmentDate), variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);
            variables['enrollment_id'] = this.buildVariable((selectedEnrollment && selectedEnrollment.enrollment) || EMPTY_STRING, null, typeKeys.TEXT, !!(sourceData.selectedEnrollment && sourceData.selectedEnrollment.enrollmentDate), variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);

            variables['enrollment_count'] = this.buildVariable(selectedEnrollment ? 1 : 0, null, typeKeys.INTEGER, true, variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);
            variables['tei_count'] = this.buildVariable(selectedEnrollment ? 1 : 0, null, typeKeys.INTEGER, true, variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);
            variables['incident_date'] = this.buildVariable((selectedEnrollment && selectedEnrollment.incidentDate) || EMPTY_STRING, null, typeKeys.DATE, !!selectedEnrollment, variablePrefixes.CONTEXT_VARIABLE, EMPTY_STRING, false);
        }
        
        return variables;
    }

    getConstantVariables(constants: Constants) {
        const constantVariables = constants.reduce((accConstantVariables, constant) => {
            accConstantVariables[constant.id] = this.buildVariable(constant.value, null, typeKeys.INTEGER, true, variablePrefixes.CONSTANT_VARIABLE, EMPTY_STRING, false);
        }, {});

        return constantVariables;
    }

    