// @flow
import { effectMethods } from '../../capture-core/trackerOffline';

export type OfflineEffect = {
    url: string,
    data: any,
    method: $Values<typeof effectMethods>,
};
