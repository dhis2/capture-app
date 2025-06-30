import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getCachedOrgUnitName } from 'capture-core/metadataRetrieval/orgUnitName';
import moment from 'moment';
import { dataElementTypes } from '../../../../../../metaData';
import { SORT_DIRECTION } from './constants';
import { localeCompareStrings } from '../../../../../../utils/localeCompareStrings';


const sortNumber = (clientValueA: unknown, clientValueB: unknown, direction: string, options: Record<string, unknown>): number => {
    const numA = Number(clientValueA);
    const numB = Number(clientValueB);
    const { eventDateA, eventDateB } = options;

    if (direction === SORT_DIRECTION.DESC) {
        if (Number.isNaN(numA)) return 1;
        if (Number.isNaN(numB)) return -1;

        if (numA !== numB) {
            return numA - numB;
        }
        return moment(eventDateB as string).unix() - moment(eventDateA as string).unix();
    } else if (direction === SORT_DIRECTION.ASC) {
        if (Number.isNaN(numA)) return -1;
        if (Number.isNaN(numB)) return 1;

        if (numA !== numB) {
            return numB - numA;
        }
        return moment(eventDateB as string).unix() - moment(eventDateA as string).unix();
    }

    return 0;
};

const sortText = (clientValueA: unknown, clientValueB: unknown, direction: string, options: Record<string, unknown>): number => {
    const { eventDateA, eventDateB } = options;

    if (direction === SORT_DIRECTION.DESC) {
        if (!clientValueA) return 1;
        if (!clientValueB) return -1;

        if (clientValueA !== clientValueB) {
            return localeCompareStrings(clientValueB as string, clientValueA as string);
        }

        return moment(eventDateB as string).unix() - moment(eventDateA as string).unix();
    } else if (direction === SORT_DIRECTION.ASC) {
        if (!clientValueA) return -1;
        if (!clientValueB) return 1;

        if (clientValueA !== clientValueB) {
            return localeCompareStrings(clientValueA as string, clientValueB as string);
        }

        return moment(eventDateB as string).unix() - moment(eventDateA as string).unix();
    }

    return 0;
};

const sortTime = (clientValueA: unknown, clientValueB: unknown, direction: string, options: Record<string, unknown>): number => {
    const { eventDateA, eventDateB } = options;
    if (direction === SORT_DIRECTION.DESC) {
        if (clientValueA !== clientValueB) {
            return moment(clientValueB as string).unix() - moment(clientValueA as string).unix();
        }
        return moment(eventDateB as string).unix() - moment(eventDateA as string).unix();
    }

    if (direction === SORT_DIRECTION.ASC) {
        if (clientValueA !== clientValueB) {
            return moment(clientValueA as string).unix() - moment(clientValueB as string).unix();
        }
        return moment(eventDateA as string).unix() - moment(eventDateB as string).unix();
    }

    return 0;
};

const sortOrgUnit = (clientValueA: unknown, clientValueB: unknown, direction: string, options: Record<string, unknown>): number => {
    const orgUnitNameA = getCachedOrgUnitName(clientValueA as string);
    const orgUnitNameB = getCachedOrgUnitName(clientValueB as string);

    return sortText(orgUnitNameA, orgUnitNameB, direction, options);
};

const sortStatus = (clientValueA: unknown, clientValueB: unknown, direction: string, options: Record<string, unknown>): number => {
    const { eventDateA, eventDateB, dueDateA, dueDateB } = options;
    const descOrder = ['Scheduled', 'Active', 'Completed', 'Skipped'];

    if (direction === SORT_DIRECTION.DESC) {
        if ((clientValueA as { text: string }).text !== (clientValueB as { text: string }).text) {
            return descOrder.indexOf((clientValueA as { text: string }).text) - descOrder.indexOf((clientValueB as { text: string }).text);
        }

        if ((clientValueA as { text: string }).text === 'Scheduled') {
            return moment(dueDateB as string).unix() - moment(dueDateA as string).unix();
        }

        return moment(eventDateB as string).unix() - moment(eventDateA as string).unix();
    }

    if (direction === SORT_DIRECTION.ASC) {
        if ((clientValueA as { text: string }).text !== (clientValueB as { text: string }).text) {
            return descOrder.indexOf((clientValueB as { text: string }).text) - descOrder.indexOf((clientValueA as { text: string }).text);
        }

        if ((clientValueA as { text: string }).text === 'Scheduled') {
            return moment(dueDateB as string).unix() - moment(dueDateA as string).unix();
        }

        return moment(eventDateB as string).unix() - moment(eventDateA as string).unix();
    }


    return 0;
};

export const sortDataFromEvent = ({ dataA, dataB, type, columnName, direction }: Record<string, unknown>): number => {
    if (!type) {
        log.error(errorCreator('Type is not defined')({ dataA, dataB }));
    }
    const clientValueA = (dataA as Record<string, unknown>)[columnName as string];
    const clientValueB = (dataB as Record<string, unknown>)[columnName as string];
    const options = {
        eventDateA: (dataA as Record<string, unknown>).occurredAt,
        eventDateB: (dataB as Record<string, unknown>).occurredAt,
        dueDateA: (dataA as Record<string, unknown>).scheduledAt,
        dueDateB: (dataB as Record<string, unknown>).scheduledAt,
    };
    return sortForTypes[type as string](clientValueA, clientValueB, direction as string, options);
};

const sortForTypes: Record<string, (a: unknown, b: unknown, direction: string, options: Record<string, unknown>) => number> = {
    [dataElementTypes.EMAIL]: sortText,
    [dataElementTypes.TEXT]: sortText,
    [dataElementTypes.PHONE_NUMBER]: sortText,
    [dataElementTypes.LONG_TEXT]: sortText,
    [dataElementTypes.NUMBER]: sortNumber,
    [dataElementTypes.INTEGER]: sortNumber,
    [dataElementTypes.INTEGER_POSITIVE]: sortNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: sortNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: sortNumber,
    [dataElementTypes.BOOLEAN]: sortText,
    [dataElementTypes.TRUE_ONLY]: sortText,
    [dataElementTypes.DATE]: sortTime,
    [dataElementTypes.DATETIME]: sortTime,
    [dataElementTypes.TIME]: sortTime,
    [dataElementTypes.PERCENTAGE]: sortText,
    [dataElementTypes.URL]: sortText,
    [dataElementTypes.AGE]: sortText,
    [dataElementTypes.ORGANISATION_UNIT]: sortOrgUnit,
    [dataElementTypes.USERNAME]: sortText,
    [dataElementTypes.STATUS]: sortStatus,
    [dataElementTypes.COORDINATE]: () => 0,
    [dataElementTypes.POLYGON]: () => 0,
    [dataElementTypes.FILE_RESOURCE]: () => 0,
    [dataElementTypes.IMAGE]: () => 0,
    [dataElementTypes.UNKNOWN]: () => 0,
};
