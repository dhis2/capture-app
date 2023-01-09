"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variableSourceTypes = exports.VariableService = void 0;

var _loglevel = _interopRequireDefault(require("loglevel"));

var _OptionSetHelper = require("../../helpers/OptionSetHelper");

var _constants = require("../../constants");

var _variablePrefixes = require("./variablePrefixes.const");

var _helpers = require("./helpers");

var _normalizeRuleVariable = require("../../commonUtils/normalizeRuleVariable");

var _defaultValues = require("./defaultValues");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const variableSourceTypesDataElementSpecific = {
  DATAELEMENT_CURRENT_EVENT: 'DATAELEMENT_CURRENT_EVENT',
  DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE: 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE',
  DATAELEMENT_NEWEST_EVENT_PROGRAM: 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
  DATAELEMENT_PREVIOUS_EVENT: 'DATAELEMENT_PREVIOUS_EVENT'
};
const variableSourceTypesTrackedEntitySpecific = {
  TEI_ATTRIBUTE: 'TEI_ATTRIBUTE'
};
const variableSourceTypes = { ...variableSourceTypesDataElementSpecific,
  ...variableSourceTypesTrackedEntitySpecific,
  CALCULATED_VALUE: 'CALCULATED_VALUE'
};
exports.variableSourceTypes = variableSourceTypes;

class VariableService {
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
    this.defaultValues = _defaultValues.defaultValues;
    this.structureEvents = (0, _helpers.getStructureEvents)(dateUtils.compareDates);
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
        _loglevel.default.error("Unknown programRuleVariableSourceType:".concat(programVariable.programRuleVariableSourceType));

        variable = this.buildVariable(null, _constants.typeKeys.TEXT, {
          variablePrefix: _variablePrefixes.variablePrefixes.DATAELEMENT,
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

  updateVariable(variableToAssign, data, variablesHash) {
    const variableHashKey = variableToAssign.replace('#{', '').replace('A{', '').replace(/}/g, '');
    const variableHash = variablesHash[variableHashKey];

    if (!variableHash) {
      // If a variable is mentioned in the content of the rule, but does not exist in the variables hash, show a warning:
      _loglevel.default.warn("Variable ".concat(variableHashKey, " was not defined."));
    } else {
      const {
        variableType
      } = variableHash;
      const variableValue = data === null ? this.defaultValues[variableType] : (0, _normalizeRuleVariable.normalizeRuleVariable)(data, variableType);
      variablesHash[variableHashKey] = { ...variableHash,
        variableValue,
        hasValue: data !== null,
        variableEventDate: '',
        variablePrefix: variableHash.variablePrefix || '#',
        allValues: [variableValue]
      };
    }
  }

  buildVariable(value, type, _ref2) {
    let {
      variablePrefix,
      allValues,
      variableEventDate,
      useNameForOptionSet = false
    } = _ref2;
    return {
      variableValue: value !== null && value !== void 0 ? value : this.defaultValues[type],
      useCodeForOptionSet: !useNameForOptionSet,
      variableType: type || _constants.typeKeys.TEXT,
      hasValue: value !== null,
      variableEventDate,
      variablePrefix,
      allValues
    };
  }

  preCheckDataElementSpecificSourceType(programVariable, dataElements) {
    const dataElementId = programVariable.dataElementId;
    const dataElement = dataElementId && dataElements && dataElements[dataElementId];

    if (!dataElement) {
      _loglevel.default.warn("Variable id:".concat(programVariable.id, " name:").concat(programVariable.displayName, " contains an invalid dataelement id (id: ").concat(dataElementId || '', ")"));

      return this.buildVariable(null, _constants.typeKeys.TEXT, {
        variablePrefix: _variablePrefixes.variablePrefixes.DATAELEMENT,
        useNameForOptionSet: programVariable.useNameForOptionSet
      });
    }

    return null;
  }

  preCheckTrackedEntitySpecificSourceType(programVariable, trackedEntityAttributes) {
    const attributeId = programVariable.trackedEntityAttributeId;
    const attribute = attributeId && trackedEntityAttributes && trackedEntityAttributes[attributeId];

    if (!attribute) {
      _loglevel.default.warn("Variable id:".concat(programVariable.id, " name:").concat(programVariable.displayName, " contains an invalid trackedEntityAttribute id (id: ").concat(attributeId || '', ")"));

      return this.buildVariable(null, _constants.typeKeys.TEXT, {
        variablePrefix: _variablePrefixes.variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
        useNameForOptionSet: programVariable.useNameForOptionSet
      });
    }

    return null;
  }

  postGetVariableForDataElementSpecificSourceType(programVariable, dataElements) {
    const dataElementId = programVariable.dataElementId; // $FlowFixMe[incompatible-type] automated comment

    const dataElement = dataElements[dataElementId];
    return this.buildVariable(null, dataElement.valueType, {
      variablePrefix: _variablePrefixes.variablePrefixes.DATAELEMENT,
      useNameForOptionSet: programVariable.useNameForOptionSet
    });
  }

  getVariableValue(rawValue, valueType, dataElementId, useNameForOptionSet, dataElements, optionSets) {
    const value = this.onProcessValue(rawValue, valueType);
    return value !== null && useNameForOptionSet && dataElements && dataElements[dataElementId] && dataElements[dataElementId].optionSetId ? _OptionSetHelper.OptionSetHelper.getName(optionSets[dataElements[dataElementId].optionSetId].options, value) : value;
  }

  getVariableForCalculatedValue(programVariable) {
    return this.buildVariable(null, programVariable.valueType, {
      variablePrefix: _variablePrefixes.variablePrefixes.CALCULATED_VALUE,
      useNameForOptionSet: programVariable.useNameForOptionSet
    });
  }

  getVariableForSelectedEntityAttributes(programVariable, sourceData) {
    // $FlowFixMe[incompatible-type] automated comment
    const trackedEntityAttributeId = programVariable.trackedEntityAttributeId; // $FlowFixMe[incompatible-use] automated comment

    const attribute = sourceData.trackedEntityAttributes[trackedEntityAttributeId];
    const attributeValue = sourceData.selectedEntity ? sourceData.selectedEntity[trackedEntityAttributeId] : null;
    const valueType = programVariable.useNameForOptionSet && attribute.optionSetId ? 'TEXT' : attribute.valueType;
    const value = this.getVariableValue(attributeValue, valueType, trackedEntityAttributeId, programVariable.useNameForOptionSet, sourceData.trackedEntityAttributes, sourceData.optionSets);
    return this.buildVariable(value, valueType, {
      variablePrefix: _variablePrefixes.variablePrefixes.TRACKED_ENTITY_ATTRIBUTE,
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
    const valueType = programVariable.useNameForOptionSet && dataElement.optionSetId ? 'TEXT' : dataElement.valueType;
    const value = this.getVariableValue(dataElementValue, valueType, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
    return this.buildVariable(value, valueType, {
      variablePrefix: _variablePrefixes.variablePrefixes.DATAELEMENT,
      variableEventDate: this.onProcessValue(executingEvent.occurredAt, _constants.typeKeys.DATE),
      useNameForOptionSet: programVariable.useNameForOptionSet
    });
  }

  getVariableForNewestEventProgramStage(programVariable, sourceData) {
    const programStageId = programVariable.programStageId;

    if (!programStageId) {
      _loglevel.default.warn("Variable id:".concat(programVariable.id, " name:").concat(programVariable.displayName, " does not have a programstage defined, despite that the variable has sourcetype").concat(programVariable.programRuleVariableSourceType));

      return null;
    }

    const stageEvents = sourceData.eventsContainer && sourceData.eventsContainer.byStage[programStageId];

    if (!stageEvents) {
      return null;
    }

    return this.getVariableContainingAllValues(programVariable, sourceData, stageEvents);
  }

  getVariableForNewestEventProgram(programVariable, sourceData) {
    const events = sourceData.eventsContainer && sourceData.eventsContainer.all;

    if (!events || events.length === 0) {
      return null;
    }

    return this.getVariableContainingAllValues(programVariable, sourceData, events);
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
    }

    return this.getVariableContainingAllValues(programVariable, sourceData, events.slice(0, currentEventIndex));
  }

  getVariableContainingAllValues(programVariable, sourceData, events) {
    // $FlowFixMe[incompatible-type] automated comment
    const dataElementId = programVariable.dataElementId; // $FlowFixMe[incompatible-use] automated comment

    const dataElement = sourceData.dataElements[dataElementId];
    const valueType = programVariable.useNameForOptionSet && dataElement.optionSetId ? 'TEXT' : dataElement.valueType;
    const allValues = events.map(event => this.getVariableValue(event[dataElementId], valueType, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets)).filter(value => value !== null);
    const clonedEvents = [...events];
    const reversedEvents = clonedEvents.reverse();
    const eventWithValue = reversedEvents.find(event => {
      const value = this.getVariableValue(event[dataElementId], valueType, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
      return value !== null;
    });

    if (!eventWithValue) {
      return null;
    }

    const value = this.getVariableValue(eventWithValue[dataElementId], valueType, dataElementId, programVariable.useNameForOptionSet, sourceData.dataElements, sourceData.optionSets);
    return this.buildVariable(value, valueType, {
      variablePrefix: _variablePrefixes.variablePrefixes.DATAELEMENT,
      variableEventDate: this.onProcessValue(eventWithValue.occurredAt, _constants.typeKeys.DATE),
      useNameForOptionSet: programVariable.useNameForOptionSet,
      allValues
    });
  }

  getContextVariables(sourceData) {
    let variables = {};
    variables.environment = this.buildVariable(this.environment, _constants.typeKeys.TEXT, {
      variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
    });
    variables.current_date = this.buildVariable(VariableService.dateUtils.getToday(), _constants.typeKeys.DATE, {
      variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
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
      variables.event_date = this.buildVariable(executingEvent.occurredAt, _constants.typeKeys.DATE, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.due_date = this.buildVariable(executingEvent.scheduledAt, _constants.typeKeys.DATE, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.completed_date = this.buildVariable(executingEvent.completedAt, _constants.typeKeys.DATE, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.event_id = this.buildVariable(executingEvent.eventId, _constants.typeKeys.TEXT, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE,
        variableEventDate: this.onProcessValue(executingEvent.occurredAt, _constants.typeKeys.DATE)
      });
      variables.event_status = this.buildVariable(executingEvent.status, _constants.typeKeys.TEXT, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.program_stage_id = this.buildVariable(executingEvent.programStageId, _constants.typeKeys.TEXT, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.program_stage_name = this.buildVariable(executingEvent.programStageName, _constants.typeKeys.TEXT, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
    }

    if (eventsContainer) {
      variables.event_count = this.buildVariable(eventsContainer.all && eventsContainer.all.length || 0, _constants.typeKeys.INTEGER, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
    }

    return variables;
  }

  getEnrollmentContextVariables(selectedEnrollment) {
    const variables = {};

    if (selectedEnrollment) {
      variables.enrollment_date = this.buildVariable(selectedEnrollment.enrolledAt, _constants.typeKeys.DATE, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.enrollment_id = this.buildVariable(selectedEnrollment.enrollmentId, _constants.typeKeys.TEXT, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.enrollment_count = this.buildVariable(1, _constants.typeKeys.INTEGER, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.tei_count = this.buildVariable(1, _constants.typeKeys.INTEGER, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
      variables.incident_date = this.buildVariable(selectedEnrollment.occurredAt, _constants.typeKeys.DATE, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
      });
    }

    return variables;
  }

  getOrganisationContextVariables(orgUnit) {
    const variables = {};
    variables.orgunit_code = this.buildVariable( // $FlowFixMe[prop-missing] automated comment
    orgUnit === null || orgUnit === void 0 ? void 0 : orgUnit.code, _constants.typeKeys.TEXT, {
      variablePrefix: _variablePrefixes.variablePrefixes.CONTEXT_VARIABLE
    });
    return variables;
  }

  getConstantVariables(constants) {
    const constantVariables = constants ? constants.reduce((accConstantVariables, constant) => {
      accConstantVariables[constant.id] = this.buildVariable(constant.value, _constants.typeKeys.INTEGER, {
        variablePrefix: _variablePrefixes.variablePrefixes.CONSTANT_VARIABLE
      });
      return accConstantVariables;
    }, {}) : {};
    return constantVariables;
  }

}

exports.VariableService = VariableService;