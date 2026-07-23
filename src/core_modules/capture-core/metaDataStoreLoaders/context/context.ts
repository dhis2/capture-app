import type { ContextInput } from './context.types';

let context;

export const provideContext = async (
    {
        onQueryApi,
        storageController,
        storeNames,
        minorServerVersion,
    }: ContextInput,
    callback: any) => {
    context = {
        onQueryApi,
        storageController,
        storeNames,
        minorServerVersion,
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
