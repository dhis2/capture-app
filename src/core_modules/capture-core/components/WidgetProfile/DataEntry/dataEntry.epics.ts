import { ofType } from 'redux-observable';
import { v4 as uuid } from 'uuid';
import { pipe } from 'capture-core-utils';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { convertFormToClient, convertClientToServer } from '../../../converters';
import { dataEntryActionTypes, updateTei, setTeiModalError, setTeiValues } from './dataEntry.actions';
import { GEOMETRY } from './helpers';

const convertFn = pipe(convertFormToClient, convertClientToServer);

const geometryType = (formValuesKey: string) =>
    Object.values(GEOMETRY).find((value: any) => value.FEATURETYPE === formValuesKey);

const standardGeoJson = (geometry: any) => {
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

const deriveAttributesFromFormValues = (formValues: any = {}) =>
    Object.keys(formValues)
        .filter(key => !geometryType(key))
        .map(key => ({ attribute: key, value: formValues[key] }));

const deriveGeometryFromFormValues = (formValues: any = {}) =>
    Object.keys(formValues)
        .filter(key => geometryType(key))
        .reduce((acc: any, currentKey: string) => standardGeoJson(formValues[currentKey]), undefined);

export const updateTeiEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(dataEntryActionTypes.TEI_UPDATE_REQUEST),
        map((action: any) => {
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

            onSaveExternal?.(serverData, uid);
            return updateTei({
                serverData,
                onSaveSuccessActionType,
                onSaveErrorActionType,
                uid,
            });
        }),
    );

export const updateTeiSucceededEpic = (action$: any) =>
    action$.pipe(
        ofType(dataEntryActionTypes.TEI_UPDATE_SUCCESS),
        map((action: any) => {
            const trackedEntity = action.meta?.serverData?.trackedEntities[0] || {};
            const { attributes = [], geometry } = trackedEntity;


            return batchActions([setTeiValues(attributes, geometry)]);
        }),
    );

export const updateTeiFailedEpic = (action$: any) =>
    action$.pipe(
        ofType(dataEntryActionTypes.TEI_UPDATE_ERROR),
        map(() => setTeiModalError(true)),
    );
