// @flow
import { cleanUpCommon } from 'capture-core/cleanUp/cleanUp';

export function addBeforeUnloadEventListener(store: PlainReduxStore) {
    window.addEventListener('beforeunload', async (e) => {
        cleanUpCommon(store);

        if (store.getState().offline.outbox.length > 0) {
            const msg = 'Unsaved events!';
            e.returnValue = msg;
            return msg;
        }
        return undefined;
    });
}
