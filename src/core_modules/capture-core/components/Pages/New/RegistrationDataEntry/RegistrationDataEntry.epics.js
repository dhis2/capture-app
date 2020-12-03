// @flow
import { ofType } from 'redux-observable';
import { flatMap, pluck } from 'rxjs/operators';
import { empty, from } from 'rxjs';
import { registrationFormActionTypes } from './RegistrationDataEntry.actions';
import { openDataEntryForNewTeiBatchAsync } from '../../../DataEntries';


export const startDataEntryInitialisationEpic: Epic = action$ =>
    action$.pipe(
        ofType(registrationFormActionTypes.DATA_ENTRY_INITIALISATION_START),
        pluck('payload'),
        flatMap(({ selectedOrgUnitInfo, dataEntryId, formFoundation }) => {
            if (selectedOrgUnitInfo) {
                return from(openDataEntryForNewTeiBatchAsync(formFoundation, selectedOrgUnitInfo, dataEntryId));
            }

            return empty();
        }),
    );
