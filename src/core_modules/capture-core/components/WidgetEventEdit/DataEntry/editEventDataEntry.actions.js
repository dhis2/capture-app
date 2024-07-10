// @flow
import i18n from '@dhis2/d2-i18n';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { actionCreator, actionPayloadAppender } from '../../../actions/actions.utils';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import {
    getApplicableRuleEffectsForEventProgram,
    getApplicableRuleEffectsForTrackerProgram,
    updateRulesEffects,
} from '../../../rules';
import { RenderFoundation, Program } from '../../../metaData';
import { getEventDateValidatorContainers } from './fieldValidators/eventDate.validatorContainersGetter';
import { getCategoryOptionsValidatorContainers } from './fieldValidators/categoryOptions.validatorContainersGetter';
import {
    getConvertGeometryIn,
    convertGeometryOut,
    convertStatusIn,
    convertStatusOut,
} from '../../DataEntries';
import {
    getDataEntryMeta, validateDataEntryValues, getDataEntryNotes,
} from '../../DataEntry/actions/dataEntryLoad.utils';
import { loadEditDataEntry } from '../../DataEntry/actions/dataEntry.actions';
import { addFormData } from '../../D2Form/actions/form.actions';
import { EventProgram, TrackerProgram } from '../../../metaData/Program';
import { getStageFromEvent } from '../../../metaData/helpers/getStageFromEvent';
import { getEnrollmentForRulesEngine, getAttributeValuesForRulesEngine } from '../helpers';
import type { EnrollmentData, AttributeValue } from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import { prepareEnrollmentEventsForRulesEngine } from '../../../events/prepareEnrollmentEvents';
import type { ProgramCategory } from '../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';

export const batchActionTypes = {
    UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH: 'UpdateDataEntryFieldForEditSingleEventActionsBatch',
    UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH: 'UpdateFieldForEditSingleEventActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForEditSingleEventActionsBatch',
};

export const actionTypes = {
    OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY: 'OpenSingleEventForEditInDataEntry',
    PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY: 'PrerequisitesErrorOpeningSingleEventForEditInDataEntry',
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForEditSingleEvent',
};

function getLoadActions(
    dataEntryId: string,
    itemId: string,
    dataEntryValues: Object,
    formValues: Object,
    dataEntryPropsToInclude: Array<Object>,
    clientValuesForDataEntry: Object,
    extraProps: { [key: string]: any },
) {
    const dataEntryNotes = getDataEntryNotes(clientValuesForDataEntry);
    const key = getDataEntryKey(dataEntryId, itemId);
    const dataEntryMeta = getDataEntryMeta(dataEntryPropsToInclude);
    const dataEntryUI = validateDataEntryValues(dataEntryValues, dataEntryPropsToInclude);

    return [
        loadEditDataEntry({
            key,
            itemId,
            dataEntryId,
            dataEntryMeta,
            dataEntryValues,
            extraProps,
            dataEntryUI,
            dataEntryNotes,
        }),
        addFormData(key, formValues),
    ];
}

export const openEventForEditInDataEntry = ({
    loadedValues: {
        eventContainer,
        dataEntryValues,
        formValues,
    },
    orgUnit,
    foundation,
    program,
    enrollment,
    attributeValues,
    dataEntryId,
    dataEntryKey,
    programCategory,
}: {
    loadedValues: {
        eventContainer: Object,
        dataEntryValues: Object,
        formValues: Object,
    },
    orgUnit: OrgUnit,
    foundation: RenderFoundation,
    program: Program | EventProgram | TrackerProgram,
    dataEntryId: string,
    dataEntryKey: string,
    enrollment?: EnrollmentData,
    attributeValues?: Array<AttributeValue>,
    programCategory?: ProgramCategory
}) => {
    const dataEntryPropsToInclude = [
        {
            id: 'occurredAt',
            type: 'DATE',
            validatorContainers: getEventDateValidatorContainers(),
        },
        {
            id: 'scheduledAt',
            type: 'DATE',
            validatorContainers: getEventDateValidatorContainers(),
        },
        {
            clientId: 'geometry',
            dataEntryId: 'geometry',
            onConvertIn: getConvertGeometryIn(foundation),
            onConvertOut: convertGeometryOut,
        },
        {
            clientId: 'status',
            dataEntryId: 'complete',
            onConvertIn: convertStatusIn,
            onConvertOut: convertStatusOut,
        },
    ];
    const formId = getDataEntryKey(dataEntryId, dataEntryKey);

    if (programCategory && programCategory.categories) {
        dataEntryPropsToInclude.push(...programCategory.categories.map(category => ({
            id: `attributeCategoryOptions-${category.id}`,
            type: 'TEXT',
            validatorContainers: getCategoryOptionsValidatorContainers({ categories: programCategory.categories }, category.id),
        })));
    }
    const dataEntryActions =
        getLoadActions(
            dataEntryId,
            dataEntryKey,
            dataEntryValues,
            formValues,
            dataEntryPropsToInclude,
            eventContainer.event,
            {
                eventId: eventContainer.event.eventId,
                programCategory,
            },
        );
    const currentEvent = { ...eventContainer.event, ...eventContainer.values };

    let effects;
    if (program instanceof TrackerProgram) {
        const stage = getStageFromEvent(eventContainer.event)?.stage;
        if (!stage) {
            throw Error(i18n.t('stage not found in rules execution'));
        }
        // TODO: Add attributeValues & enrollmentData
        effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            stage,
            orgUnit,
            currentEvent,
            otherEvents: prepareEnrollmentEventsForRulesEngine(
                enrollment?.events.filter(event => event.event !== currentEvent.eventId),
            ),
            enrollmentData: getEnrollmentForRulesEngine(enrollment),
            attributeValues: getAttributeValuesForRulesEngine(attributeValues, program.attributes),
        });
    } else if (program instanceof EventProgram) {
        effects = getApplicableRuleEffectsForEventProgram({
            program,
            orgUnit,
            currentEvent,
        });
    }

    return [
        ...dataEntryActions,
        updateRulesEffects(effects, formId),
        actionCreator(actionTypes.OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY)(),
    ];
};

export const prerequisitesErrorOpeningEventForEditInDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY)(message);

export const startRunRulesOnUpdateForEditSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);


export const startAsyncUpdateFieldForEditEvent = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });

