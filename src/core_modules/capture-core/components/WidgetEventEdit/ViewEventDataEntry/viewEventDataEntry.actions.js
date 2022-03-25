// @flow
import i18n from '@dhis2/d2-i18n';
import { type OrgUnit } from 'capture-core-utils/rulesEngine';
import { actionCreator } from '../../../actions/actions.utils';
import type { RenderFoundation, Program } from '../../../metaData';
import { viewEventIds } from '../../Pages/ViewEvent/EventDetailsSection/eventDetails.actions';
import { getConvertGeometryIn, convertGeometryOut, convertStatusOut } from '../../DataEntries';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { loadEditDataEntryAsync } from '../../DataEntry/templates/dataEntryLoadEdit.template';
import {
    getApplicableRuleEffectsForTrackerProgram,
    getApplicableRuleEffectsForEventProgram,
    updateRulesEffects,
} from '../../../rules';
import { dataElementTypes } from '../../../metaData';
import { convertClientToForm } from '../../../converters';
import type { ClientEventContainer } from '../../../events/eventRequests';
import { TrackerProgram, EventProgram } from '../../../metaData/Program';
import { getStageFromEvent } from '../../../metaData/helpers/getStageFromEvent';
import { prepareEnrollmentEventsForRulesEngine } from '../../../events/getEnrollmentEvents';
import { getEnrollmentForRulesEngine, getAttributeValuesForRulesEngine } from '../helpers';
import type {
    EnrollmentData,
    AttributeValue,
} from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';


export const actionTypes = {
    VIEW_EVENT_DATA_ENTRY_LOADED: 'ViewEventDataEntryLoadedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingViewEventDataEntryForViewSingleEvent',
};

function getAssignee(clientAssignee: ?Object) {
    return clientAssignee ? convertClientToForm(clientAssignee, dataElementTypes.USERNAME) : clientAssignee;
}

export const loadViewEventDataEntry =
    async ({
        eventContainer,
        orgUnit,
        foundation,
        program,
        enrollment,
        attributeValues,
    }: {
        eventContainer: ClientEventContainer,
        orgUnit: OrgUnit,
        foundation: RenderFoundation,
        program: Program,
        enrollment?: EnrollmentData,
        attributeValues?: Array<AttributeValue>,
    }) => {
        const dataEntryId = viewEventIds.dataEntryId;
        const itemId = viewEventIds.itemId;
        const dataEntryPropsToInclude = [
            {
                id: 'occurredAt',
                type: 'DATE',
            },
            {
                id: 'scheduledAt',
                type: 'DATE',
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
                onConvertIn: value => (value === 'COMPLETED' ? 'true' : 'false'),
                onConvertOut: convertStatusOut,
            },
        ];

        const formId = getDataEntryKey(dataEntryId, itemId);
        const { actions: dataEntryActions, dataEntryValues, formValues } = await
        loadEditDataEntryAsync(
            dataEntryId,
            itemId,
            eventContainer.event,
            eventContainer.values,
            dataEntryPropsToInclude,
            foundation,
            {
                eventId: eventContainer.event.eventId,
            },
        );

        // $FlowFixMe[cannot-spread-indexer] automated comment
        const currentEvent = { ...eventContainer.event, ...eventContainer.values };

        let effects;
        if (program instanceof TrackerProgram) {
            const stage = getStageFromEvent(eventContainer.event)?.stage;
            if (!stage) {
                throw Error(i18n.t('stage not found in rules execution'));
            }

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
            actionCreator(actionTypes.VIEW_EVENT_DATA_ENTRY_LOADED)({
                loadedValues: { dataEntryValues, formValues, eventContainer },
                // $FlowFixMe[prop-missing] automated comment
                assignee: getAssignee(eventContainer.event.assignee),
            }),
        ];
    };

export const prerequisitesErrorLoadingViewEventDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY)(message);
