// @flow
import { typeof effectMethods } from '../../capture-core/trackerOffline';

export type OfflineEffect = {
    url: string,
    data: any,
    method: $Values<effectMethods>,
};

export type OfflineError = {|
    details?: {
        httpStatus: string,
        httpStatusCode: number,
        message?: string,
        status?: string,
    },
    type: string,
    message: string,
|};
