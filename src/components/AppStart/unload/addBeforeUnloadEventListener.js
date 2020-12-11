// @flow
import cleanUpCommon from 'capture-core/cleanUp/cleanUp';
// import { cleanUp } from './cleanUp';

export default function addBeforeUnloadEventListener(store: ReduxStore) {
  window.addEventListener('beforeunload', async (e) => {
    cleanUpCommon(store);
    // cleanUp(store); // should move clean up from core to app!

    if (store.value.offline.outbox.length > 0) {
      const msg = 'Unsaved events!';
      e.returnValue = msg;
      return msg;
    }
    return undefined;
  });
}
