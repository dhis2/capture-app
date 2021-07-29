// @flow
import { actionCreator } from '../../../actions/actions.utils';
import type { RenderFoundation, Program } from '../../../metaData';
import { viewEventIds } from '../../Pages/ViewEvent/EventDetailsSection/eventDetails.actions';
import { getConvertGeometryIn, convertGeometryOut, convertStatusOut } from '../../DataEntries';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { loadEditDataEntryAsync } from '../../DataEntry/templates/dataEntryLoadEdit.template';
import { getRulesActionsForEvent } from '../../../rules/actionsCreator';
import { dataElementTypes } from '../../../metaData';
import { convertClientToForm } from '../../../converters';
import type { ClientEventContainer } from '../../../events/eventRequests';
import { TrackerProgram } from '../../../metaData/Program';
import { getStageFromEvent } from '../../../metaData/helpers/getStageFromEvent';
import { prepareEnrollmentEventsForRulesEngine } from '../../../events/getEnrollmentEvents';
import type { Event } from '../../Pages/Enrollment/EnrollmentPageDefault/types/common.types';

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
                id: 'eventDate',
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

        const key = getDataEntryKey(dataEntryId, itemId);
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
        const eventDataForRulesEngine = { ...eventContainer.event, ...eventContainer.values };
        const stage = program instanceof TrackerProgram ? getStageFromEvent(eventContainer.event)?.stage : undefined;
        const allEventsData = program instanceof TrackerProgram && allEvents
            ? [...prepareEnrollmentEventsForRulesEngine(eventDataForRulesEngine, allEvents)]
            : [eventDataForRulesEngine];

        return [
            ...dataEntryActions,
            ...getRulesActionsForEvent(
                program,
                foundation,
                key,
                orgUnit,
                eventDataForRulesEngine,
                allEventsData,
                stage,
            ),
            actionCreator(actionTypes.VIEW_EVENT_DATA_ENTRY_LOADED)({
                loadedValues: { dataEntryValues, formValues, eventContainer },
                // $FlowFixMe[prop-missing] automated comment
                assignee: getAssignee(eventContainer.event.assignee),
            }),
        ];
    };

export const prerequisitesErrorLoadingViewEventDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY)(message);
