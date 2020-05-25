// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

const convert = (response) => {
    const apiProgramIndicators = (response && response.programIndicators) || [];

    return apiProgramIndicators
        .map(apiProgramIndicator => ({
            ...apiProgramIndicator,
            program: undefined,
            programId: apiProgramIndicator.program && apiProgramIndicator.program.id,
        }));
};

const getFieldsQuery = () => 'id,displayName,code,shortName,displayInForm,expression,' +
'displayDescription,description,filter,program[id]';

export const storeProgramIndicators = async (programIds: Array<string>) => {
    const query = {
        resource: 'programIndicators',
        params: {
            fields: getFieldsQuery(),
            filter: `program.id:in:[${programIds.join(',')}]`,
        },
    };

    let programIndicatorsIds = [];
    const convertRetainingIds = (response) => {
        const convertedProgramIndicators = convert(response);
        programIndicatorsIds = programIndicatorsIds.concat(
            convertedProgramIndicators
                .map(programIndicator => programIndicator.id),
        );
        return convertedProgramIndicators;
    };

    await quickStoreRecursively({
        query,
        storeName: getContext().storeNames.PROGRAM_INDICATORS,
        convertQueryResponse: convertRetainingIds,
    });

    return programIndicatorsIds;
};
