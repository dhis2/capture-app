import { cleanUpCommon } from 'capture-core/cleanUp/cleanUp';
import { ReduxStore } from '../../../types/global.types';

export function addBeforeUnloadEventListener(store: ReduxStore): void {
    window.addEventListener('beforeunload', async (e) => {
        cleanUpCommon(store);

        if (store.getState() && (store.getState() as any).offline?.outbox?.length > 0) {
            const msg = 'Unsaved events!';
            e.returnValue = msg;
            return msg;
        }
        return undefined;
    });
}
