// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { from } from 'rxjs';
import { errorCreator, FEATURES, featureAvailable } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { concatMap, filter, takeUntil } from 'rxjs/operators';
import { workingListsCommonActionTypes, fetchTemplatesSuccess, fetchTemplatesError } from '../../../WorkingListsCommon';
import { getProgramStageTemplates } from './templates/getProgramStageTemplates';
import { getTEITemplates } from './templates/getTEITemplates';
import { TRACKER_WORKING_LISTS_TYPE, TRACKER_WORKING_LISTS, PROGRAM_STAGE_WORKING_LISTS } from '../../constants';

// Deduplicate default template so that only one default template is returned
const removeDefaultTemplate = templates =>
    templates.reduce(
        (acc, template) => (template.isDefault && acc.find(accItem => accItem.isDefault) ? acc : [...acc, template]),
        [],
    );

const mergeTempletes = (APItemplates, selectedTemplateId) => {
    const programStageTempletes = APItemplates?.find(template => template.id === PROGRAM_STAGE_WORKING_LISTS) || {};
    const TEITempletes = APItemplates?.find(template => template.id === TRACKER_WORKING_LISTS) || {};
    const templates = removeDefaultTemplate([...TEITempletes.templates, ...programStageTempletes.templates]) || [];

    return {
        templates,
        defaultTemplateId:
            selectedTemplateId || TEITempletes.defaultTemplateId || programStageTempletes.defaultTemplateId,
    };
};

export const retrieveAllTemplatesEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH),
        filter(
            ({ payload: { workingListsType } }) =>
                workingListsType === TRACKER_WORKING_LISTS_TYPE &&
                featureAvailable(FEATURES.storeProgramStageWorkingList),
        ),
        concatMap(({ payload: { storeId, programId, selectedTemplateId } }) => {
            const promise = Promise.all([
                getTEITemplates(programId, querySingleResource),
                getProgramStageTemplates(programId, querySingleResource),
            ])
                .then((values) => {
                    const { templates, defaultTemplateId } = mergeTempletes(values, selectedTemplateId);

                    return fetchTemplatesSuccess(templates, defaultTemplateId, storeId);
                })
                .catch((error) => {
                    log.error(errorCreator(error)({ epic: 'retrieveTemplatesEpic' }));
                    return fetchTemplatesError(i18n.t('an error occurred loading the working lists'), storeId);
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

export const retrieveTEITemplatesEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH),
        filter(
            ({ payload: { workingListsType } }) =>
                workingListsType === TRACKER_WORKING_LISTS_TYPE &&
                    !featureAvailable(FEATURES.storeProgramStageWorkingList),
        ),
        concatMap(({ payload: { storeId, programId, selectedTemplateId } }) => {
            const promise = getTEITemplates(programId, querySingleResource)
                .then(({ templates, defaultTemplateId }) =>
                    fetchTemplatesSuccess(templates, selectedTemplateId || defaultTemplateId, storeId),
                )
                .catch((error) => {
                    log.error(errorCreator(error)({ epic: 'retrieveTEITemplatesEpic' }));
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
