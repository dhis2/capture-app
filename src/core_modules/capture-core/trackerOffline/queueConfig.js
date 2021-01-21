// @flow
import defaultQueue from '@redux-offline/redux-offline/lib/defaults/queue';
import { effectMethods } from './trackerOffline.const';

/* eslint-disable no-new-func */
// $FlowFixMe
const getFunctionFromString = (functionAsString: string) => Function(`return ${functionAsString}`)();

function getEffect(action: any) {
    return action && action.meta && action.meta.offline && action.meta.offline.effect ? action.meta.offline.effect : {};
}
export const queueConfig = {
    ...defaultQueue,
    enqueue(array, action) {
        const effect = getEffect(action);
        if (effect.clientId) {
            const newArray = array.filter((item) => {
                const itemEffect = getEffect(item);
                return !(itemEffect.clientId === effect.clientId && itemEffect.method === effect.method);
            });

            return [...newArray, action];
        }
        return [...array, action];
    },
    dequeue(array, responseAction) {
        const [triggerAction, ...rest] = array;
        const currentItemEffect = getEffect(triggerAction);
        if (currentItemEffect.method === effectMethods.POST) {
            return rest.map((action) => {
                const itemEffect = getEffect(action);
                if (itemEffect.clientId === currentItemEffect.clientId && itemEffect.updateOnDequeueCallback) {
                    const callback = getFunctionFromString(itemEffect.updateOnDequeueCallback);
                    return callback(action, triggerAction, responseAction);
                }
                return action;
            }).filter(action => action);
        }

        return rest;
    },
};
