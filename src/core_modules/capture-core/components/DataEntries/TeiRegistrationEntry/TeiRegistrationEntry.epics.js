// @flow
import { ofType } from 'redux-observable';
import { pluck, switchMap } from 'rxjs/operators';
import { empty, from } from 'rxjs';
import { errorCreator } from 'capture-core-utils';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { teiRegistrationEntryActionTypes } from './TeiRegistrationEntry.actions';
import { openDataEntryForNewTeiBatchAsync } from '../index';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../metaData/helpers';
import { openDataEntryFailed } from '../../Pages/NewRelationship/RegisterTei/DataEntry/RegisterTeiDataEntry.actions';

export const startNewTeiDataEntrySelfInitialisationEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(teiRegistrationEntryActionTypes.TEI_REGISTRATION_ENTRY_INITIALISATION_START),
        pluck('payload'),
        switchMap(({ selectedOrgUnitInfo, selectedScopeId: TETypeId, dataEntryId, formFoundation }) => {
            if (selectedOrgUnitInfo.id) {
                try {
                    getTrackedEntityTypeThrowIfNotFound(TETypeId);
                } catch (error) {
                    log.error(errorCreator('TET for id not found')({ TETypeId, error }));
                    return Promise.resolve(openDataEntryFailed(i18n.t('Metadata error. see log for details')));
                }

                const openTeiPromise = openDataEntryForNewTeiBatchAsync(
                    formFoundation,
                    selectedOrgUnitInfo,
                    dataEntryId,
                );

                return from(openTeiPromise);
            }

            return empty();
        }),
    );

