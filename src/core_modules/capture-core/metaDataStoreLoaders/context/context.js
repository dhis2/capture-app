// @flow
import { StorageController } from 'capture-core-utils/storage';
import type { QueryApiFn } from '../loader.types';

let context;

type StoreNames = {
    CONSTANTS: string,
    ORGANISATION_UNIT_LEVELS: string,
    ORGANISATION_UNIT_GROUPS: string,
    RELATIONSHIP_TYPES: string,
    TRACKED_ENTITY_TYPES: string,
    PROGRAMS: string,
    PROGRAM_RULES: string,
    PROGRAM_RULES_VARIABLES: string,
    PROGRAM_INDICATORS: string,
    TRACKED_ENTITY_ATTRIBUTES: string,
    OPTION_SETS: string,
    CATEGORIES: string,
    CATEGORY_OPTIONS_BY_CATEGORY: string,
    CATEGORY_OPTIONS: string,
    REDUX_PERSIST: string,
};

type ParentStoreNames = {
    USER_CACHES: string,
    STATUS: string,
    SYSTEM_SETTINGS: string,
};

type Input = {
    onQueryApi: QueryApiFn,
    storageController: StorageController,
    parentStorageController: StorageController,
    storeNames: StoreNames,
    parentStoreNames: ParentStoreNames,
};

export const provideContext = async ({
    onQueryApi,
    storageController,
    parentStorageController,
    storeNames,
    parentStoreNames,
}: Input,
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
