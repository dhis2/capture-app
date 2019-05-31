// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

import type { ProgramRuleAction, ProgramRule } from '../../RulesEngine/rulesEngine.types';

function convertFromCollectionToArray(collection) {
    if (!collection || collection.size === 0) {
        return [];
    }
    return [...collection.toArray()];
}

function getProgramRuleActions(d2ProgramRuleActionsCollection): Array<ProgramRuleAction> {
    const d2ProgramRuleActions = convertFromCollectionToArray(d2ProgramRuleActionsCollection);
    return d2ProgramRuleActions.map(programRuleAction => ({
        id: programRuleAction.id,
        content: programRuleAction.content,
        data: programRuleAction.data,
        location: programRuleAction.location,
        dataElementId: programRuleAction.dataElement && programRuleAction.dataElement.id,
        programRuleActionType: programRuleAction.programRuleActionType,
        programStageId: programRuleAction.programStage && programRuleAction.programStage.id,
        programStageSectionId: programRuleAction.programStageSection && programRuleAction.programStageSection.id,
        trackedEntityAttributeId: programRuleAction.trackedEntityAttribute && programRuleAction.trackedEntityAttribute.id,
        optionGroupId: programRuleAction.optionGroup && programRuleAction.optionGroup.id,
        optionId: programRuleAction.option && programRuleAction.option.id,
    }));
}


export default new ApiSpecification((o) => {
    o.modelName = 'programRules';
    o.modelGetterType = getterTypes.LIST;
    o.queryParams = {
        fields: 'id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],programIndicator[id],programStage[id],optionGroup[id],option[id]]',
        filter: 'program.id:in:',
    };
    o.converter = (d2ProgramRules: ?Array<Object>): ?Array<ProgramRule> => {
        if (!d2ProgramRules || d2ProgramRules.length === 0) {
            return null;
        }

        const programRules = d2ProgramRules.map(d2ProgramRule => ({
            id: d2ProgramRule.id,
            condition: d2ProgramRule.condition,
            description: d2ProgramRule.description,
            displayName: d2ProgramRule.displayName,
            programId: d2ProgramRule.program.id,
            programRuleActions: getProgramRuleActions(d2ProgramRule.programRuleActions),
            priority: d2ProgramRule.priority,
            programStageId: d2ProgramRule.programStage && d2ProgramRule.programStage.id,
        }));

        return programRules;
    };
});
