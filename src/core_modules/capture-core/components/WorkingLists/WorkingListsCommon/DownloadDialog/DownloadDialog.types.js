// @flow
export type Props = $ReadOnly<{
    request: { url: string, queryParams: ?Object },
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
