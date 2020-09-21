// @flow
import { actionCreator } from '../../../../../actions/actions.utils';
import type { RenderFoundation, Program } from '../../../../../metaData';
import { viewEventIds } from '../eventDetails.actions';
import { getConvertGeometryIn, convertGeometryOut, convertStatusOut } from '../../../../DataEntries';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { loadEditDataEntryAsync } from '../../../../DataEntry/templates/dataEntryLoadEdit.template';
import { getRulesActionsForEvent } from '../../../../../rules/actionsCreator';
import elementTypeKeys from '../../../../../metaData/DataElement/elementTypes';
import { convertClientToForm } from '../../../../../converters';
import type { ClientEventContainer } from '../../../../../events/eventRequests';

export const actionTypes = {
    VIEW_EVENT_DATA_ENTRY_LOADED: 'ViewEventDataEntryLoadedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingViewEventDataEntryForViewSingleEvent',
};

function getAssignee(clientAssignee: ?Object) {
    return clientAssignee ? convertClientToForm(clientAssignee, elementTypeKeys.USERNAME) : clientAssignee;
}

export const loadViewEventDataEntry =
    async (eventContainer: ClientEventContainer, orgUnit: Object, foundation: RenderFoundation, program: Program) => {
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
        return [
            ...dataEntryActions,
            ...getRulesActionsForEvent(
                program,
                foundation,
                key,
                orgUnit,
                eventDataForRulesEngine,
                [eventDataForRulesEngine],
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
