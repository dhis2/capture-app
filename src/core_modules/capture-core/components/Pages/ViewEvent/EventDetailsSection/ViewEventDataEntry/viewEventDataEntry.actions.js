// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { actionCreator } from '../../../../../actions/actions.utils';
import type { RenderFoundation, Program } from '../../../../../metaData';
import { viewEventIds } from '../eventDetails.actions';
import { getConvertGeometryIn, convertGeometryOut, convertStatusOut } from '../../../../DataEntries';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { loadEditDataEntryAsync } from '../../../../DataEntry/templates/dataEntryLoadEdit.template';
import { getRulesActionsForEvent } from '../../../../../rules/actionsCreator';
import elementTypeKeys from '../../../../../metaData/DataElement/elementTypes';
import { getApi } from '../../../../../d2/d2Instance';
import { convertClientToForm } from '../../../../../converters';
import type { ClientEventContainer } from '../../../../../events/eventRequests';

export const actionTypes = {
    VIEW_EVENT_DATA_ENTRY_LOADED: 'ViewEventDataEntryLoadedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingViewEventDataEntryForViewSingleEvent',
};

async function addSubValues(preDataEntryValues, preFormValues, formFoundation: RenderFoundation) {
    const formElements = formFoundation.getElements();
    const usernames = formElements.reduce((acc, dataElement) => {
        // $FlowFixMe[prop-missing] automated comment
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
                paging: false,
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
        return {
            dataEntryValues: preDataEntryValues,
            formValues: preFormValues,
        };
    }

    const users = await getUsers(usernames);

    const formValues = formElements
        .reduce((accFormValues, dataElement) => {
            // $FlowFixMe[prop-missing] automated comment
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
        dataEntryValues: preDataEntryValues,
        formValues,
    };
}

function getAssignee(clientAssignee: ?Object) {
    // $FlowFixMe[prop-missing] automated comment
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
            addSubValues,
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
