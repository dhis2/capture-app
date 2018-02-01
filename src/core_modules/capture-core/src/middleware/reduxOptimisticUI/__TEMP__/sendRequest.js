// @flow

export type RequestInfo = {
    endpoint: string,
    method: string,
    data?: ?Object,
};

export default function sendRequest(requestInfo: RequestInfo) {
    return new Promise((resolve, reject) => {
        resolve();
    });
}
