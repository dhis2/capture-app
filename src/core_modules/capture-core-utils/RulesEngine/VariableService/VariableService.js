// @flow
/* eslint-disable complexity */
// eslint-disable-next-line import/no-extraneous-dependencies
import log from 'loglevel';
import OptionSetHelper from '../OptionSetHelper/OptionSetHelper';
import typeKeys from '../typeKeys.const';
import variablePrefixes from '../variablePrefixes';
import getDateUtils from '../dateUtils/dateUtils';
import momentConverter from '../converters/momentConverter';

import type {
    ProgramRuleVariable,
    InputEvent,
    EventsDataContainer,
    OptionSets,
    DataElement,
    DataElements,
    TrackedEntityAttribute,
    TrackedEntityAttributes,
    Enrollment,
    Constants,
    OrgUnit,
    DateUtils,
    RuleVariable,
    TEIValues,
} from '../rulesEngine.types';
import type { Entity } from '../../../capture-core/components/Relationships/relationships.types';

type SourceData = {
    executingEvent: ?InputEvent,
    eventsContainer: ?EventsDataContainer,
    dataElements: ?DataElements,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    selectedEntity: ?TEIValues,
    selectedEnrollment: ?Enrollment,
    optionSets: OptionSets,
    selectedOrgUnit: OrgUnit,
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

    onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any;
    dateUtils: DateUtils;
    mapSourceTypeToGetterFn: { [sourceType: string]: (programVariable: ProgramRuleVariable, sourceData: SourceData) => ?RuleVariable };
    constructor(onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any) {
        this.onProcessValue = onProcessValue;
        this.dateUtils = getDateUtils(momentConverter);

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
        programRulesContainer: { constants?: ?Constants, programRulesVariables: ?Array<ProgramRuleVariable>},
        executingEvent: ?EventData,
        eventsContainer: ?EventsDataContainer,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedEntity: ?TEIValues,
        selectedEnrollment: ?Enrollment,
        selectedOrgUnit: OrgUnit,
        optionSets: ?OptionSets,
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
                variable = this.buildVariable(
                    EMPTY_STRING,
                    typeKeys.TEXT, {
                        variablePrefix: variablePrefixes.DATAELEMENT,
                        useNameForOptionSet: programVariable.useNameForOptionSet,
                    },
                );
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

    buildVariable(
        value: any,
        type: string,
        {
            variablePrefix,
            allValues,
            variableEventDate,
            useNameForOptionSet = false,
        }: {
            variablePrefix: string,
            allValues?: ?Array<any>,
            variableEventDate?: ?string,
            useNameForOptionSet?: ?boolean,
        },
    ): RuleVariable {
        const processedAllValues = allValues ?
            allValues
                .map(alternateValue => this.onProcessValue(alternateValue, type)) :
            null;

        return {
            variableValue: this.onProcessValue(value, type),
            useCodeForOptionSet: !useNameForOptionSet,
            variableType: useNameForOptionSet ? typeKeys.TEXT : type,
            hasValue: !!value || value === 0 || value === false,
            variableEventDate,
            variablePrefix,
            allValues: processedAllValues,
        };
    }

    preCheckDataElementSpecificSourceType(programVariable: ProgramRuleVariable, dataElements: ?DataElements) {
        const dataElementId = programVariable.dataElementId;
        const dataElement = dataElementId && dataElements && dataElements[dataElementId];
        if (!dataElement) {
            log.warn(`Variable id:${programVariable.id} name:${programVariable.displayName} contains an invalid dataelement id (id: ${dataElementId || ''})`);
            return this.buildVariable(
                EMPTY_STRING,
                typeKeys.TEXT, {
                    variablePrefix: variablePrefixes.DATAELEMENT,
                    useNameForOptionSet: programVariable.useNameForOptionSet,
                },
            );
        }
        return null;
    }

    preCheckTrackedEntitySpecificSourceType(programVariable: ProgramRuleVariable, trackedEntityAttributes: ?TrackedEntityAttributes) {
        const attributeId = programVariable.trackedEntityAttributeId;
        const attribute = attributeId && trackedEntityAttributes && trackedEntityAttributes[attributeId];
        if (!attribute) {
            log.warn(`Variable id:${programVariable.id} name:${programVariable.displayName} contains an invalid trackedEntityAttribute id (id: ${attributeId || ''})`);
            return this.buildVariable(
                EMPTY_STRING,
                typeKeys.TEXT, {
                    variablePrefix: variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
                    useNameForOptionSet: programVariable.useNameForOptionSet,
                },
            );
        }
        return null;
    }

    postGetVariableForDataElementSpecificSourceType(programVariable: ProgramRuleVariable, dataElements: DataElements) {
        const dataElementId = programVariable.dataElementId;
        // $FlowSuppress: based on precheck over, dataElement should be found
        const dataElement: DataElement = dataElements[dataElementId];
        return this.buildVariable(
            EMPTY_STRING,
            dataElement.valueType, {
                variablePrefix: variablePrefixes.DATAELEMENT,
                useNameForOptionSet: programVariable.useNameForOptionSet,
            },
        );
    }

    getVariableForCalculatedValue(programVariable: ProgramRuleVariable): ?RuleVariable {
        return this.buildVariable(
            EMPTY_STRING,
            typeKeys.TEXT, {
                variablePrefix: variablePrefixes.CALCULATED_VALUE,
                useNameForOptionSet: programVariable.useNameForOptionSet,
            },
        );
    }

    getVariableForSelectedEntityAttributes(programVariable: ProgramRuleVariable, sourceData: SourceData): ?RuleVariable {
        if (!sourceData.selectedEntity) {
            log.warn(
                `Variable id:${programVariable.id} name:${programVariable.displayName} has sourcetype${programVariable.programRuleVariableSourceType}, but no selectedEntity was found`,
            );
            return this.buildVariable(
                EMPTY_STRING,
                typeKeys.TEXT, {
                    variablePrefix: variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
                    useNameForOptionSet: programVariable.useNameForOptionSet,
                },
            );
        }

        // $FlowSuppress preChecked
        const trackedEntityAttributeId: string = programVariable.trackedEntityAttributeId;
        // $FlowSuppress preChecked
        const attribute: TrackedEntityAttribute = sourceData.trackedEntityAttributes[trackedEntityAttributeId];
        const attributeValue = sourceData.selectedEntity[trackedEntityAttributeId];

        const hasValue = !!attributeValue || attributeValue === 0 || attributeValue === false;
        if (!hasValue) {
            return this.buildVariable(
                EMPTY_STRING,
                attribute.valueType, {
                    variablePrefix: variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
                    useNameForOptionSet: programVariable.useNameForOptionSet,
                },
            );
        }

        const variableValue = VariableService.getTrackedEntityValueForVariable(attributeValue, trackedEntityAttributeId, programVariable.useNameForOptionSet, sourceData.trackedEntityAttributes, sourceData.optionSets);
        return this.buildVariable(
            variableValue,
            attribute.valueType, {
                variablePrefix: variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
                useNameForOptionSet: programVariable.useNameForOptionSet,
            },
        );
    }

    getVariableForCurrentEvent(programVariable: ProgramRuleVariable, sourceData: SourceData): ?RuleVariable {
        // $FlowSuppress: prechecked
        const dataElementId: string = programVariable.dataElementId;
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
        return this.buildVariable(
            value,
            dataElement.valueType, {
                variablePrefix: variablePrefixes.DATAELEMENT,
                variableEventDate: executingEvent.eventDate,
                useNameForOptionSet: programVariable.useNameForOptionSet,
            },
        );
    }

    getVariableForNewestEventProgramStage(programVariable: ProgramRuleVariable, sourceData: SourceData): ?RuleVariable {
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
                VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets),
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
        return this.buildVariable(
            value,
            dataElement.valueType, {
                variablePrefix: variablePrefixes.DATAELEMENT,
                variableEventDate: eventWithValue.eventDate,
                useNameForOptionSet: programVariable.useNameForOptionSet,
                allValues,
            },
        );
    }

    getVariableForNewestEventProgram(programVariable: ProgramRuleVariable, sourceData: SourceData): ?RuleVariable {
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
                VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets),
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
        return this.buildVariable(
            value,
            dataElement.valueType, {
                variablePrefix: variablePrefixes.DATAELEMENT,
                variableEventDate: eventWithValue.eventDate,
                useNameForOptionSet: programVariable.useNameForOptionSet,
                allValues,
            },
        );
    }

    getVariableForPreviousEventProgram(programVariable: ProgramRuleVariable, sourceData: SourceData): ?RuleVariable {
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
        return this.buildVariable(
            value,
            dataElement.valueType, {
                variablePrefix: variablePrefixes.DATAELEMENT,
                variableEventDate: eventWithValue.eventDate,
                useNameForOptionSet: programVariable.useNameForOptionSet,
                allValues,
            },
        );
    }

    getContextVariables(sourceData: SourceData): { [key: string]: RuleVariable } {
        let variables = {};

        // TODO: need to build some kind of date service and change this codeline
        variables.current_date = this.buildVariable(
            this.dateUtils.getToday(),
            typeKeys.DATE, {
                variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
            },
        );

        variables = { ...variables, ...this.getEventContextVariables(sourceData.executingEvent, sourceData.eventsContainer) };
        variables = { ...variables, ...this.getEnrollmentContextVariables(sourceData.selectedEnrollment) };
        variables = { ...variables, ...this.getOrganisationContextVariables(sourceData.selectedOrgUnit) };

        return variables;
    }

    getEventContextVariables(executingEvent: ?EventData, eventsContainer: ?EventsDataContainer) {
        const variables = {};

        if (executingEvent) {
            variables.event_date = this.buildVariable(
                executingEvent.eventDate,
                typeKeys.DATE, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                },
            );

            variables.due_date = this.buildVariable(
                executingEvent.dueDate,
                typeKeys.DATE, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                },
            );

            variables.event_id = this.buildVariable(
                executingEvent.eventId,
                typeKeys.TEXT, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                    variableEventDate: executingEvent.eventDate,
                },
            );
        }

        if (eventsContainer) {
            variables.event_count = this.buildVariable(
                (eventsContainer.all && eventsContainer.all.length) || 0,
                typeKeys.INTEGER, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                },
            );
        }

        return variables;
    }

    getEnrollmentContextVariables(selectedEnrollment: ?Enrollment) {
        const variables = {};

        if (selectedEnrollment) {
            variables.enrollment_date = this.buildVariable(
                selectedEnrollment.enrollmentDate,
                typeKeys.DATE, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                },
            );

            variables.enrollment_id = this.buildVariable(
                selectedEnrollment.enrollmentId,
                typeKeys.TEXT, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                },
            );

            variables.enrollment_count = this.buildVariable(
                selectedEnrollment ? 1 : 0,
                typeKeys.INTEGER, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                },
            );

            variables.tei_count = this.buildVariable(
                selectedEnrollment ? 1 : 0,
                typeKeys.INTEGER, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                },
            );

            variables.incident_date = this.buildVariable(
                selectedEnrollment.incidentDate,
                typeKeys.DATE, {
                    variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
                },
            );
        }

        return variables;
    }

    getOrganisationContextVariables(orgUnit: OrgUnit) {
        const variables = {};
        variables.orgunit_code = this.buildVariable(
            orgUnit.name,
            typeKeys.TEXT, {
                variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
            },
        );
        return variables;
    }

    getConstantVariables(constants: ?Constants) {
        const constantVariables = constants ? constants.reduce((accConstantVariables, constant) => {
            accConstantVariables[constant.id] = this.buildVariable(
                constant.value,
                typeKeys.INTEGER, {
                    variablePrefix: variablePrefixes.CONSTANT_VARIABLE,
                },
            );
            return accConstantVariables;
        }, {}) : {};

        return constantVariables;
    }
}
