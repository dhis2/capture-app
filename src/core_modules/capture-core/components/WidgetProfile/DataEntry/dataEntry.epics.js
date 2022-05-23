// @flow
import { ofType } from 'redux-observable';
import uuid from 'uuid/v4';
import { pipe } from 'capture-core-utils';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { convertFormToClient, convertClientToServer } from '../../../converters';
import { dataEntryActionTypes, updateTei, setTeiModalError, setTeiValues } from './dataEntry.actions';

const convertFn = pipe(convertFormToClient, convertClientToServer);
const geometryType = (formValuesKey) => {
    const geometryKeys = ['FEATURETYPE_POINT', 'FEATURETYPE_POLYGON'];
    return geometryKeys.find(geometryKey => geometryKey === formValuesKey);
};

const standardGeoJson = (geometry) => {
    if (!geometry) {
        return undefined;
    }
    if (Array.isArray(geometry)) {
        return {
            type: 'Polygon',
            coordinates: geometry,
        };
    } else if (geometry.longitude && geometry.latitude) {
        return {
            type: 'Point',
            coordinates: [geometry.longitude, geometry.latitude],
        };
    }
    return undefined;
};

const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => !geometryType(key))
        .map(key => ({ attribute: key, value: formValues[key] }));

const deriveGeometryFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => geometryType(key))
        .reduce((acc, currentKey) => standardGeoJson(formValues[currentKey]), undefined);

export const updateTeiEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(dataEntryActionTypes.TEI_UPDATE_REQUEST),
        map((action) => {
            const uid = uuid();
            const { formsValues } = store.value;
            const {
                dataEntryId,
                itemId,
                orgUnitId,
                trackedEntityTypeId,
                trackedEntityInstanceId,
                formFoundation,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            } = action.payload;
            const values = formsValues[`${dataEntryId}-${itemId}`];
            const formServerValues = formFoundation?.convertValues(values, convertFn);

            const serverData = {
                trackedEntities: [
                    {
                        attributes: deriveAttributesFromFormValues(formServerValues),
                        geometry: deriveGeometryFromFormValues(values),
                        trackedEntity: trackedEntityInstanceId,
                        trackedEntityType: trackedEntityTypeId,
                        orgUnit: orgUnitId,
                    },
                ],
            };

            onSaveExternal && onSaveExternal(serverData, uid);
            return updateTei({
                serverData,
                onSaveSuccessActionType,
                onSaveErrorActionType,
                uid,
            });
        }),
    );

export const updateTeiSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(dataEntryActionTypes.TEI_UPDATE_SUCCESS),
        map((action) => {
            const trackedEntity = action.meta?.serverData?.trackedEntities[0];
            const attributeValues = trackedEntity ? trackedEntity.attributes : [];
            const geometry = trackedEntity?.geometry;

            return batchActions([setTeiValues(attributeValues, geometry)]);
        }),
    );

export const updateTeiFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(dataEntryActionTypes.TEI_UPDATE_ERROR),
        map(() => setTeiModalError(true)),
    );
