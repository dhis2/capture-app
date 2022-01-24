// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { EMPTY, from } from 'rxjs';
import { errorCreator } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { concatMap, filter, takeUntil } from 'rxjs/operators';
import { workingListsCommonActionTypes, fetchTemplatesSuccess, fetchTemplatesError } from '../../../WorkingListsCommon';
import { getTemplates } from './getTemplates';
import { TEI_WORKING_LISTS_TYPE } from '../../constants';

export const retrieveTemplatesEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH),
        filter(({ payload: { workingListsType } }) => workingListsType === TEI_WORKING_LISTS_TYPE),
        concatMap(({ payload: { storeId, programId } }) => {
            const promise = getTemplates(programId, querySingleResource)
                .then(({ templates, defaultTemplateId }) => fetchTemplatesSuccess(templates, defaultTemplateId, storeId))
                .catch((error) => {
                    log.error(errorCreator(error)({ epic: 'retrieveTemplatesEpic' }));
                    return fetchTemplatesError(i18n.t('an error occurred loading Tracked entity instance lists'), storeId);
                });

            return from(promise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH_CANCEL),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }),
    );

export const updateTemplateEpic = () => EMPTY;
export const addTemplateEpic = () => EMPTY;
export const deleteTemplateEpic = () => EMPTY;
