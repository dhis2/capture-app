// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { moment } from 'capture-core-utils/moment';
import { dataElementTypes } from '../../../../../metaData';
import { SORT_DIRECTION } from './constants';

const sortNumber = (strA: string, strB: string, direction: string) => {
    const numA = Number(strA);
    const numB = Number(strB);
    if (!strA) {
        return 1;
    } else if (!strB) {
        return -1;
    } else if (direction === SORT_DIRECTION.ASC) {
        return numA < numB ? -1 : 1;
    } else if (direction === SORT_DIRECTION.DESC) {
        return numA < numB ? 1 : -1;
    }

    return 0;
};

const sortText = (strA: string, strB: string, direction: string) => {
    if (direction === SORT_DIRECTION.ASC) {
        return strA < strB ? -1 : 1;
    }
    if (direction === SORT_DIRECTION.DESC) {
        return strA < strB ? 1 : -1;
    }
    return 0;
};

const sortTime = (timeA: string, timeB: string, direction: string) => {
    if (direction === SORT_DIRECTION.ASC) {
        return moment(timeA).unix() - moment(timeB).unix();
    }
    if (direction === SORT_DIRECTION.DESC) {
        return moment(timeB).unix() - moment(timeA).unix();
    }
    return 0;
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
    [dataElementTypes.ORGANISATION_UNIT]: sortText,
    [dataElementTypes.COORDINATE]: sortText,
    [dataElementTypes.POLYGON]: sortText,
    [dataElementTypes.USERNAME]: sortText,
    [dataElementTypes.FILE_RESOURCE]: sortText,
    [dataElementTypes.IMAGE]: sortText,
    [dataElementTypes.UNKNOWN]: () => null,
};


const sortDataFromEvent = (dataA: any, dataB: any, type: string, direction: string) => {
    if (!type) {
        log.error(errorCreator('Type is not defined')({ dataA, dataB }));
    }
    return sortForTypes[type](dataA, dataB, direction);
};

export {
    sortDataFromEvent,
};
