import { cleanUpCommon } from 'capture-core/cleanUp/cleanUp';

type PlainReduxStore = {
    dispatch: (action: any) => void;
    getState: () => any;
};

export function addBeforeUnloadEventListener(store: PlainReduxStore) {
    window.addEventListener('beforeunload', async (e) => {
        cleanUpCommon(store);

        if (store.getState().offline.outbox.length > 0) {
            const msg = 'Unsaved events!';
            e.preventDefault();
            return msg;
        }
        return undefined;
    });
}
