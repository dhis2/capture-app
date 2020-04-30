// @flow
import VariableService from './VariableService/VariableService';
import ValueProcessor from './ValueProcessor/ValueProcessor';
import getExecutionService from './executionService/executionService';
import getDateUtils from './dateUtils/dateUtils';
import processTypes from './rulesEffectsProcessor/processTypes.const';
import type {
    OutputEffect,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    IMomentConverter,
    ProgramRulesContainer,
    EventData,
    DataElements,
    OrgUnit,
    OptionSets,
    TrackedEntityAttributes,
    Enrollment,
    EventsDataContainer,
    TEIValues,
    ProgramRule,
    RuleVariables,
    ProgramRuleEffect,
} from './rulesEngine.types';

type ExecutionService = {
    getEffects: (
      programRules: ?Array<ProgramRule>,
      dataElements: ?DataElements,
      trackedEntityAttributes: ?TrackedEntityAttributes,
      variablesHash: RuleVariables,
      processType: string,
      flag: ?{ debug: boolean },
    ) => ?Array<ProgramRuleEffect>,
    convertDataToBaseOutputValue: (data: any, valueType: string) => any,
};

export default class RulesEngine {
  executionService: ExecutionService;
  variableService: VariableService;
  dateUtils: any;
  outputRulesConverterObject: any;

  constructor(
      inputConverterObject: IConvertInputRulesValue,
      momentConverter: IMomentConverter,
      outputRulesConverterObject: IConvertOutputRulesEffectsValue,
  ) {
      const valueProcessor = new ValueProcessor(inputConverterObject);

      this.dateUtils = getDateUtils(momentConverter);
      this.outputRulesConverterObject = outputRulesConverterObject;

      this.variableService = new VariableService(valueProcessor.processValue, this.dateUtils);
  }

  executeTEIRules(
      programRulesContainer: ProgramRulesContainer,
      enrollmentData: ?Enrollment,
      teiValues: ?TEIValues,
      trackedEntityAttributes: ?TrackedEntityAttributes,
      selectedOrgUnit: OrgUnit,
      optionSets: OptionSets,
  ): ?Array<OutputEffect> {
      const variablesHash = this.variableService.getVariables(
          programRulesContainer,
          null,
          null,
          null,
          trackedEntityAttributes,
          teiValues,
          enrollmentData,
          selectedOrgUnit,
          optionSets,
      );
      const { programRules } = programRulesContainer;

      const dhisUtilities = dhisFunctions(this.dateUtils, this.variableService, variablesHash);
      const executionService = getExecutionService(this.outputRulesConverterObject, dhisUtilities);

      return executionService.getEffects(
          programRules,
          null,
          trackedEntityAttributes,
          variablesHash,
          processTypes.TEI,
      );
  }

  executeEventRules(
      programRulesContainer: ProgramRulesContainer,
      events: Events,
      dataElements: ?DataElements,
      selectedOrgUnit: OrgUnit,
      optionSets: OptionSets,
  ): ?Array<OutputEffect> {
      const { allEvents, currentEvent } = events;
      const { programRules, constants, programRulesVariables } = programRulesContainer;
      const variablesHash = this.variableService.getVariables(
          { constants, programRulesVariables },
          currentEvent,
          allEvents,
          dataElements,
          null,
          null,
          null,
          selectedOrgUnit,
          optionSets,
      );


      const dhisUtilities = dhisFunctions(this.dateUtils, this.variableService, variablesHash);
      const executionService = getExecutionService(this.outputRulesConverterObject, dhisUtilities);

      return executionService.getEffects(programRules, dataElements, null, variablesHash, processTypes.EVENT);
  }
}
