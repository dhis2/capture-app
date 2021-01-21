// @flow
import { effectMethods } from './trackerOffline.const';
import type { OfflineEffect } from './trackerOffline.types';

export const getEffectReconciler = (() => {
    const mutateTypeForMethods = {
        [effectMethods.POST]: 'create',
        [effectMethods.UPDATE]: 'replace',
        [effectMethods.DELETE]: 'delete',
    };

    return (onApiMutate: Function) => ({ url: resource, method, data }: OfflineEffect) => {
        const type = mutateTypeForMethods[method];
        return onApiMutate({ resource, type, data });
    };
})();
