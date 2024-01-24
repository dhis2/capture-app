// @flow
import log from 'loglevel';
import { OptionSetHelper } from '../../helpers/OptionSetHelper';
import { typeKeys, typeof environmentTypes } from '../../constants';
import { variablePrefixes } from './variablePrefixes.const';
import { getStructureEvents } from './helpers';
import { normalizeRuleVariable } from '../../commonUtils/normalizeRuleVariable';
import { defaultValues } from './defaultValues';
import type {
    VariableServiceInput,
    ProgramRuleVariable,
    EventData,
    EventsData,
    EventsDataContainer,
    OptionSets,
    Enrollment,
    TEIValues,
    Constants,
} from './variableService.types';

import type {
    DataElement,
    DataElements,
    TrackedEntityAttribute,
    TrackedEntityAttributes,
    RuleVariable,
    RuleVariables,
    IDateUtils,
    OrgUnit,
} from '../../rulesEngine.types';

type SourceData = {
    executingEvent: ?EventData,
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

export const variableSourceTypes = {
    ...variableSourceTypesDataElementSpecific,
    ...variableSourceTypesTrackedEntitySpecific,
    CALCULATED_VALUE: 'CALCULATED_VALUE',
};

export class VariableService {
    static dateUtils: IDateUtils;
    environment: $Values<environmentTypes>;

    onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any;
    mapSourceTypeToGetterFn: { [sourceType: string]: (programVariable: ProgramRuleVariable, sourceData: SourceData) => ?RuleVariable };
    defaultValues: any;
    structureEvents: (currentEvent?: EventData, events?: EventsData) => EventsDataContainer;
    constructor(
        onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any,
        dateUtils: IDateUtils,
        environment: $Values<environmentTypes>,
    ) {
        this.environment = environment;
        this.onProcessValue = onProcessValue;
        VariableService.dateUtils = dateUtils;

        this.mapSourceTypeToGetterFn = {
            [variableSourceTypes.DATAELEMENT_CURRENT_EVENT]: this.getVariableForCurrentEvent,
            [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM]: this.getVariableForNewestEventProgram,
            [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE]: this.getVariableForNewestEventProgramStage,
            [variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT]: this.getVariableForPreviousEventProgram,
            [variableSourceTypes.TEI_ATTRIBUTE]: this.getVariableForSelectedEntityAttributes,
            [variableSourceTypes.CALCULATED_VALUE]: this.getVariableForCalculatedValue,
        };

        this.defaultValues = defaultValues;

        this.structureEvents = getStructureEvents(dateUtils.compareDates);
    }

    getVariables({
        programRuleVariables,
        currentEvent: executingEvent,
        otherEvents,
        dataElements,
        selectedEntity,
        trackedEntityAttributes,
        selectedEnrollment,
        selectedOrgUnit,
        optionSets,
        constants,
    }: VariableServiceInput) {
        const eventsContainer = this.structureEvents(executingEvent, otherEvents);

        const sourceData = {
            executingEvent,
            eventsContainer,
            dataElements,
            selectedEntity,
            trackedEntityAttributes,
            selectedEnrollment,
            optionSets,
            selectedOrgUnit,
        };

        const variables = (programRuleVariables ?? []).reduce((accVariables, programVariable) => {
            let variable;
            const variableKey = programVariable.displayName;

            const sourceType = programVariable.programRuleVariableSourceType;
            const getterFn = this.mapSourceTypeToGetterFn[sourceType];
            if (!getterFn) {
                log.error(`Unknown programRuleVariableSourceType:${programVariable.programRuleVariableSourceType}`);
                variable = this.buildVariable(
                    null,
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
                    // $FlowFixMe[incompatible-call] automated comment
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
        const variablesWithContextAndConstantVariables = { ...variablesWithContextVariables, ...this.getConstantVariables(constants) };

        return variablesWithContextAndConstantVariables;
    }

    updateVariable(variableToAssign: string, data: any, variablesHash: RuleVariables) {
        const variableHashKey = variableToAssign.replace('#{', '').replace('A{', '').replace(/}/g, '');
        const variableHash = variablesHash[variableHashKey];

        if (!variableHash) {
            // If a variable is mentioned in the content of the rule, but does not exist in the variables hash, show a warning:
            log.warn(`Variable ${variableHashKey} was not defined.`);
        } else {
            const { variableType } = variableHash;
            const variableValue = data === null ? this.defaultValues[variableType] : normalizeRuleVariable(data, variableType);

            variablesHash[variableHashKey] = {
                ...variableHash,
                variableValue,
                hasValue: data !== null,
                variableEventDate: '',
                variablePrefix: variableHash.variablePrefix || '#',
                allValues: [variableValue],
            };
        }
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
        return {
            variableValue: value ?? this.defaultValues[type],
            useCodeForOptionSet: !useNameForOptionSet,
            variableType: type || typeKeys.TEXT,
            hasValue: value !== null,
            variableEventDate,
            variablePrefix,
            allValues,
        };
    }

    preCheckDataElementSpecificSourceType(programVariable: ProgramRuleVariable, dataElements: ?DataElements) {
        const dataElementId = programVariable.dataElementId;
        const dataElement = dataElementId && dataElements && dataElements[dataElementId];
        if (!dataElement) {
            log.warn(`Variable id:${programVariable.id} name:${programVariable.displayName} contains an invalid dataelement id (id: ${dataElementId || ''})`);
            return this.buildVariable(
                null,
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
                null,
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
        // $FlowFixMe[incompatible-type] automated comment
        const dataElement: DataElement = dataElements[dataElementId];
        return this.buildVariable(
            null,
            dataElement.valueType, {
                variablePrefix: variablePrefixes.DATAELEMENT,
                useNameForOptionSet: programVariable.useNameForOptionSet,
            },
        );
    }

    getVariableValue(
        rawValue: any,
        valueType: string,
        dataElementId: string,
        useNameForOptionSet: ?boolean,
        dataElements: ?DataElements | ?TrackedEntityAttributes,
        optionSets: OptionSets,
    ) {
        const value = this.onProcessValue(rawValue, valueType);
        return (value !== null && useNameForOptionSet && dataElements && dataElements[dataElementId] && dataElements[dataElementId].optionSetId) ?
            OptionSetHelper.getName(optionSets[dataElements[dataElementId].optionSetId].options, value, dataElements[dataElementId].valueType) :
            value;
    }

    getVariableForCalculatedValue(programVariable: ProgramRuleVariable): ?RuleVariable {
        return this.buildVariable(
            null,
            programVariable.valueType, {
                variablePrefix: variablePrefixes.CALCULATED_VALUE,
                useNameForOptionSet: programVariable.useNameForOptionSet,
            },
        );
    }

    getVariableForSelectedEntityAttributes(
        programVariable: ProgramRuleVariable,
        sourceData: SourceData): ?RuleVariable {
        // $FlowFixMe[incompatible-type] automated comment
        const trackedEntityAttributeId: string = programVariable.trackedEntityAttributeId;
        // $FlowFixMe[incompatible-use] automated comment
        const attribute: TrackedEntityAttribute = sourceData.trackedEntityAttributes[trackedEntityAttributeId];
        const attributeValue = sourceData.selectedEntity ? sourceData.selectedEntity[trackedEntityAttributeId] : null;
        const valueType = (programVariable.useNameForOptionSet && attribute.optionSetId) ? 'TEXT' : attribute.valueType;
        const value = this.getVariableValue(
            attributeValue,
            valueType,
            trackedEntityAttributeId,
            programVariable.useNameForOptionSet,
            sourceData.trackedEntityAttributes,
            sourceData.optionSets,
        );

        return this.buildVariable(
            value,
            valueType, {
                variablePrefix: variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
                useNameForOptionSet: programVariable.useNameForOptionSet,
            },
        );
    }

    getVariableForCurrentEvent(programVariable: ProgramRuleVariable, sourceData: SourceData): ?RuleVariable {
        // $FlowFixMe[incompatible-type] automated comment
        const dataElementId: string = programVariable.dataElementId;
        // $FlowFixMe[incompatible-use] automated comment
        const dataElement: DataElement = sourceData.dataElements[dataElementId];
        const executingEvent = sourceData.executingEvent;
        if (!executingEvent) {
            return null;
        }

        const dataElementValue = executingEvent && executingEvent[dataElementId];
        const valueType = (programVariable.useNameForOptionSet && dataElement.optionSetId) ? 'TEXT' : dataElement.valueType;
        const value = this.getVariableValue(
            dataElementValue,
            valueType,
            dataElementId,
            programVariable.useNameForOptionSet,
            sourceData.dataElements,
            sourceData.optionSets,
        );

        return this.buildVariable(
            value,
            valueType, {
                variablePrefix: variablePrefixes.DATAELEMENT,
                variableEventDate: this.onProcessValue(executingEvent.occurredAt, typeKeys.DATE),
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

        return this.getVariableContainingAllValues(programVariable, sourceData, stageEvents);
    }

    getVariableForNewestEventProgram(programVariable: ProgramRuleVariable, sourceData: SourceData): ?RuleVariable {
        const events = sourceData.eventsContainer && sourceData.eventsContainer.all;
        if (!events || events.length === 0) {
            return null;
        }

        return this.getVariableContainingAllValues(programVariable, sourceData, events);
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

        return this.getVariableContainingAllValues(programVariable, sourceData, events.slice(0, currentEventIndex));
    }

    getVariableContainingAllValues(programVariable: ProgramRuleVariable, sourceData: SourceData, events: EventsData): ?RuleVariable {
        // $FlowFixMe[incompatible-type] automated comment
        const dataElementId: string = programVariable.dataElementId;
        // $FlowFixMe[incompatible-use] automated comment
        const dataElement: DataElement = sourceData.dataElements[dataElementId];

        const valueType = (programVariable.useNameForOptionSet && dataElement.optionSetId) ? 'TEXT' : dataElement.valueType;
        const allValues = events
            .map(event =>
                this.getVariableValue(event[dataElementId], valueType, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets),
            )
            .filter(value => value !== null);

        const clonedEvents = [...events];
        const reversedEvents = clonedEvents.reverse();

        const eventWithValue = reversedEvents.find((event) => {
            const value = this.getVariableValue(
                event[dataElementId],
                valueType,
                dataElementId,
                programVariable.useNameForOptionSet,
                sourceData.dataElements,
                sourceData.optionSets,
            );
            return value !== null;
        });

        if (!eventWithValue) {
            return null;
        }

        const value = this.getVariableValue(
            eventWithValue[dataElementId],
            valueType,
            dataElementId,
            programVariable.useNameForOptionSet,
            sourceData.dataElements,
            sourceData.optionSets,
        );

        return this.buildVariable(
            value,
            valueType, {
                variablePrefix: variablePrefixes.DATAELEMENT,
                variableEventDate: this.onProcessValue(eventWithValue.occurredAt, typeKeys.DATE),
                useNameForOptionSet: programVariable.useNameForOptionSet,
                allValues,
            },
        );
    }

    buildContextVariable(rawValue: any, valueType: string, params: any = {}) {
        params.variablePrefix = variablePrefixes.CONTEXT_VARIABLE;
        return this.buildVariable(
            this.onProcessValue(rawValue, valueType),
            valueType,
            params,
        );
    }

    buildRawContextVariable(value: any, valueType: string) {
        return this.buildVariable(
            value,
            valueType, {
                variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
            },
        );
    }

    getContextVariables(sourceData: SourceData): RuleVariables {
        let variables = {};

        variables.environment = this.buildRawContextVariable(this.environment, typeKeys.TEXT);
        variables.current_date = this.buildRawContextVariable(VariableService.dateUtils.getToday(), typeKeys.DATE);
        variables = {
            ...variables,
            ...this.getEventContextVariables(sourceData.executingEvent, sourceData.eventsContainer),
            ...this.getEnrollmentContextVariables(sourceData.selectedEnrollment),
            ...this.getOrganisationContextVariables(sourceData.selectedOrgUnit),
        };

        return variables;
    }

    getEventContextVariables(executingEvent: ?EventData, eventsContainer: ?EventsDataContainer) {
        const variables = {};

        if (executingEvent) {
            variables.event_date = this.buildContextVariable(executingEvent.occurredAt, typeKeys.DATE);
            variables.due_date = this.buildContextVariable(executingEvent.scheduledAt, typeKeys.DATE);
            variables.completed_date = this.buildContextVariable(executingEvent.completedAt, typeKeys.DATE);

            variables.event_id = this.buildContextVariable(
                executingEvent.eventId,
                typeKeys.TEXT, {
                    variableEventDate: this.onProcessValue(executingEvent.occurredAt, typeKeys.DATE),
                },
            );

            variables.event_status = this.buildContextVariable(executingEvent.status, typeKeys.TEXT);
            variables.program_stage_id = this.buildContextVariable(executingEvent.programStageId, typeKeys.TEXT);
            variables.program_stage_name = this.buildContextVariable(executingEvent.programStageName, typeKeys.TEXT);
        }

        if (eventsContainer) {
            variables.event_count = this.buildRawContextVariable((eventsContainer.all && eventsContainer.all.length) || 0, typeKeys.INTEGER);
        }

        return variables;
    }

    getEnrollmentContextVariables(selectedEnrollment: ?Enrollment) {
        const variables = {};

        if (selectedEnrollment) {
            variables.enrollment_date = this.buildContextVariable(selectedEnrollment.enrolledAt, typeKeys.DATE);
            variables.enrollment_id = this.buildContextVariable(selectedEnrollment.enrollmentId, typeKeys.TEXT);
            variables.enrollment_count = this.buildRawContextVariable(1, typeKeys.INTEGER);
            variables.tei_count = this.buildRawContextVariable(1, typeKeys.INTEGER);
            variables.incident_date = this.buildContextVariable(selectedEnrollment.occurredAt, typeKeys.DATE);
        }

        return variables;
    }

    getOrganisationContextVariables(orgUnit: OrgUnit) {
        const variables = {};
        variables.orgunit_code = this.buildContextVariable(orgUnit?.code, typeKeys.TEXT);
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
