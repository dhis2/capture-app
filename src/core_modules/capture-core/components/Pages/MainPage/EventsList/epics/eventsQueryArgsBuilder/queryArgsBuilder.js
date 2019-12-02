// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getEventProgramThrowIfNotFound, ProgramStage, dataElementTypes } from '../../../../../../metaData';
import { convertDate } from './converters';

type QueryArgsSource = {
    programId: string,
    filters: Object,
    sortById: string,
    sortByDirection: string,
};


const mappersForTypes = {
    [dataElementTypes.DATE]: convertDate,
};

function convertFilters(
    filters: Object,
    programId: string,
    listId: string,
    isInit: boolean,
) {
    const elementsById = getEventProgramThrowIfNotFound(programId).stage.stageForm.getElementsById();
    const mainPropTypes = ProgramStage.mainPropTypes;

    return Object
        .keys(filters)
        .filter(key => filters[key])
        .reduce((acc, key) => {
            const type = (elementsById[key] && elementsById[key].type) || mainPropTypes[key];
            if (!type) {
                log.error(errorCreator('Could not get type for key')({ key, listId, programId }));
            } else {
                const sourceValue = filters[key];
                const queryArgValue = mappersForTypes[type] ?
                    mappersForTypes[type](sourceValue, key, listId, isInit) :
                    sourceValue;
                acc[key] = queryArgValue;
            }
            return acc;
        }, {});
}


export function buildQueryArgs(
    queryArgsSource: QueryArgsSource,
    listId: string,
    isInit: boolean = false,
) {
    const { programId, filters } = queryArgsSource;
    const queryArgs = {
        ...queryArgsSource,
        filters: convertFilters(filters, programId, listId, isInit),
    };

    return queryArgs;
}
