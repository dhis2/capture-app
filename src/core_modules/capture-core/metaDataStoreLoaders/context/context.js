// @flow
import type { ContextInput } from './context.types';

let context;

export const provideContext = async ({
    onQueryApi,
    storageController,
    parentStorageController,
    storeNames,
    parentStoreNames,
}: ContextInput,
    callback: Function,
) => {
    context = {
        onQueryApi,
        storageController,
        parentStorageController,
        storeNames,
        parentStoreNames,
    };
    await callback();
    context = null;
};

export const getContext = () => {
    if (!context) {
        throw Error('metadata loader context not set');
    }
    return context;
};
