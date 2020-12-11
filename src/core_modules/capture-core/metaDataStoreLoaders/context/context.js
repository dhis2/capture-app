// @flow
import type { ContextInput } from './context.types';

let context;

export const provideContext = async ({
    onQueryApi,
    storageController,
    storeNames,
}: ContextInput,
callback: Function,
) => {
    context = {
        onQueryApi,
        storageController,
        storeNames,
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
