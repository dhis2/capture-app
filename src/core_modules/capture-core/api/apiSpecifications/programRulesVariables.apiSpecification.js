// @flow
import isDefined from 'd2-utilizr/lib/isDefined';

import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

import type { ProgramRuleVariable } from '../../RulesEngine/rulesEngine.types';

export default new ApiSpecification((o) => {
    o.modelName = 'programRuleVariables';
    o.modelGetterType = getterTypes.LIST;
    o.queryParams = {
        fields: 'id,displayName,programRuleVariableSourceType,program[id],programStage[id],dataElement[id],trackedEntityAttribute[id],useCodeForOptionSet',
        filter: 'program.id:in:',
    };
    o.converter = (d2ProgramRulesVariables: ?Array<Object>): ?Array<ProgramRuleVariable> => {
        if (!d2ProgramRulesVariables || d2ProgramRulesVariables.length === 0) {
            return null;
        }

        return d2ProgramRulesVariables.map(d2RuleVariable => ({
            id: d2RuleVariable.id,
            dataElementId: d2RuleVariable.dataElement && d2RuleVariable.dataElement.id,
            trackedEntityAttributeId: d2RuleVariable.trackedEntityAttribute && d2RuleVariable.trackedEntityAttribute.id,
            displayName: d2RuleVariable.displayName,
            programId: d2RuleVariable.program && d2RuleVariable.program.id,
            programStageId: d2RuleVariable.programStage && d2RuleVariable.programStage.id,
            programRuleVariableSourceType: d2RuleVariable.programRuleVariableSourceType,
            useNameForOptionSet: isDefined(d2RuleVariable.useCodeForOptionSet) ? !d2RuleVariable.useCodeForOptionSet : false,
        }));
    };
});
