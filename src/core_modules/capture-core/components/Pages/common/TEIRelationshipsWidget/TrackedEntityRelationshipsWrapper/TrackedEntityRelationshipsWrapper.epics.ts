import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { actionTypes, batchActionTypes } from './TrackedEntityRelationshipsWrapper.actions';
import { getSearchGroups } from '../../../../TeiSearch/getSearchGroups';
import { getSearchFormId } from '../../../../TeiSearch/getSearchFormId';
import { addFormData } from '../../../../D2Form/actions/form.actions';
import { initializeTeiSearch } from '../../../../TeiSearch/actions/teiSearch.actions';
import { findModes } from '../../../NewRelationship/findModes';
import type { TrackerProgram } from '../../../../../metaData';
import { initializeRegisterTei, initializeRegisterTeiFailed } from '../RegisterTei/registerTei.actions';
import { getTrackerProgramThrowIfNotFound } from '../../../../../metaData';
import { errorCreator } from '../../../../../../capture-core-utils';
import type { EpicAction } from '../../../../../../capture-core-utils/types';

const searchId = 'relationshipTeiSearchWidget';

function getTrackerProgram(suggestedProgramId: string) {
    let trackerProgram: TrackerProgram | null = null;
    try {
        const program = getTrackerProgramThrowIfNotFound(suggestedProgramId);
        if (program.access.data.write) {
            trackerProgram = program;
        }
    } catch (error) {
        log.error(
            errorCreator('tracker program for id not found')({ suggestedProgramId, error }),
        );
        throw Error(i18n.t('Metadata error. see log for details'));
    }
    return trackerProgram;
}

export const openRelationshipTeiSearchWidgetEpic =
    (action$: EpicAction<any>) =>
        action$.pipe(
            ofType(actionTypes.WIDGET_SELECT_FIND_MODE),
            filter((action: any) => action.payload.findMode && action.payload.findMode === 'TEI_SEARCH'),
            map((action: any) => {
                const { relationshipConstraint } = action.payload;
                const { trackedEntityTypeId, programId } = relationshipConstraint;

                const contextId = programId || trackedEntityTypeId;

                const searchGroups = getSearchGroups(trackedEntityTypeId, programId);


                const addFormDataActions = searchGroups ? searchGroups.map((sg, i) => {
                    const key = getSearchFormId(searchId, contextId, i.toString());
                    return addFormData(key, {});
                }) : [];

                return batchActions([
                    ...addFormDataActions,
                    initializeTeiSearch(searchId, programId, trackedEntityTypeId),
                ], batchActionTypes.BATCH_OPEN_TEI_SEARCH_WIDGET);
            }),
        );

export const openRelationshipTeiRegisterWidgetEpic = (action$: EpicAction<any>) =>
    action$.pipe(
        ofType(actionTypes.WIDGET_SELECT_FIND_MODE),
        filter((action: any) => action.payload.findMode && action.payload.findMode === findModes.TEI_REGISTER),
        switchMap((action: any) => {
            const { relationshipConstraint, orgUnit } = action.payload;
            const { programId } = relationshipConstraint;

            let trackerProgram: TrackerProgram | null = null;
            if (programId) {
                try {
                    trackerProgram = getTrackerProgram(programId);
                } catch (error) {
                    return Promise.resolve(initializeRegisterTeiFailed(error));
                }
            }

            if (!orgUnit) {
                return Promise.resolve(initializeRegisterTei(trackerProgram?.id));
            }

            return of(initializeRegisterTei(programId, orgUnit));
        }));
