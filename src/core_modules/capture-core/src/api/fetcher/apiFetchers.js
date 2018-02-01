// @flow
import log from 'loglevel';
import Model from 'd2/lib/model/Model';

import commonQueryParams from './commonQueryParams';
import getterTypes from './getterTypes.const';
import getD2 from '../../d2/d2Instance';
import errorCreator from '../../utils/errorCreator';

export type Converter = (d2Model: Model) => any;

export default async function getData(
    d2ModelName: string,
    d2ModelGetterType: $Values<typeof getterTypes>,
    queryParams?: ?Object,
    converter: Converter,
) {
    const d2 = getD2();
    const accQueryParams = { ...commonQueryParams, ...queryParams };

    let retrievedData;
    if (d2ModelGetterType === getterTypes.GET) {
        if (!queryParams || (!queryParams.id && queryParams.id !== 0)) {
            log.warn(errorCreator('no id supplied to getData')({ queryParams, d2ModelName, d2ModelGetterType }));
            return null;
        }

        const { id, ...queryParamsRest } = queryParams;
        retrievedData = await d2.models[d2ModelName][d2ModelGetterType](id, queryParamsRest);
    } else {
        retrievedData = await d2.models[d2ModelName][d2ModelGetterType](accQueryParams);
        retrievedData = [...retrievedData.values()];
    }

    const convertedData = converter(retrievedData);

    return convertedData;
}
