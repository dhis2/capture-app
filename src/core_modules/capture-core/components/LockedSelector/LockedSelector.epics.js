// @flow
import i18n from '@dhis2/d2-i18n';
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  lockedSelectorActionTypes,
  lockedSelectorBatchActionTypes,
  invalidSelectionsFromUrl,
  validSelectionsFromUrl,
  setCurrentOrgUnitBasedOnUrl,
  errorRetrievingOrgUnitBasedOnUrl,
  setEmptyOrgUnitBasedOnUrl,
} from './LockedSelector.actions';
import { programCollection } from '../../metaDataMemoryStores';
import { getApi } from '../../d2';

const exactUrl = (page: string, programId: string, orgUnitId: string) => {
  const argArray = [];
  if (programId) {
    argArray.push(`programId=${programId}`);
  }
  if (orgUnitId) {
    argArray.push(`orgUnitId=${orgUnitId}`);
  }

  if (page && page !== 'viewEvent') {
    return `/${page}/${argArray.join('&')}`;
  }
  return `/${argArray.join('&')}`;
};

export const updateUrlViaLockedSelectorEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(
      lockedSelectorActionTypes.ORG_UNIT_ID_SET,
      lockedSelectorActionTypes.PROGRAM_ID_SET,
      lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH,
      lockedSelectorBatchActionTypes.ORG_UNIT_ID_RESET_BATCH,
    ),
    map(() => {
      const {
        currentSelections: { programId, orgUnitId },
        app: { page },
      } = store.value;
      return push(exactUrl(page, programId, orgUnitId));
    }),
  );

export const startAgainEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(lockedSelectorBatchActionTypes.AGAIN_START),
    map(() => push('/')),
  );

export const getOrgUnitDataBasedOnUrlUpdateEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE),
    filter((action) => action.payload.nextProps.orgUnitId),
    switchMap((action) =>
      getApi()
        .get(`organisationUnits/${action.payload.nextProps.orgUnitId}`)
        .then((response) =>
          setCurrentOrgUnitBasedOnUrl({
            id: response.id,
            name: response.displayName,
          }),
        )
        .catch(() => errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit'))),
    ),
  );

export const setOrgUnitDataEmptyBasedOnUrlUpdateEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE),
    filter((action) => !action.payload.nextProps.orgUnitId),
    map(() => setEmptyOrgUnitBasedOnUrl()),
  );

export const validateSelectionsBasedOnUrlUpdateEpic = (
  action$: InputObservable,
  store: ReduxStore,
) =>
  action$.pipe(
    ofType(
      lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_SET,
      lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_EMPTY_SET,
    ),
    map(() => {
      const { programId, orgUnitId } = store.value.currentSelections;

      if (programId) {
        const program = programCollection.get(programId);
        if (!program) {
          return invalidSelectionsFromUrl(i18n.t("Program doesn't exist"));
        }

        if (orgUnitId && !program.organisationUnits[orgUnitId]) {
          return invalidSelectionsFromUrl(
            i18n.t('Selected program is invalid for selected registering unit'),
          );
        }
      }

      return validSelectionsFromUrl();
    }),
  );
