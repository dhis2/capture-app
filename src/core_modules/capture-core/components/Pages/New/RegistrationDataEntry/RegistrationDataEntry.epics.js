// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { empty } from 'rxjs';
import { registrationFormActionTypes, saveNewTrackedEntityType } from './RegistrationDataEntry.actions';
import { navigateToTrackedEntityDashboard } from '../../../../utils/navigateToTrackedEntityDashboard';
import { scopeTypes } from '../../../../metaData';

export const startSavingNewTrackedEntityTypeEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_SAVE_START),
        map(() => {
            const { orgUnitId, trackedEntityTypeId } = store.value.currentSelections;
            const registrationFormValues = store.value.formsValues['newPageDataEntryId-newTei'];
            const attributes =
              Object.keys(registrationFormValues)
                  .map(key =>
                      ({ attribute: key, value: registrationFormValues[key] }),
                  );

            return saveNewTrackedEntityType(
                {
                    attributes,
                    enrollments: [],
                    orgUnit: orgUnitId,
                    trackedEntityType: trackedEntityTypeId,
                });
        }),
    );

export const completeSavingNewTrackedEntityTypeEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_SAVE_COMPLETED),
        map(({ payload: { response: { importSummaries: [{ reference }] } } }) => {
            const { orgUnitId, trackedEntityTypeId } = store.value.currentSelections;

            navigateToTrackedEntityDashboard(
                reference,
                orgUnitId,
                `${scopeTypes.TRACKED_ENTITY_TYPE.toLowerCase()}=${trackedEntityTypeId}`,
            );
            return empty();
        }),
    );
