// @flow
export type Props = $ReadOnly<{
    storeId: string,
    open: boolean,
    onClose: Function,
}>;

export type PlainProps = $ReadOnly<{
    open: boolean,
    onClose: Function,
    absoluteApiPath: string,
    request?: { url: string, queryParams: ?Object },
    ...CssClasses,
}>;
