import log from 'loglevel';
import { OptionSetHelper } from '../../helpers/OptionSetHelper';
import { typeKeys } from '../../constants';
import { variablePrefixes } from './variablePrefixes.const';
import { getStructureEvents } from './helpers';
const variableSourceTypesDataElementSpecific = {
  DATAELEMENT_CURRENT_EVENT: 'DATAELEMENT_CURRENT_EVENT',
  DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE: 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE',
  DATAELEMENT_NEWEST_EVENT_PROGRAM: 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
  DATAELEMENT_PREVIOUS_EVENT: 'DATAELEMENT_PREVIOUS_EVENT'
};
const variableSourceTypesTrackedEntitySpecific = {
  TEI_ATTRIBUTE: 'TEI_ATTRIBUTE'
};
export const variableSourceTypes = { ...variableSourceTypesDataElementSpecific,
  ...variableSourceTypesTrackedEntitySpecific,
  CALCULATED_VALUE: 'CALCULATED_VALUE'
};
const EMPTY_STRING = '';
export class VariableService {
  static getDataElementValueForVariable(value, dataElementId, useNameForOptionSet, dataElements, optionSets) {
    const hasValue = !!value || value === 0 || value === false;
    return hasValue && useNameForOptionSet && dataElements && dataElements[dataElementId] && dataElements[dataElementId].optionSetId ? OptionSetHelper.getName(optionSets[dataElements[dataElementId].optionSetId].options, value) : value;
  }

  static getTrackedEntityValueForVariable(value, trackedEntityAttributeId, useNameForOptionSet, trackedEntityAttributes, optionSets) {
    const hasValue = !!value || value === 0 || value === false;
    return hasValue && useNameForOptionSet && trackedEntityAttributes && trackedEntityAttributes[trackedEntityAttributeId] && trackedEntityAttributes[trackedEntityAttributeId].optionSetId ? OptionSetHelper.getName(optionSets[trackedEntityAttributes[trackedEntityAttributeId].optionSetId].options, value) : value;
  }

  constructor(onProcessValue, dateUtils, environment) {
    this.environment = environment;
    this.onProcessValue = onProcessValue;
    VariableService.dateUtils = dateUtils;
    this.mapSourceTypeToGetterFn = {
      [variableSourceTypes.DATAELEMENT_CURRENT_EVENT]: this.getVariableForCurrentEvent,
      [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM]: this.getVariableForNewestEventProgram,
      [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE]: this.getVariableForNewestEventProgramStage,
      [variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT]: this.getVariableForPreviousEventProgram,
      [variableSourceTypes.TEI_ATTRIBUTE]: this.getVariableForSelectedEntityAttributes,
      [variableSourceTypes.CALCULATED_VALUE]: this.getVariableForCalculatedValue
    };
    this.structureEvents = getStructureEvents(dateUtils.compareDates);
  }

  getVariables(_ref) {
    let {
      programRuleVariables,
      currentEvent: executingEvent,
      otherEvents,
      dataElements,
      selectedEntity,
      trackedEntityAttributes,
      selectedEnrollment,
      selectedOrgUnit,
      optionSets,
      constants
    } = _ref;
    const eventsContainer = this.structureEvents(executingEvent, otherEvents);
    const sourceData = {
      executingEvent,
      eventsContainer,
      dataElements,
      selectedEntity,
      trackedEntityAttributes,
      selectedEnrollment,
      optionSets,
      selectedOrgUnit
    };
    const variables = (programRuleVariables !== null && programRuleVariables !== void 0 ? programRuleVariables : []).reduce((accVariables, programVariable) => {
      let variable;
      const variableKey = programVariable.displayName;
      const sourceType = programVariable.programRuleVariableSourceType;
      const getterFn = this.mapSourceTypeToGetterFn[sourceType];

      if (!getterFn) {
        log.error("Unknown programRuleVariableSourceType:".concat(programVariable.programRuleVariableSourceType));
        variable = this.buildVariable(EMPTY_STRING, typeKeys.TEXT, {
          variablePrefix: variablePrefixes.DATAELEMENT,
          useNameForOptionSet: programVariable.useNameForOptionSet
        });
        accVariables[variableKey] = variable;
        return accVariables;
      } // execute prechecks


      if (variableSourceTypesDataElementSpecific[sourceType]) {
        variable = this.preCheckDataElementSpecificSourceType(programVariable, dataElements);
      } else if (variableSourceTypesTrackedEntitySpecific[sourceType]) {
        variable = this.preCheckTrackedEntitySpecificSourceType(programVariable, trackedEntityAttributes);
      }

      if (variable) {
        accVariables[variableKey] = variable;
        return accVariables;
      } // run main builder


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
    }, {}); // add context variables

    const variablesWithContextVariables = { ...variables,
      ...this.getContextVariables(sourceData)
    }; // add constant variables

    const variablesWithContextAndConstantVariables = { ...variablesWithContextVariables,
      ...this.getConstantVariables(constants)
    };
    return variablesWithContextAndConstantVariables;
  }

  buildVariable(value, type, _ref2) {
    let {
      variablePrefix,
      allValues,
      variableEventDate,
      useNameForOptionSet = false
    } = _ref2;
    const processedAllValues = allValues ? allValues.map(alternateValue => this.onProcessValue(alternateValue, type)) : null;
    return {
      variableValue: this.onProcessValue(value, type),
      useCodeForOptionSet: !useNameForOptionSet,
      variableType: type || typeKeys.TEXT,
      hasValue: !!value || value === 0 || value === false,
      variableEventDate: this.onProcessValue(variableEventDate, typeKeys.DATE),
      variablePrefix,
      allValues: processedAllValues
    };
  }

  preCheckDataElementSpecificSourceType(programVariable, dataElements) {
    const dataElementId = programVariable.dataElementId;
    const dataElement = dataElementId && dataElements && dataElements[dataElementId];

    if (!dataElement) {
      log.warn("Variable id:".concat(programVariable.id, " name:").concat(programVariable.displayName, " contains an invalid dataelement id (id: ").concat(dataElementId || '', ")"));
      return this.buildVariable(EMPTY_STRING, typeKeys.TEXT, {
        variablePrefix: variablePrefixes.DATAELEMENT,
        useNameForOptionSet: programVariable.useNameForOptionSet
      });
    }

    return null;
  }

  preCheckTrackedEntitySpecificSourceType(programVariable, trackedEntityAttributes) {
    const attributeId = programVariable.trackedEntityAttributeId;
    const attribute = attributeId && trackedEntityAttributes && trackedEntityAttributes[attributeId];

    if (!attribute) {
      log.warn("Variable id:".concat(programVariable.id, " name:").concat(programVariable.displayName, " contains an invalid trackedEntityAttribute id (id: ").concat(attributeId || '', ")"));
      return this.buildVariable(EMPTY_STRING, typeKeys.TEXT, {
        variablePrefix: variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
        useNameForOptionSet: programVariable.useNameForOptionSet
      });
    }

    return null;
  }

  postGetVariableForDataElementSpecificSourceType(programVariable, dataElements) {
    const dataElementId = programVariable.dataElementId; // $FlowFixMe[incompatible-type] automated comment

    const dataElement = dataElements[dataElementId];
    return this.buildVariable(EMPTY_STRING, dataElement.valueType, {
      variablePrefix: variablePrefixes.DATAELEMENT,
      useNameForOptionSet: programVariable.useNameForOptionSet
    });
  }

  getVariableForCalculatedValue(programVariable) {
    return this.buildVariable(EMPTY_STRING, programVariable.valueType, {
      variablePrefix: variablePrefixes.CALCULATED_VALUE,
      useNameForOptionSet: programVariable.useNameForOptionSet
    });
  }

  getVariableForSelectedEntityAttributes(programVariable, sourceData) {
    // $FlowFixMe[incompatible-type] automated comment
    const trackedEntityAttributeId = programVariable.trackedEntityAttributeId; // $FlowFixMe[incompatible-use] automated comment

    const attribute = sourceData.trackedEntityAttributes[trackedEntityAttributeId];
    const attributeValue = sourceData.selectedEntity ? sourceData.selectedEntity[trackedEntityAttributeId] : null;
    const valueType = programVariable.useNameForOptionSet && attribute.optionSetId ? 'TEXT' : attribute.valueType;
    const hasValue = !!attributeValue || attributeValue === 0 || attributeValue === false;

    if (!hasValue) {
      return this.buildVariable(EMPTY_STRING, valueType, {
        variablePrefix: variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
        useNameForOptionSet: programVariable.useNameForOptionSet
      });
    }

    const variableValue = VariableService.getTrackedEntityValueForVariable(attributeValue, trackedEntityAttributeId, programVariable.useNameForOptionSet, sourceData.trackedEntityAttributes, sourceData.optionSets);
    return this.buildVariable(variableValue, valueType, {
      variablePrefix: variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
      useNameForOptionSet: programVariable.useNameForOptionSet
    });
  }

  getVariableForCurrentEvent(programVariable, sourceData) {
    // $FlowFixMe[incompatible-type] automated comment
    const dataElementId = programVariable.dataElementId; // $FlowFixMe[incompatible-use] automated comment

    const dataElement = sourceData.dataElements[dataElementId];
    const executingEvent = sourceData.executingEvent;

    if (!executingEvent) {
      return null;
    }

    const dataElementValue = executingEvent && executingEvent[dataElementId];

    if (!dataElementValue && dataElementValue !== 0 && dataElementValue !== false) {
      return null;
    }

    const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
    const valueType = programVariable.useNameForOptionSet && dataElement.optionSetId ? 'TEXT' : dataElement.valueType;
    return this.buildVariable(value, valueType, {
      variablePrefix: variablePrefixes.DATAELEMENT,
      variableEventDate: executingEvent.occurredAt,
      useNameForOptionSet: programVariable.useNameForOptionSet
    });
  }

  getVariableForNewestEventProgramStage(programVariable, sourceData) {
    const programStageId = programVariable.programStageId;

    if (!programStageId) {
      log.warn("Variable id:".concat(programVariable.id, " name:").concat(programVariable.displayName, " does not have a programstage defined, despite that the variable has sourcetype").concat(programVariable.programRuleVariableSourceType));
      return null;
    }

    const stageEvents = sourceData.eventsContainer && sourceData.eventsContainer.byStage[programStageId];

    if (!stageEvents) {
      return null;
    } // $FlowFixMe[incompatible-type] automated comment


    const dataElementId = programVariable.dataElementId; // $FlowFixMe[incompatible-use] automated comment

    const dataElement = sourceData.dataElements[dataElementId];
    const allValues = stageEvents.map(event => VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets)).filter(value => !!value || value === false || value === 0);
    const clonedEvents = [...stageEvents];
    const reversedEvents = clonedEvents.reverse();
    const eventWithValue = reversedEvents.find(event => {
      const dataElementValue = event[dataElementId];
      return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
    });

    if (!eventWithValue) {
      return null;
    }

    const dataElementValue = eventWithValue[dataElementId];
    const valueType = programVariable.useNameForOptionSet && dataElement.optionSetId ? 'TEXT' : dataElement.valueType;
    const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
    return this.buildVariable(value, valueType, {
      variablePrefix: variablePrefixes.DATAELEMENT,
      variableEventDate: eventWithValue.occurredAt,
      useNameForOptionSet: programVariable.useNameForOptionSet,
      allValues
    });
  }

  getVariableForNewestEventProgram(programVariable, sourceData) {
    const events = sourceData.eventsContainer && sourceData.eventsContainer.all;

    if (!events || events.length === 0) {
      return null;
    } // $FlowFixMe[incompatible-type] automated comment


    const dataElementId = programVariable.dataElementId; // $FlowFixMe[incompatible-use] automated comment

    const dataElement = sourceData.dataElements[dataElementId];
    const allValues = events.map(event => VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets)).filter(value => !!value || value === false || value === 0);
    const clonedEvents = [...events];
    const reversedEvents = clonedEvents.reverse();
    const eventWithValue = reversedEvents.find(event => {
      const dataElementValue = event[dataElementId];
      return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
    });

    if (!eventWithValue) {
      return null;
    }

    const dataElementValue = eventWithValue[dataElementId];
    const valueType = programVariable.useNameForOptionSet && dataElement.optionSetId ? 'TEXT' : dataElement.valueType;
    const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
    return this.buildVariable(value, valueType, {
      variablePrefix: variablePrefixes.DATAELEMENT,
      variableEventDate: eventWithValue.occurredAt,
      useNameForOptionSet: programVariable.useNameForOptionSet,
      allValues
    });
  }

  getVariableForPreviousEventProgram(programVariable, sourceData) {
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
    } // $FlowFixMe[incompatible-type] automated comment


    const dataElementId = programVariable.dataElementId; // $FlowFixMe[incompatible-use] automated comment

    const dataElement = sourceData.dataElements[dataElementId];
    const previousEvents = events.slice(0, currentEventIndex);
    const allValues = previousEvents.map(event => VariableService.getDataElementValueForVariable(event[dataElementId], dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets)).filter(value => !!value || value === false || value === 0);
    const clonedEvents = [...previousEvents];
    const reversedEvents = clonedEvents.reverse();
    const eventWithValue = reversedEvents.find(event => {
      const dataElementValue = event[dataElementId];
      return !!dataElementValue || dataElementValue === 0 || dataElementValue === false;
    });

    if (!eventWithValue) {
      return null;
    }

    const dataElementValue = eventWithValue[dataElementId];
    const valueType = programVariable.useNameForOptionSet && dataElement.optionSetId ? 'TEXT' : dataElement.valueType;
    const value = VariableService.getDataElementValueForVariable(dataElementValue, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
    return this.buildVariable(value, valueType, {
      variablePrefix: variablePrefixes.DATAELEMENT,
      variableEventDate: eventWithValue.occurredAt,
      useNameForOptionSet: programVariable.useNameForOptionSet,
      allValues
    });
  }

  getContextVariables(sourceData) {
    let variables = {};
    variables.environment = this.buildVariable(this.environment, typeKeys.TEXT, {
      variablePrefix: variablePrefixes.CONTEXT_VARIABLE
    });
    variables.current_date = this.buildVariable(VariableService.dateUtils.getToday(), typeKeys.DATE, {
      variablePrefix: variablePrefixes.CONTEXT_VARIABLE
    });
    variables = { ...variables,
      ...this.getEventContextVariables(sourceData.executingEvent, sourceData.eventsContainer),
      ...this.getEnrollmentContextVariables(sourceData.selectedEnrollment),
      ...this.getOrganisationContextVariables(sourceData.selectedOrgUnit)
    };
    return variables;
  }

  getEventContextVariables(executingEvent, eventsContainer) {
    const variables = {};

    if (executingEvent) {
      variables.event_date = this.buildVariable(executingEvent.occurredAt, typeKeys.DATE, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.due_date = this.buildVariable(executingEvent.scheduledAt, typeKeys.DATE, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.completed_date = this.buildVariable(executingEvent.completedAt, typeKeys.DATE, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.event_id = this.buildVariable(executingEvent.eventId, typeKeys.TEXT, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE,
        variableEventDate: executingEvent.occurredAt
      });
      variables.event_status = this.buildVariable(executingEvent.status, typeKeys.TEXT, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.program_stage_id = this.buildVariable(executingEvent.programStageId, typeKeys.TEXT, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.program_stage_name = this.buildVariable(executingEvent.programStageName, typeKeys.TEXT, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
    }

    if (eventsContainer) {
      variables.event_count = this.buildVariable(eventsContainer.all && eventsContainer.all.length || 0, typeKeys.INTEGER, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
    }

    return variables;
  }

  getEnrollmentContextVariables(selectedEnrollment) {
    const variables = {};

    if (selectedEnrollment) {
      variables.enrollment_date = this.buildVariable(selectedEnrollment.enrolledAt, typeKeys.DATE, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.enrollment_id = this.buildVariable(selectedEnrollment.enrollmentId, typeKeys.TEXT, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.enrollment_count = this.buildVariable(1, typeKeys.INTEGER, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.tei_count = this.buildVariable(1, typeKeys.INTEGER, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
      variables.incident_date = this.buildVariable(selectedEnrollment.occurredAt, typeKeys.DATE, {
        variablePrefix: variablePrefixes.CONTEXT_VARIABLE
      });
    }

    return variables;
  }

  getOrganisationContextVariables(orgUnit) {
    const variables = {};
    variables.orgunit_code = this.buildVariable( // $FlowFixMe[prop-missing] automated comment
    orgUnit === null || orgUnit === void 0 ? void 0 : orgUnit.code, typeKeys.TEXT, {
      variablePrefix: variablePrefixes.CONTEXT_VARIABLE
    });
    return variables;
  }

  getConstantVariables(constants) {
    const constantVariables = constants ? constants.reduce((accConstantVariables, constant) => {
      accConstantVariables[constant.id] = this.buildVariable(constant.value, typeKeys.INTEGER, {
        variablePrefix: variablePrefixes.CONSTANT_VARIABLE
      });
      return accConstantVariables;
    }, {}) : {};
    return constantVariables;
  }

}