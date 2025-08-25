import type { effectMethods } from './trackerOffline.const';

export type OfflineEffect = {
    url: string;
    data: any;
    method: typeof effectMethods[keyof typeof effectMethods];
};
