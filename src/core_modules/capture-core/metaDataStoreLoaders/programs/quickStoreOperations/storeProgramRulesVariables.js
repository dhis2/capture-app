// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

const convert = (() => {
    const resetProps = {
        dataElement: undefined,
        trackedEntityAttribute: undefined,
        program: undefined,
        programStage: undefined,
        useCodeForOptionSet: undefined,
    };

    const getIdProps = apiProgramRuleVariable => ({
        dataElementId: apiProgramRuleVariable.dataElement && apiProgramRuleVariable.dataElement.id,
        trackedEntityAttributeId: apiProgramRuleVariable.trackedEntityAttribute &&
        apiProgramRuleVariable.trackedEntityAttribute.id,
        programId: apiProgramRuleVariable.program && apiProgramRuleVariable.program.id,
        programStageId: apiProgramRuleVariable.programStage && apiProgramRuleVariable.programStage.id,
    });

    return (response) => {
        const apiProgramRulesVariables = (response && response.programRuleVariables) || [];

        return apiProgramRulesVariables
            .map(apiProgramRuleVariable => ({
                ...apiProgramRuleVariable,
                ...resetProps,
                ...getIdProps(apiProgramRuleVariable),
                useNameForOptionSet: apiProgramRuleVariable.useCodeForOptionSet != null ?
                    !apiProgramRuleVariable.useCodeForOptionSet :
                    false,
            }));
    };
})();

export const storeProgramRulesVariables = async (programIds: Array<string>) => {
    const query = {
        resource: 'programRuleVariables',
        params: {
            fields: 'id,displayName,programRuleVariableSourceType,' +
                'program[id],programStage[id],dataElement[id],trackedEntityAttribute[id],useCodeForOptionSet',
            filter: `program.id:in:[${programIds.join(',')}]`,
        },
    };

    let programRuleVariableIds = [];
    const convertRetainingIds = (response) => {
        const convertedProgramRuleVariables = convert(response);
        programRuleVariableIds = programRuleVariableIds.concat(
            convertedProgramRuleVariables
                .map(programRuleVariable => programRuleVariable.id),
        );
        return convertedProgramRuleVariables;
    };

    await quickStoreRecursively(
        query,
        getContext().storeNames.PROGRAM_RULES_VARIABLES, {
            convertQueryResponse: convertRetainingIds,
        });

    return programRuleVariableIds;
};
