// @flow
export type Props = $ReadOnly<{
    open: boolean,
    onClose: Function,
    absoluteApiPath: string,
    request?: { url: string, queryParams: ?Object },
}>;
