// @flow
import { getApi } from 'capture-core/d2';
import { config } from 'd2';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes } from '../../../../metaData';


const baseUrl = config.baseUrl;

const GET_SUBVALUE_ERROR = 'Could not get subvalue';

const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]:
        (value: any, eventId: string, metaElementId: string) => getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${baseUrl}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            }),
    [dataElementTypes.IMAGE]:
        (value: any, eventId: string, metaElementId: string) => getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${baseUrl}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            }),
    [dataElementTypes.ORGANISATION_UNIT]:
        (orgUnitId: any, eventId: string, metaElementId: string) => getApi()
            .get(`organisationUnits/${orgUnitId}`)
            .then(res => ({
                id: res.id,
                code: res.code,
                name: res.displayName,
                path: res.path,
            }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ orgUnitId, eventId, metaElementId, error }));
                return null;
            }),
};


export async function getSubValues(eventId: string, type: any, values?: ?Object) {
    if (!values) {
        return null;
    }

    return Object.keys(values).reduce(async (accValuesPromise, metaElementId) => {
        const accValues = await accValuesPromise;

        const value = values[metaElementId];
        if (value !== null && type) {
            // $FlowFixMe dataElementTypes flow error
            const subValueGetter = subValueGetterByElementType[type];
            if (subValueGetter) {
                const subValue = await subValueGetter(value, eventId, metaElementId);
                accValues[metaElementId] = subValue;
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
