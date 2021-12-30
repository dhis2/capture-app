// @flow
import { ofType } from 'redux-observable';
import uuid from 'uuid/v4';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { dataEntryActionTypes, updateTei, saveSucceed, setTeiModalState, TEI_MODAL_STATE } from './dataEntry.actions';

const geometryType = (key) => {
    const types = ['Point', 'None', 'Polygon'];
    return types.find(type => key.toLowerCase().includes(type.toLowerCase()));
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
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            } = action.payload;

            const values = formsValues[`${dataEntryId}-${itemId}`];
            const serverData = {
                attributes: deriveAttributesFromFormValues(values),
                geometry: deriveGeometryFromFormValues(values),
                trackedEntityInstance: trackedEntityInstanceId,
                trackedEntityType: trackedEntityTypeId,
                orgUnit: orgUnitId,
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
        map(() => batchActions([saveSucceed(), setTeiModalState(TEI_MODAL_STATE.CLOSE_UPDATE)])),
    );

export const updateTeiFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(dataEntryActionTypes.TEI_UPDATE_ERROR),
        map(() => setTeiModalState(TEI_MODAL_STATE.OPEN_ERROR)),
    );
