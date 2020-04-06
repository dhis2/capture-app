// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

const converter = (response) => {
    const apiProgramIndicators = (response && response.programIndicators) || [];

    return apiProgramIndicators
        .map(apiProgramIndicator => ({
            ...apiProgramIndicator,
            program: undefined,
            programId: apiProgramIndicator.program && apiProgramIndicator.program.id,
        }));
};

export const storeProgramIndicators = (programIds: Array<string>) => {
    const query = {
        resource: 'programIndicators',
        params: {
            fields: 'id,displayName,code,shortName,displayInForm,expression,' +
                'displayDescription,description,filter,program[id]',
            filter: `program.id:in:[${programIds.join(',')}]`,
        },
    };
    return quickStoreRecursively(query, getContext().storeNames.PROGRAM_INDICATORS, { onConvert: converter });
};
