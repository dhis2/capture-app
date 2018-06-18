// @flow
export interface Convertable {
    onConvert: () => { requestData: any, appliedText: string };
}
