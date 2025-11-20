import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { map, filter, concatMap } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import type { ApiUtils, EpicAction, ReduxStore } from '../../../../../../../capture-core-utils/types';
import { rulesExecutedPostUpdateField } from '../../../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
    batchActionTypes as newEventDataEntryBatchActionTypes,
    openNewEventInDataEntry,
    cancelOpenNewEventInDataEntry,
    batchActionTypes,
} from '../actions/dataEntry.actions';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getApplicableRuleEffectsForEventProgram,
    updateRulesEffects,
    validateAssignEffects,
    type FieldData,
} from '../../../../../../rules';
import { getOpenDataEntryActions } from '../';
import { getEventProgramThrowIfNotFound } from '../../../../../../metaData/helpers';
import {
    getDefaultMainConfig as getDefaultMainColumnConfig,
    getMetaDataConfig as getColumnMetaDataConfig,
} from './defaultColumnConfiguration';
import {
    resetList,
} from '../../RecentlyAddedEventsList';
import {
    listId,
} from '../../RecentlyAddedEventsList/RecentlyAddedEventsList.const';
import { getStageForEventProgram } from '../../../../../../metaData/helpers/EventProgram/getStageForEventProgram';
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram, EventProgram } from '../../../../../../metaData';
import { actionTypes as crossPageActionTypes } from '../../../../../Pages/actions/crossPage.actions';
import { lockedSelectorActionTypes } from '../../../../../LockedSelector/LockedSelector.actions';
import { newPageActionTypes } from '../../../../../Pages/New/NewPage.actions';
import { programCollection } from '../../../../../../metaDataMemoryStores';
import type { QuerySingleResource } from '../../../../../../utils/api';
import { getCoreOrgUnitFn, orgUnitFetched } from '../../../../../../metadataRetrieval/coreOrgUnit';

type SelectionsCompletenessPayload = {
    triggeringActionType?: string;
};

export const resetDataEntryForNewEventEpic = (action$: EpicAction<any>, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryBatchActionTypes.SAVE_NEW_EVENT_ADD_ANOTHER_BATCH),
        map(() => {
            const state = store.value;
            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnits = state.organisationUnits;
            const orgUnit = orgUnitId && orgUnits && orgUnits[orgUnitId]
                ? {
                    id: orgUnitId,
                    name: orgUnits[orgUnitId].name,
                    path: orgUnits[orgUnitId].path,
                    code: orgUnits[orgUnitId].code,
                    groups: orgUnits[orgUnitId].groups,
                }
                : undefined;
            return batchActions(getOpenDataEntryActions(undefined, undefined, orgUnit));
        }),
    );

export const openNewEventInDataEntryEpic = (action$: EpicAction<SelectionsCompletenessPayload>, store: ReduxStore) =>
    action$.pipe(
        ofType(
            crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATE,
        ),
        filter(() => {
            const { app: { page } } = store.value;
            return page === 'new';
        }),
        filter((action) => {
            const { programId } = store.value.currentSelections;
            const program = programCollection.get(programId);
            if (!(program instanceof EventProgram)) {
                return false;
            }
            const type = action.type;
            const triggeringActionType = action.payload && action.payload.triggeringActionType;
            if (type === crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATE) {
                return (!!triggeringActionType) && [
                    lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_VALID,
                    newPageActionTypes.CATEGORY_OPTION_SET,
                ].includes(triggeringActionType);
            }

            return true;
        }),
        map(() => {
            const state = store.value;
            const selectionsComplete = state.currentSelections.complete;
            return selectionsComplete
                ? openNewEventInDataEntry()
                : cancelOpenNewEventInDataEntry();
        }));

export const resetRecentlyAddedEventsWhenNewEventInDataEntryEpic = (
    action$: EpicAction<SelectionsCompletenessPayload>,
    store: ReduxStore,
) =>
    action$.pipe(
        ofType(
            newPageActionTypes.CATEGORY_OPTION_SET,
            crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATE,
        ),
        filter(() => {
            const { app: { page } } = store.value;
            return page === 'new';
        }),
        filter((action) => {
            // cancel if triggered by SELECTIONS_COMPLETENESS_CALCULATE and the underlying action is not
            // SET_ORG_UNIT or FROM_URL_CURRENT_SELECTIONS_VALID
            const type = action.type;
            if (type === crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATE) {
                const triggeringActionType = action.payload && action.payload.triggeringActionType;
                if (![lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_VALID]
                    .includes(triggeringActionType!)) {
                    return false;
                }
            }

            // cancel if selections are incomplete
            const state = store.value;
            if (!state.currentSelections.complete) {
                return false;
            }

            // cancel if tracker program
            const programId = state.currentSelections.programId;
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            return !(program instanceof TrackerProgram);
        }),
        map(() => {
            const state = store.value;
            const newEventsMeta = { sortById: 'created', sortByDirection: 'desc' };
            const stageContainer = getStageForEventProgram(state.currentSelections.programId);
            if (!stageContainer || !stageContainer.stage) {
                return false;
            }
            const columnConfig = [
                ...getDefaultMainColumnConfig(stageContainer.stage),
                ...getColumnMetaDataConfig(stageContainer.stage.stageForm),
            ];
            return resetList(listId, columnConfig, newEventsMeta, state.currentSelections);
        }));


const runRulesForNewSingleEvent = async ({
    store,
    dataEntryId,
    itemId,
    uid,
    fieldData,
    querySingleResource,
}: {
    store: ReduxStore;
    dataEntryId: string;
    itemId: string;
    uid: string;
    fieldData?: FieldData | null;
    querySingleResource: QuerySingleResource;
}) => {
    const state = store.value;
    const formId = getDataEntryKey(dataEntryId, itemId);

    const programId = state.currentSelections.programId;
    const program = getEventProgramThrowIfNotFound(programId);

    const foundation = program.stage.stageForm;
    const programStageId = foundation.id;
    const currentEventValues = getCurrentClientValues(state, foundation, formId, fieldData);
    const currentEventMainData = getCurrentClientMainData(state, itemId, dataEntryId, foundation);
    const currentEvent = { ...currentEventValues, ...currentEventMainData, programStageId };

    const { coreOrgUnit, cached } =
        await getCoreOrgUnitFn(querySingleResource)(currentEvent.orgUnit?.id, store.value.organisationUnits);

    const effects = getApplicableRuleEffectsForEventProgram({
        program,
        orgUnit: coreOrgUnit,
        currentEvent,
    });

    const effectsWithValidations = await validateAssignEffects({
        dataElements: foundation.getElements(),
        effects,
        querySingleResource,
    });

    return batchActions([
        updateRulesEffects(effectsWithValidations, formId),
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
        ...(coreOrgUnit && !cached ? [orgUnitFetched(coreOrgUnit)] : []),
    ],
    batchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
    );
};

export const runRulesOnUpdateDataEntryFieldForSingleEventEpic = (
    action$: EpicAction<any>,
    store: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        concatMap((action) => {
            const { dataEntryId, itemId, uid } = action.payload;
            const runRulesForNewSingleEventPromise = runRulesForNewSingleEvent({
                store,
                dataEntryId,
                itemId,
                uid,
                querySingleResource,
            });
            return from(runRulesForNewSingleEventPromise);
        }));

export const runRulesOnUpdateFieldForSingleEventEpic = (
    action$: EpicAction<any>,
    store: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        concatMap((action) => {
            const { dataEntryId, itemId, uid, elementId, value, uiState } = action.payload;
            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            const runRulesForNewSingleEventPromise = runRulesForNewSingleEvent({
                store,
                dataEntryId,
                itemId,
                uid,
                fieldData,
                querySingleResource,
            });
            return from(runRulesForNewSingleEventPromise);
        }));
