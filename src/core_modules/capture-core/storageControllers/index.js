// @flow
export { initAsync as initControllersAsync } from './storageControllers';
export { closeAsync as closeControllersAsync } from './storageControllers';
export {
    getMainController as getMainStorageController,
    getUserController as getUserStorageController,
} from './storageControllers';
export { userStores, mainStores } from './stores';
export type * from './types/cache.types';
