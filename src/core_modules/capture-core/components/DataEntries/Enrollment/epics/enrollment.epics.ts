import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import type { ApiUtils } from 'capture-core-utils/types';
import { batchActionTypes, runRulesOnUpdateFieldBatch } from '../actions/enrollment.actionBatchs';
import { actionTypes } from '../actions/enrollment.actions';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import { Section, getTrackerProgramThrowIfNotFound } from '../../../../metaData';
import { getCurrentClientMainData } from '../../../../rules';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { convertFormToClient } from '../../../../converters';
import { stageMainDataIds, convertToRulesEngineIds } from '../EnrollmentWithFirstStageDataEntry';
import type { QuerySingleResource } from '../../../../utils/api';
import { getCoreOrgUnitFn, orgUnitFetched } from '../../../../metadataRetrieval/coreOrgUnit';

type Context = {
    dataEntryId: string;
    itemId: string;
    uid: string;
    programId: string;
    stage: ProgramStage;
    formFoundation: RenderFoundation;
};

const splitCurrentClientMainData = (stage: any, currentClientMainData: any) => {
    if (!stage) {
        return { currentEnrollmentValues: currentClientMainData, currentEventMainData: {} };
    }
    return Object.keys(currentClientMainData).reduce((acc, id) => {
        const stageMainDataId = Object.keys(stageMainDataIds).find(key => stageMainDataIds[key] === id);
        if (stageMainDataId) {
            acc.currentEventMainData = {
                ...acc.currentEventMainData,
                [convertToRulesEngineIds(stageMainDataId)]: currentClientMainData[id],
            };
        } else {
            acc.currentEnrollmentValues = { ...acc.currentEnrollmentValues, [id]: currentClientMainData[id] };
        }
        return acc;
    }, { currentEnrollmentValues: {}, currentEventMainData: {} });
};

const runRulesOnEnrollmentUpdate = async ({
    store,
    context,
    searchActions = [],
    querySingleResource,
    onGetValidationContext,
}: {
    store: any;
    context: Context;
    searchActions?: any;
    querySingleResource: QuerySingleResource;
    onGetValidationContext: () => any;
}) => {
    const state = store.value;
    const { programId, dataEntryId, itemId, uid, stage, formFoundation } = context;
    const formId = getDataEntryKey(dataEntryId, itemId);
    const program = getTrackerProgramThrowIfNotFound(programId);
    const currentFormData = state.formsValues[formId] || {};
    const convertedValues = formFoundation.convertAndGroupBySection(currentFormData, convertFormToClient);
    const attributeValues = convertedValues[Section.groups.ENROLLMENT];
    const currentEventValues = convertedValues[Section.groups.EVENT] || {};
    const currentClientMainData = getCurrentClientMainData(state, itemId, dataEntryId, formFoundation) || {};
    const { currentEnrollmentValues, currentEventMainData } = splitCurrentClientMainData(stage, currentClientMainData);
    const currentEvent = stage
        ? {
            ...currentEventValues,
            ...currentEventMainData,
            programStageId: stage.id,
        }
        : undefined;

    const { coreOrgUnit, cached } =
        await getCoreOrgUnitFn(querySingleResource)(currentEnrollmentValues.orgUnit?.id, state.organisationUnits);
    const orgUnitActions = coreOrgUnit && !cached ? [orgUnitFetched(coreOrgUnit)] : [];

    return runRulesOnUpdateFieldBatch({
        program,
        formId,
        dataEntryId,
        itemId,
        orgUnit: coreOrgUnit,
        enrollmentData: currentEnrollmentValues,
        attributeValues,
        currentEvent,
        extraActions: [...searchActions, ...orgUnitActions],
        uid,
        stage,
        formFoundation: stage ? formFoundation : undefined,
        querySingleResource,
        onGetValidationContext,
    });
};

export const runRulesOnEnrollmentDataEntryFieldUpdateEpic = (
    action$: any,
    store: any,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH),
        map((actionBatch: any) =>
            actionBatch.payload.find((action: any) => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        concatMap((action: any) => {
            const {
                uid,
                programId,
                innerPayload,
                stage,
                formFoundation,
                onGetValidationContext,
            } = action.payload;

            const {
                dataEntryId,
                itemId,
            } = innerPayload;

            return from(runRulesOnEnrollmentUpdate({
                store,
                context: {
                    dataEntryId,
                    itemId,
                    uid,
                    programId,
                    stage,
                    formFoundation,
                },
                querySingleResource,
                onGetValidationContext,
            }));
        }));

export const runRulesOnEnrollmentFieldUpdateEpic = (
    action$: any,
    store: any,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH),
        map((actionBatch: any) =>
            actionBatch.payload.find((action: any) => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        concatMap((action: any) => {
            const {
                innerPayload: payload,
                searchActions,
                uid,
                programId,
                stage,
                formFoundation,
                onGetValidationContext,
            } = action.payload;
            const { dataEntryId, itemId } = payload;


            return from(runRulesOnEnrollmentUpdate({
                store,
                context: {
                    programId,
                    dataEntryId,
                    itemId,
                    uid,
                    stage,
                    formFoundation,
                },
                searchActions,
                querySingleResource,
                onGetValidationContext,
            }));
        }),
    );
