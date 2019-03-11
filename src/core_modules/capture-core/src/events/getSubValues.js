// @flow
import log from 'loglevel';
import { config } from 'd2/lib/d2';
import isDefined from 'd2-utilizr/src/isDefined';
import errorCreator from '../utils/errorCreator';
import getD2, { getApi } from '../d2/d2Instance';
import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';
import elementTypeKeys from '../metaData/DataElement/elementTypes';

const GET_SUBVALUE_ERROR = 'Could not get subvalue';

const subValueGetterByElementType = {
    [elementTypeKeys.FILE_RESOURCE]: (value: any, eventId: string, metaElementId: string) => {
        const baseUrl = config.baseUrl;
        return getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${baseUrl}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            });
    },
    [elementTypeKeys.IMAGE]: (value: any, eventId: string, metaElementId: string) => {
        const baseUrl = config.baseUrl;
        return getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${baseUrl}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            });
    },
    [elementTypeKeys.ORGANISATION_UNIT]: (value: any, eventId: string, metaElementId: string) => {
        const ouIds = value.split('/');
        const id = ouIds[ouIds.length - 1];
        return getD2()
            .models
            .organisationUnits
            .get(id)
            .then(res => ({
                id: res.id,
                displayName: res.displayName,
                path: res.path,
            }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            });
    },
};


export async function getSubValues(eventId: string, programStage: RenderFoundation, values?: ?Object) {
    if (!values) {
        return null;
    }

    const elementsById = programStage.getElementsById();

    return Object.keys(values).reduce(async (accValuesPromise, metaElementId) => {
        const accValues = await accValuesPromise;
        // $FlowSuppress
        const value = values[metaElementId];
        const metaElement = elementsById[metaElementId];
        if (isDefined(value) && value !== null && metaElement) {
            const subValueGetter = subValueGetterByElementType[metaElement.type];
            if (subValueGetter) {
                const subValue = await subValueGetter(value, eventId, metaElementId);
                accValues[metaElementId] = subValue;
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
