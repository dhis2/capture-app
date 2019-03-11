// @flow
import { actionCreator } from '../../../../../actions/actions.utils';
import { RenderFoundation, Program } from '../../../../../metaData';
import { viewEventIds } from '../eventDetails.actions';
import { getConvertGeometryIn, convertGeometryOut, convertStatusIn, convertStatusOut } from '../../../../DataEntries';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { loadViewDataEntry } from '../../../../DataEntry/actions/dataEntryLoadView.actions';
import { getRulesActionsForEvent } from '../../../../../rulesEngineActionsCreator';
import type { ClientEventContainer } from '../../../../../events/eventRequests';

export const actionTypes = {
    VIEW_EVENT_DATA_ENTRY_LOADED: 'ViewEventDataEntryLoadedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingViewEventDataEntryForViewSingleEvent',
};

export const loadViewEventDataEntry =
    (eventContainer: ClientEventContainer, orgUnit: Object, foundation: RenderFoundation, program: Program) => {
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
                onConvertIn: convertStatusIn,
                onConvertOut: convertStatusOut,
            },
        ];
        const key = getDataEntryKey(dataEntryId, itemId);
        const dataEntryActions =
            loadViewDataEntry(
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
            actionCreator(actionTypes.VIEW_EVENT_DATA_ENTRY_LOADED)(),
        ];
    };

export const prerequisitesErrorLoadingViewEventDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY)(message);
