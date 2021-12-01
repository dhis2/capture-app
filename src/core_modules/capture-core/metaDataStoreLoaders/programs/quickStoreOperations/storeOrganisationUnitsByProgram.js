// @flow
import { getContext } from '../../context';
import { quickStore } from '../../IOUtils';
import type { ApiOrganisationUnitsByProgram } from './types';

const convert = (response: ApiOrganisationUnitsByProgram) =>
    Object
        .keys(response)
        .map(id => ({
            id,
            organisationUnits: response[id].reduce((acc, orgUnitId) => {
                acc[orgUnitId] = true;
                return acc;
            }, {}),
        }));

export const storeOrganisationUnitsByProgram = (programIds: Array<string>) => {
    const query = {
        resource: 'programs/orgUnits',
        params: {
            programs: programIds.join(','),
        },
    };

    return quickStore({
        query,
        storeName: getContext().storeNames.ORGANISATION_UNITS_BY_PROGRAM,
        convertQueryResponse: convert,
    });
};
