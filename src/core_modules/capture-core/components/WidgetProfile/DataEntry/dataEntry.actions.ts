import { batchActions } from 'redux-batched-actions';
import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import type {
    OrgUnit,
    TrackedEntityAttributes,
    OptionSets,
    ProgramRulesContainer,
    EventsData,
    DataElements,
} from '../../../rules/RuleEngine';
import type { EnrollmentData } from './Types';
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';
import type { RenderFoundation } from '../../../metaData';
import type { FieldData } from '../../../rules';
import { getCurrentClientValues } from '../../../rules';
import { loadNewDataEntry } from '../../DataEntry/actions/dataEntryLoadNew.actions';
import { rulesExecutedPostUpdateField } from '../../DataEntry/actions/dataEntry.actions';
import { getRulesActionsForTEI } from './ProgramRules';
import { addFormData } from '../../D2Form/actions/form.actions';
import { updateFieldUIOnly } from '../../D2Form/FormBuilder/formBuilder.actions';
import type { Geometry } from './helpers/types';
import type { QuerySingleResource } from '../../../utils/api';
import { DataEntryPropToInclude } from '../../DataEntry/actions/dataEntryLoad.utils';

export const TEI_MODAL_STATE = {
    OPEN: 'Open',
    OPEN_ERROR: 'OpenWithErrors',
    OPEN_DISABLE: 'OpenAndDisabled',
    CLOSE: 'Close',
};

export const dataEntryActionTypes = {
    UPDATE_FIELD_PROFILE_ACTION_BATCH: 'UpdateFieldProfileActionBatch',
    OPEN_DATA_ENTRY_PROFILE_ACTION_BATCH: 'OpenDataEntryProfileActionBatch',
    TEI_UPDATE: 'TeiUpdate',
    TEI_UPDATE_REQUEST: 'TeiSaveRequest',
    TEI_UPDATE_SUCCESS: 'TeiUpdateSucess',
    TEI_UPDATE_ERROR: 'TeiUpdateError',
    SET_TEI_MODAL_ERROR: 'SetTeiModalError',
    SET_TEI_VALUES: 'SetTeiValues',
    CLEAN_TEI_MODAL: 'CleanTeiModal',
};
const dataEntryPropsToInclude: Array<DataEntryPropToInclude> = [
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
    {
        id: 'assignee',
        type: 'assignee',
    },
];

type Context = {
    orgUnit: OrgUnit;
    programName: string;
    trackedEntityAttributes?: TrackedEntityAttributes;
    optionSets: OptionSets;
    rulesContainer: ProgramRulesContainer;
    formFoundation: RenderFoundation;
    otherEvents?: EventsData;
    dataElements?: DataElements;
    enrollment?: EnrollmentData;
    userRoles: Array<string>;
    state: any;
};

export const getUpdateFieldActions = async ({
    context,
    querySingleResource,
    onGetValidationContext,
    innerAction,
    uid,
}: {
    context: Context;
    querySingleResource: QuerySingleResource;
    onGetValidationContext: () => Record<string, any>;
    innerAction: any;
    uid: string;
}) => {
    const {
        orgUnit,
        trackedEntityAttributes,
        optionSets,
        rulesContainer,
        formFoundation,
        state,
        otherEvents,
        dataElements,
        enrollment,
        userRoles,
        programName,
    } = context;
    const { dataEntryId, itemId, elementId, value, uiState } = innerAction.payload || {};
    const fieldData: FieldData = {
        elementId,
        value,
        valid: uiState?.valid,
    };
    const formId = `${dataEntryId}-${itemId}`;
    const currentTEIValues = getCurrentClientValues(state, formFoundation, formId, fieldData);
    const rulesActions = await getRulesActionsForTEI({
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
        userRoles,
        programName,
        querySingleResource,
        onGetValidationContext,
    });
    const updateFieldUIAction = updateFieldUIOnly(uiState, elementId, formId);

    return batchActions(
        [
            innerAction,
            rulesActions,
            rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
            updateFieldUIAction,
        ].filter(action => action),
        dataEntryActionTypes.UPDATE_FIELD_PROFILE_ACTION_BATCH,
    );
};

export const setTeiModalError = (hasError: boolean) =>
    actionCreator(dataEntryActionTypes.SET_TEI_MODAL_ERROR)({ hasError });

export const setTeiValues = (
    attributeValues: Array<{ [key: string]: string }>,
    geometry?: Geometry,
) => actionCreator(dataEntryActionTypes.SET_TEI_VALUES)({ attributeValues, geometry });

export const cleanTeiModal = () => actionCreator(dataEntryActionTypes.CLEAN_TEI_MODAL)();

export const updateTeiRequest = ({
    itemId,
    dataEntryId,
    orgUnitId,
    trackedEntityTypeId,
    trackedEntityInstanceId,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    formFoundation,
}: {
    itemId: string;
    dataEntryId: string;
    orgUnitId: string;
    trackedEntityTypeId: string;
    trackedEntityInstanceId: string;
    onSaveExternal?: (eventServerValues: any, uid: string) => void;
    onSaveSuccessActionType?: string;
    onSaveErrorActionType?: string;
    formFoundation: RenderFoundation;
}) =>
    actionCreator(dataEntryActionTypes.TEI_UPDATE_REQUEST)({
        itemId,
        dataEntryId,
        orgUnitId,
        trackedEntityTypeId,
        trackedEntityInstanceId,
        formFoundation,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    });

export const updateTei = ({
    serverData,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    uid,
}: {
    serverData: Record<string, any>;
    onSaveSuccessActionType?: string;
    onSaveErrorActionType?: string;
    uid: string;
}) =>
    actionCreator(dataEntryActionTypes.TEI_UPDATE)(
        {},
        {
            offline: {
                effect: {
                    url: 'tracker?async=false',
                    method: effectMethods.POST,
                    data: serverData,
                },
                commit: { type: onSaveSuccessActionType, meta: { serverData, uid } },
                rollback: { type: onSaveErrorActionType, meta: { serverData, uid } },
            },
        },
    );

export const getOpenDataEntryActions = ({
    dataEntryId,
    itemId,
    formValues,
}: {
    dataEntryId: string;
    itemId: string;
    formValues: { [key: string]: any };
}) =>
    batchActions(
        [
            ...loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude),
            addFormData(`${dataEntryId}-${itemId}`, formValues),
        ],
        dataEntryActionTypes.OPEN_DATA_ENTRY_PROFILE_ACTION_BATCH,
    );
