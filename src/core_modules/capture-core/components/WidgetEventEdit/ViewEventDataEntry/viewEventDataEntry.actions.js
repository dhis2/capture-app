// @flow
import i18n from '@dhis2/d2-i18n';
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
import type { Event } from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData'; // TODO: This module/widget should not have a dependency to this

export const actionTypes = {
    VIEW_EVENT_DATA_ENTRY_LOADED: 'ViewEventDataEntryLoadedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingViewEventDataEntryForViewSingleEvent',
};

function getAssignee(clientAssignee: ?Object) {
    return clientAssignee ? convertClientToForm(clientAssignee, dataElementTypes.USERNAME) : clientAssignee;
}

export const loadViewEventDataEntry =
    async (eventContainer: ClientEventContainer, orgUnit: Object, foundation: RenderFoundation, program: Program, allEvents?: ?Array<Event>) => {
        const dataEntryId = viewEventIds.dataEntryId;
        const itemId = viewEventIds.itemId;
        const dataEntryPropsToInclude = [
            {
                id: 'occurredAt',
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
            // TODO: Add attributeValues & enrollmentData
            effects = getApplicableRuleEffectsForTrackerProgram({
                program,
                stage,
                orgUnit,
                currentEvent,
                otherEvents: allEvents ? prepareEnrollmentEventsForRulesEngine(allEvents) : undefined,
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
