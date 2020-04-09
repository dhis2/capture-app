// @flow
import cleanUpCommon from 'capture-core/cleanUp/cleanUp';

export default function addBeforeUnloadEventListener(store: ReduxStore) {
    window.addEventListener('beforeunload', async (e) => {
        cleanUpCommon(store);
        debugger
        if (store.getState().offline.outbox.length > 0) {
            const msg = 'Unsaved events!';
            e.returnValue = msg;
            return msg;
        }
        return undefined;
    });
}
