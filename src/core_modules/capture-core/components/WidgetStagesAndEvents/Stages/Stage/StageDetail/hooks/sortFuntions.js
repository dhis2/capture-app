// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import moment from 'moment';
import { dataElementTypes } from '../../../../../../metaData';
import { SORT_DIRECTION } from './constants';


const sortNumber = (clientValueA: Object, clientValueB: Object, direction: string, options: Object) => {
    const numA = Number(clientValueA);
    const numB = Number(clientValueB);
    const { eventDateA, eventDateB } = options;

    if (direction === SORT_DIRECTION.DESC) {
        if (Number.isNaN(numA)) return 1;
        if (Number.isNaN(numB)) return -1;

        if (numA !== numB) {
            return numA - numB;
        }
        return moment(eventDateB).unix() - moment(eventDateA).unix();
    } else if (direction === SORT_DIRECTION.ASC) {
        if (Number.isNaN(numA)) return -1;
        if (Number.isNaN(numB)) return 1;

        if (numA !== numB) {
            return numB - numA;
        }
        return moment(eventDateB).unix() - moment(eventDateA).unix();
    }

    return 0;
};

const sortText = (clientValueA: Object, clientValueB: Object, direction: string, options: Object) => {
    const { eventDateA, eventDateB } = options;

    if (direction === SORT_DIRECTION.DESC) {
        if (!clientValueA) return 1;
        if (!clientValueB) return -1;

        if (clientValueA !== clientValueB) {
            return clientValueA.localeCompare(clientValueB);
        }

        return moment(eventDateB).unix() - moment(eventDateA).unix();
    } else if (direction === SORT_DIRECTION.ASC) {
        if (!clientValueA) return -1;
        if (!clientValueB) return 1;

        if (clientValueA !== clientValueB) {
            return clientValueB.localeCompare(clientValueA);
        }

        return moment(eventDateB).unix() - moment(eventDateA).unix();
    }

    return 0;
};

const sortTime = (clientValueA: Object, clientValueB: Object, direction: string, options: Object) => {
    const { eventDateA, eventDateB } = options;
    // most recent dates first
    if (direction === SORT_DIRECTION.DESC) {
        if (clientValueA !== clientValueB) {
            return moment(clientValueB).unix() - moment(clientValueA).unix();
        }
        return moment(eventDateB).unix() - moment(eventDateA).unix();
    }

    if (direction === SORT_DIRECTION.ASC) {
        if (clientValueA !== clientValueB) {
            return moment(clientValueA).unix() - moment(clientValueB).unix();
        }
        return moment(eventDateA).unix() - moment(eventDateB).unix();
    }

    return 0;
};

const sortOrgUnit = (clientValueA: Object, clientValueB: Object, direction: string, options: Object) => sortText(clientValueA.name, clientValueB.name, direction, options);

// desc: Scheduled -> Active -> Completed -> Skipped
const sortStatus = (clientValueA: Object, clientValueB: Object, direction: string, options: Object) => {
    const { eventDateA, eventDateB, dueDateA, dueDateB } = options;
    const descOrder = ['Scheduled', 'Active', 'Completed', 'Skipped'];

    if (direction === SORT_DIRECTION.DESC) {
        if (clientValueA.text !== clientValueB.text) {
            return descOrder.indexOf(clientValueA.text) - descOrder.indexOf(clientValueB.text);
        }

        if (clientValueA.text === 'Scheduled') {
            return moment(dueDateB).unix() - moment(dueDateA).unix();
        }

        return moment(eventDateB).unix() - moment(eventDateA).unix();
    }

    if (direction === SORT_DIRECTION.ASC) {
        if (clientValueA.text !== clientValueB.text) {
            return descOrder.indexOf(clientValueB.text) - descOrder.indexOf(clientValueA.text);
        }

        if (clientValueA.text === 'Scheduled') {
            return moment(dueDateB).unix() - moment(dueDateA).unix();
        }

        return moment(eventDateB).unix() - moment(eventDateA).unix();
    }


    return 0;
};

const sortDataFromEvent = ({ dataA, dataB, type, columnName, direction }: Object) => {
    if (!type) {
        log.error(errorCreator('Type is not defined')({ dataA, dataB }));
    }
    const clientValueA = dataA[columnName];
    const clientValueB = dataB[columnName];
    const options = {
        eventDateA: dataA.occurredAt,
        eventDateB: dataB.occurredAt,
        dueDateA: dataA.scheduledAt,
        dueDateB: dataB.scheduledAt,
    };
    return sortForTypes[type](clientValueA, clientValueB, direction, options);
};

export {
    sortDataFromEvent,
};


const sortForTypes = {
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
    [dataElementTypes.COORDINATE]: () => null,
    [dataElementTypes.POLYGON]: () => null,
    [dataElementTypes.FILE_RESOURCE]: () => null,
    [dataElementTypes.IMAGE]: () => null,
    [dataElementTypes.UNKNOWN]: () => null,
};
