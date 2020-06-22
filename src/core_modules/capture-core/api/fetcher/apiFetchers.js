// @flow
import log from 'loglevel';
import Model from 'd2/lib/model/Model';
import { errorCreator } from 'capture-core-utils';
import commonQueryParams from './commonQueryParams';
import getterTypes from './getterTypes.const';
import getD2 from '../../d2/d2Instance';

export type Converter = (d2Model: Model) => any;

async function getListDataAsync(
    d2: Object,
    d2ModelName: string,
    queryParams: string,
    getterType: $Values<typeof getterTypes>,
) {
    const retrievedData = await d2.models[d2ModelName].list(queryParams);
    if (getterType === getterTypes.LIST_WITH_PAGER) {
        return retrievedData;
    }
    return [...retrievedData.values()];
}

export default async function getData(
    d2ModelName: string,
    getterType: $Values<typeof getterTypes>,
    queryParams?: ?Object,
    converter: ?Converter,
) {
    const d2 = getD2();
    const accQueryParams = { ...commonQueryParams, ...queryParams };

    let retrievedData;
    if (getterType === getterTypes.GET) {
        if (!queryParams || (!queryParams.id && queryParams.id !== 0)) {
            log.warn(errorCreator('no id supplied to getData')({ queryParams, d2ModelName, getterType }));
            return null;
        }

        const { id, ...queryParamsRest } = queryParams;
        retrievedData = await d2.models[d2ModelName][getterType](id, queryParamsRest);
    } else {
        retrievedData = await getListDataAsync(d2, d2ModelName, accQueryParams, getterType);
    }

    const convertedData = converter ? converter(retrievedData) : retrievedData;

    return convertedData;
}
