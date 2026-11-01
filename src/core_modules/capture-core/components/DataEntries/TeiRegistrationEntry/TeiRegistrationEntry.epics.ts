import { ofType } from 'redux-observable';
import { pluck, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { errorCreator } from 'capture-core-utils';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { teiRegistrationEntryActionTypes } from './TeiRegistrationEntry.actions';
import { openDataEntryForNewTeiBatchAsync } from '../TrackedEntityInstance';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../metaData/helpers';
import { openDataEntryFailed } from '../../Pages/NewRelationship/RegisterTei/DataEntry/RegisterTeiDataEntry.actions';
import { getCoreOrgUnitFn } from '../../../metadataRetrieval/coreOrgUnit';

export const startNewTeiDataEntrySelfInitialisationEpic = (
    action$: any,
    store: any,
    { querySingleResource }: any,
) =>
    action$.pipe(
        ofType(teiRegistrationEntryActionTypes.TEI_REGISTRATION_ENTRY_INITIALISATION_START),
        pluck('payload'),
        switchMap(({ selectedOrgUnitId, selectedScopeId: TETypeId, dataEntryId, formFoundation, formValues }: any) => {
            try {
                getTrackedEntityTypeThrowIfNotFound(TETypeId);
            } catch (error) {
                log.error(errorCreator('TET for id not found')({ TETypeId, error }));
                return Promise.resolve(openDataEntryFailed(i18n.t('Metadata error. see log for details')));
            }

            const openTeiPromise = getCoreOrgUnitFn(querySingleResource)(
                selectedOrgUnitId,
                store.value.organisationUnits,
            ).then(({ coreOrgUnit }) => openDataEntryForNewTeiBatchAsync({
                foundation: formFoundation,
                orgUnit: coreOrgUnit,
                dataEntryId,
                querySingleResource,
                formValues,
            }));

            return from(openTeiPromise);
        }),
    );
