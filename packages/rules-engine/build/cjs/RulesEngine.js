"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RulesEngine = void 0;

var _loglevel = _interopRequireDefault(require("loglevel"));

var _VariableService = require("./services/VariableService/VariableService");

var _ValueProcessor = require("./processors/ValueProcessor");

var _expressionService = require("./services/expressionService");

var _d2Functions = require("./d2Functions");

var _rulesEffectsProcessor = require("./processors/rulesEffectsProcessor/rulesEffectsProcessor");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RulesEngine {
  constructor(inputConverter, outputConverter, dateUtils, environment) {
    this.inputConverter = inputConverter;
    this.outputConverter = outputConverter;
    const valueProcessor = new _ValueProcessor.ValueProcessor(inputConverter);
    this.variableService = new _VariableService.VariableService(valueProcessor.processValue, dateUtils, environment);
    this.dateUtils = dateUtils;
  }
  /**
  *
  * @param {*} programRulesContainer all program rules and program rule variables
  * @param {*} currentEvent selected event (null if not applicable)
  * @param {*} eventsContainer list of all relevant events, or null
  * @param {*} dataElements all data elements (metadata)
  * @param {*} selectedEntity selected TEI (null if not applicable)
  * @param {*} trackedEntityAttributes all tracked entity attributes (metadata)
  * @param {*} selectedEnrollment selected enrollment (null if not applicable)
  * @param {*} selectedOrgUnit selected OrgUnit
  * @param {*} optionSets all option sets
  */


  getProgramRuleEffects(_ref) {
    let {
      programRulesContainer: {
        programRules,
        programRuleVariables,
        constants
      },
      currentEvent,
      otherEvents,
      dataElements,
      trackedEntityAttributes,
      selectedEntity,
      selectedEnrollment,
      selectedOrgUnit,
      selectedUserRoles,
      optionSets
    } = _ref;
    const variablesHash = this.variableService.getVariables({
      programRuleVariables,
      currentEvent: currentEvent !== null && currentEvent !== void 0 ? currentEvent : undefined,
      otherEvents: otherEvents !== null && otherEvents !== void 0 ? otherEvents : undefined,
      dataElements,
      selectedEntity,
      trackedEntityAttributes,
      selectedEnrollment,
      selectedOrgUnit,
      optionSets,
      constants
    });
    const dhisFunctions = (0, _d2Functions.getD2Functions)({
      dateUtils: this.dateUtils,
      variablesHash,
      selectedOrgUnit,
      selectedUserRoles: selectedUserRoles !== null && selectedUserRoles !== void 0 ? selectedUserRoles : this.userRoles
    });

    if (!programRules) {
      return [];
    }

    const effects = programRules.sort((a, b) => {
      if (!a.priority && !b.priority) {
        return 0;
      }

      if (!a.priority) {
        return 1;
      }

      if (!b.priority) {
        return -1;
      }

      return a.priority - b.priority;
    }) // For every rule there are two bits.
    // The first bit is the "program rule expression" which signifies whether or not the rule's actions are gonna take place
    // The second bit is  the "program rule effects" which defines the actions that need to take place.
    // In the following iteration we first evaluate the "program rule expression" and when this is effective
    // we generate the program rules effects
    .flatMap(rule => {
      let isProgramRuleExpressionEffective = false;
      const {
        condition: expression
      } = rule;

      if (expression) {
        // checks if the rule is effective meaning that the rule results to a truthy expression
        isProgramRuleExpressionEffective = (0, _expressionService.executeExpression)({
          expression,
          dhisFunctions,
          variablesHash,
          onError: (error, injectedExpression) => _loglevel.default.warn("Expression with id rule:".concat(rule.id, " could not be run. ") + "Original condition was: ".concat(expression, " - ") + "Evaluation ended up as:".concat(injectedExpression, " - error message:").concat(error))
        });
      } else {
        _loglevel.default.warn("Rule id:'".concat(rule.id, "' and name:'").concat(rule.displayName, "' ") + 'had no condition specified. Please check rule configuration.');
      }

      let programRuleEffects = [];

      if (isProgramRuleExpressionEffective) {
        programRuleEffects = rule.programRuleActions.map(_ref2 => {
          let {
            data: actionExpression,
            programRuleActionType: action,
            id,
            location,
            dataElementId,
            trackedEntityAttributeId,
            programStageId,
            programStageSectionId,
            optionGroupId,
            optionId,
            content,
            displayContent,
            style
          } = _ref2;
          let actionExpressionResult;

          if (actionExpression) {
            actionExpressionResult = (0, _expressionService.executeExpression)({
              expression: actionExpression,
              dhisFunctions,
              variablesHash,
              onError: (error, injectedExpression) => _loglevel.default.warn("Expression with id rule: action:".concat(id, " could not be run. ") + "Original condition was: ".concat(actionExpression, " - ") + "Evaluation ended up as:".concat(injectedExpression, " - error message:").concat(error))
            });
          }

          if (action === _constants.effectActions.ASSIGN_VALUE && content) {
            // the program rule variable id is found in the content key
            this.variableService.updateVariable(content, actionExpressionResult, variablesHash);
          }

          return {
            data: actionExpressionResult,
            id,
            location,
            action,
            dataElementId,
            trackedEntityAttributeId,
            programStageId,
            programStageSectionId,
            optionGroupId,
            optionId,
            content,
            displayContent,
            style
          };
        });
      }

      return programRuleEffects;
    }).filter(ruleEffects => ruleEffects);
    const processRulesEffects = (0, _rulesEffectsProcessor.getRulesEffectsProcessor)(this.outputConverter);
    return processRulesEffects(effects, dataElements, trackedEntityAttributes);
  }

  setSelectedUserRoles(userRoles) {
    this.userRoles = userRoles;
  }

}

exports.RulesEngine = RulesEngine;