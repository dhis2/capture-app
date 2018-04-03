// @flow
import { getApi } from '../../../d2/d2Instance';

export type RequestInfo = {
    endpoint: string,
    method: string,
    data?: ?Object,
};

export default function sendRequest(requestInfo: RequestInfo) {
    const api = getApi();
    return api
        .update(requestInfo.endpoint, requestInfo.data);
}
