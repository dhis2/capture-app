// @flow
import { pluck, switchMap } from 'rxjs/operators';
import { empty, from } from 'rxjs';
import { ofType } from 'redux-observable';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import { openDataEntryForNewTeiBatchAsync } from '../TrackedEntityInstance';
import { openDataEntryFailed } from '../../Pages/NewRelationship/RegisterTei/DataEntry/RegisterTeiDataEntry.actions';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../metaData/helpers';
import { teiRegistrationEntryActionTypes } from './TeiRegistrationEntry.actions';

export const startNewTeiDataEntrySelfInitialisationEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(teiRegistrationEntryActionTypes.TEI_REGISTRATION_ENTRY_INITIALISATION_START),
        pluck('payload'),
        switchMap(({ selectedOrgUnitId, selectedScopeId: TETypeId, dataEntryId, formFoundation }) => {
            if (selectedOrgUnitId) {
                try {
                    getTrackedEntityTypeThrowIfNotFound(TETypeId);
                } catch (error) {
                    log.error(errorCreator('TET for id not found')({ TETypeId, error }));
                    return Promise.resolve(openDataEntryFailed(i18n.t('Metadata error. see log for details')));
                }

                const openTeiPromise = openDataEntryForNewTeiBatchAsync(
                    formFoundation,
                    { id: selectedOrgUnitId },
                    dataEntryId,
                );

                return from(openTeiPromise);
            }

            return empty();
        }),
    );

