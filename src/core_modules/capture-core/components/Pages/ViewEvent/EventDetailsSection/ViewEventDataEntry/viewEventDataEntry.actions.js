// @flow
import { actionCreator } from '../../../../../actions/actions.utils';
import { RenderFoundation, Program } from '../../../../../metaData';
import { viewEventIds } from '../eventDetails.actions';
import { getConvertGeometryIn, convertGeometryOut, convertStatusOut } from '../../../../DataEntries';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { loadViewDataEntry } from '../../../../DataEntry/actions/dataEntryLoadView.actions';
import { getRulesActionsForEvent } from '../../../../../rulesEngineActionsCreator';
import elementTypeKeys from '../../../../../metaData/DataElement/elementTypes';
import { getApi } from '../../../../../d2/d2Instance';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { ClientEventContainer } from '../../../../../events/eventRequests';

export const actionTypes = {
    VIEW_EVENT_DATA_ENTRY_LOADED: 'ViewEventDataEntryLoadedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingViewEventDataEntryForViewSingleEvent',
};

async function addSubValues(preDataEntryValues, preFormValues, formFoundation: RenderFoundation) {
    const formElements = formFoundation.getElements();
    const usernames = formElements.reduce((acc, dataElement) => {
        if (dataElement.type === elementTypeKeys.USERNAME && preFormValues[dataElement.id]) {
            acc.add(preFormValues[dataElement.id]);
        }
        return acc;
    }, new Set());

    const getUsers = (usernamesSet: Set<string>) => {
        const usernamesArray = [...usernamesSet];
        return getApi()
            .get('users', {
                filter: `userCredentials.username:in:[${usernamesArray.join()}]`,
                fields: 'id,displayName,userCredentials[username]',
            })
            .then(response => response
                .users
                .reduce((acc, u) => {
                    acc[u.userCredentials.username] = {
                        id: u.id,
                        name: u.displayName,
                        username: u.userCredentials.username,
                    };
                    return acc;
                }, {}));
    };

    if (usernames.size === 0) {
        return null;
    }

    const users = await getUsers(usernames);

    const formValues = formElements
        .reduce((accFormValues, dataElement) => {
            if (dataElement.type === elementTypeKeys.USERNAME && accFormValues[dataElement.id]) {
                const user = users[accFormValues[dataElement.id]];
                if (!user) {
                    log.error(
                        errorCreator('no user object found for username dataelement of event')({
                            value: accFormValues[dataElement.id],
                        }),
                    );
                    accFormValues[dataElement.id] = undefined;
                    return accFormValues;
                }
                accFormValues[dataElement.id] = user;
            }
            return accFormValues;
        }, preFormValues);

    return {
        formValues,
    };
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
        const dataEntryActions = await
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
            addSubValues,
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
