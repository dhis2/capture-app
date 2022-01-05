// @flow
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit, TrackedEntityAttributes, OptionSets, ProgramRulesContainer, EventsData, DataElements, Enrollment } from 'capture-core-utils/rulesEngine';
import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import type { RenderFoundation } from '../../../metaData';
import type { FieldData } from '../../../rules';
import { getCurrentClientValues } from '../../../rules';
import { loadNewDataEntry } from '../../DataEntry/actions/dataEntryLoadNew.actions';
import { rulesExecutedPostUpdateField } from '../../DataEntry/actions/dataEntry.actions';
import { startRunRulesPostUpdateField } from '../../DataEntry';
import { getRulesActionsForTEI } from './ProgramRules';
import { addFormData } from '../../D2Form/actions/form.actions';

const dataEntryActionTypes = {
    UPDATE_FIELD_PROFILE_ACTION_BATCH: 'UpdateFieldProfileActionBatch',
    OPEN_DATA_ENTRY_PROFILE_ACTION_BATCH: 'OpenDataEntryProfileActionBatch',
};
const dataEntryPropsToInclude: Array<Object> = [
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
    {
        id: 'assignee',
    },
];

type Context = {
    orgUnit: OrgUnit,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    optionSets: OptionSets,
    rulesContainer: ProgramRulesContainer,
    formFoundation: RenderFoundation,
    otherEvents?: ?EventsData,
    dataElements: ?DataElements,
    enrollment?: ?Enrollment,
    state: ReduxState,
};

export const getUpdateFieldActions = (context: Context, innerAction: ReduxAction<any, any>) => {
    const uid = uuid();
    const { orgUnit, trackedEntityAttributes, optionSets, rulesContainer, formFoundation, state, otherEvents, dataElements, enrollment } = context;
    const { dataEntryId, itemId, elementId, value, uiState } = innerAction.payload || {};
    const fieldData: FieldData = {
        elementId,
        value,
        valid: uiState.valid,
    };
    const formId = `${dataEntryId}-${itemId}`;
    const currentTEIValues = getCurrentClientValues(state, formFoundation, formId, fieldData);
    const rulesActions = getRulesActionsForTEI({
        foundation: formFoundation,
        formId,
        orgUnit,
        enrollmentData: enrollment,
        teiValues: currentTEIValues,
        trackedEntityAttributes,
        optionSets,
        rulesContainer,
        otherEvents,
        dataElements,
    });

    return batchActions(
        [
            innerAction,
            ...rulesActions,
            rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        ],
        dataEntryActionTypes.UPDATE_FIELD_PROFILE_ACTION_BATCH,
    );
};

export const getOpenDataEntryActions = ({
    dataEntryId,
    itemId,
    formValues,
}: {
    dataEntryId: string,
    itemId: string,
    formValues: { [key: string]: any },
}) =>
    batchActions(
        [...loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude), addFormData(`${dataEntryId}-${itemId}`, formValues)],
        dataEntryActionTypes.OPEN_DATA_ENTRY_PROFILE_ACTION_BATCH,
    );
