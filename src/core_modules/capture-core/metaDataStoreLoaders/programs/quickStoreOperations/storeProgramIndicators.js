// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

const convert = (response) => {
  const apiProgramIndicators = (response && response.programIndicators) || [];

  return apiProgramIndicators.map((apiProgramIndicator) => ({
    ...apiProgramIndicator,
    program: undefined,
    programId: apiProgramIndicator.program && apiProgramIndicator.program.id,
  }));
};

const fieldsParam =
  'id,displayName,code,shortName,displayInForm,expression,' +
  'displayDescription,description,filter,program[id]';

export const storeProgramIndicators = async (programIds: Array<string>) => {
  const query = {
    resource: 'programIndicators',
    params: {
      fields: fieldsParam,
      filter: `program.id:in:[${programIds.join(',')}]`,
    },
  };

  let programIndicatorIds = [];
  const convertRetainingIds = (response) => {
    const convertedProgramIndicators = convert(response);
    programIndicatorIds = programIndicatorIds.concat(
      convertedProgramIndicators.map((programIndicator) => programIndicator.id),
    );
    return convertedProgramIndicators;
  };

  await quickStoreRecursively({
    query,
    storeName: getContext().storeNames.PROGRAM_INDICATORS,
    convertQueryResponse: convertRetainingIds,
  });

  return programIndicatorIds;
};
