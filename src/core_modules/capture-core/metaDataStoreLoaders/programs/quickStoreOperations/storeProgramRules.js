// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

const convert = (() => {
    const getProgramRuleActions = (apiProgramRuleActions) => {
        const getClearProps = () => ({
            programStageSection: undefined,
            programStage: undefined,
            dataElement: undefined,
            trackedEntityAttribute: undefined,
            optionGroup: undefined,
            option: undefined,
        });

        const getProgramStageSectionId = d2ProgramRuleAction =>
            d2ProgramRuleAction.programStageSection && d2ProgramRuleAction.programStageSection.id;
        const getProgramStageId = d2ProgramRuleAction =>
            d2ProgramRuleAction.programStage && d2ProgramRuleAction.programStage.id;
        const getDataElementId = d2ProgramRuleAction =>
            d2ProgramRuleAction.dataElement && d2ProgramRuleAction.dataElement.id;
        const getTrackedEntityAttributeId = d2ProgramRuleAction =>
            d2ProgramRuleAction.trackedEntityAttribute && d2ProgramRuleAction.trackedEntityAttribute.id;
        const getOptionGroupId = d2ProgramRuleAction =>
            d2ProgramRuleAction.optionGroup && d2ProgramRuleAction.optionGroup.id;
        const getOptionId = d2ProgramRuleAction =>
            d2ProgramRuleAction.option && d2ProgramRuleAction.option.id;

        return apiProgramRuleActions.map(apiProgramRuleAction => ({
            ...apiProgramRuleAction,
            ...getClearProps(),
            programStageSectionId: getProgramStageSectionId(apiProgramRuleAction),
            programStageId: getProgramStageId(apiProgramRuleAction),
            dataElementId: getDataElementId(apiProgramRuleAction),
            trackedEntityAttributeId: getTrackedEntityAttributeId(apiProgramRuleAction),
            optionGroupId: getOptionGroupId(apiProgramRuleAction),
            optionId: getOptionId(apiProgramRuleAction),
        }));
    };

    return (response) => {
        const apiProgramRules = (response && response.programRules) || [];

        return apiProgramRules
            .map(apiProgramRule => ({
                ...apiProgramRule,
                // Adding the program id and program stage id directly to the main object instead of using the container object with id as the only property
                program: undefined,
                programStage: undefined,
                programId: apiProgramRule.program && apiProgramRule.program.id,
                programStageId: apiProgramRule.programStage && apiProgramRule.programStage.id,
                programRuleActions: getProgramRuleActions(apiProgramRule.programRuleActions),
            }));
    };
})();

const getFieldsQuery = () => 'id,displayName,condition,description,program[id],programStage[id],priority,' +
'programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],' +
'trackedEntityAttribute[id],programStage[id],optionGroup[id],option[id]]';

export const storeProgramRules = (programIds: Array<string>) => {
    const query = {
        resource: 'programRules',
        params: {
            fields: getFieldsQuery(),
            filter: `program.id:in:[${programIds.join(',')}]`,
        },
    };
    return quickStoreRecursively(query, getContext().storeNames.PROGRAM_RULES, { onConvertQueryResponse: convert });
};
