// @flow
import type { ContextInput } from './context.types';

let context;

export const provideContext = async ({
    onQueryApi,
    storageController,
    applicationStorageController,
    storeNames,
    applicationStoreNames,
}: ContextInput,
    callback: Function,
) => {
    context = {
        onQueryApi,
        storageController,
        applicationStorageController,
        storeNames,
        applicationStoreNames,
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
