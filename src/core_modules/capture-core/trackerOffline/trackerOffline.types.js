// @flow
import { typeof effectMethods } from '../../capture-core/trackerOffline';

export type OfflineEffect = {
    url: string,
    data: any,
    method: $Values<effectMethods>,
};
