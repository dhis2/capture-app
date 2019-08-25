// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import elementTypes from '../metaData/DataElement/elementTypes';
import { getApi } from '../d2/d2Instance';

type InputClientEvent = {
    id: string,
    event: Object,
    values: Object,
};

type InputMainEvent = {
    assignee?: ?string,
};

type OutputClientEvent = {
    id: string,
    event: Object,
    values: Object,
};

function getUsersByKeyFromIds(ids: Set<string>) {
    const idsArray = [...ids];
    return getApi()
        .get('users', {
            filter: `id:in:[${idsArray.join()}]`,
            fields: 'id,displayName,userCredentials[username]',
            paging: false,
        })
        .then((response) => {
            const users = response.users || [];
            return users
                .reduce((acc, u) => {
                    acc[u.id] = {
                        id: u.id,
                        username: u.userCredentials.username,
                        name: u.displayName,
                    };
                    return acc;
                }, {});
        });
}

async function getMainSubValues(mainEvents: Array<InputMainEvent>) {
    const requestKeysByProp = mainEvents
        .reduce((accKeysByProp, mainEvent) => {
            const assignedUserId = mainEvent.assignee;
            if (assignedUserId) {
                accKeysByProp.assignee.add(assignedUserId);
            }
            return accKeysByProp;
        }, {
            assignee: new Set(),
        });

    return {
        user: requestKeysByProp.assignee.size > 0 ? (await getUsersByKeyFromIds(requestKeysByProp.assignee)) : {},
    };
}

function replaceMainValues(mainEvents: Array<InputMainEvent>, mainSubValues: Object) {
    return mainEvents
        .map((e) => {
            if (e.assignee) {
                const user = mainSubValues.user[e.assignee];
                if (!user) {
                    log.error(
                        errorCreator('no user object found for assigned user of event')({
                            id: e.assignee,
                        }),
                    );
                    return e;
                }

                return {
                    ...e,
                    assignee: user,
                };
            }
            return e;
        });
}

async function addMainSubValues(mainEvents: Array<InputMainEvent>) {
    const mainSubValues = await getMainSubValues(mainEvents);
    return replaceMainValues(mainEvents, mainSubValues);
}

export async function addPostSubValues(clientEvents: Array<InputClientEvent>): Promise<Array<OutputClientEvent>> {
    const mainEventsPreSubValues = clientEvents
        .map(e => e.event);
    const mainEvents = await addMainSubValues(mainEventsPreSubValues);

    return clientEvents
        .map((ce, index) => ({
            ...ce,
            event: mainEvents[index],
        }));
}
