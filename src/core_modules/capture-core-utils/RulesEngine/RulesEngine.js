// @flow
import VariableService from './VariableService/VariableService';
import ValueProcessor from './ValueProcessor/ValueProcessor';
import getExecutionService from './executionService/executionService';
import processTypes from './rulesEffectsProcessor/processTypes.const';
import inputValueConverter from './converters/inputValueConverter';
import type {
    OutputEffect,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    IMomentConverter,
    ProgramRulesContainer,
    EventData,
    EventsData,
    DataElements,
    OrgUnit,
    OptionSets,
    TrackedEntityAttributes,
    Enrollment,
    ProgramRuleEffect,
    EventsDataContainer,
    TEIValues,
} from './rulesEngine.types';

type ExecutionService = {
  getEffects: (
  programRules: ?Array<ProgramRule>,
  dataElements: ?DataElements,
  trackedEntityAttributes: ?TrackedEntityAttributes,
  variablesHash: RuleVariables,
  processType: string,
  flag: ?{ debug: boolean },
) => ?Array<OutputEffect>
};

export default class RulesEngine {
  executionService: ExecutionService;
  variableService: VariableService;

  constructor() {
      const valueProcessor = new ValueProcessor(inputValueConverter);
      this.variableService = new VariableService(valueProcessor.processValue);
      this.executionService = getExecutionService(this.variableService);
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

      return this.executionService.getEffects(
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

      return this.executionService.getEffects(programRules, dataElements, null, variablesHash, processTypes.EVENT);
  }
}
