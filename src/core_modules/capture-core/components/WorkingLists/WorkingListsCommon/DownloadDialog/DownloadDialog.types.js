// @flow
export type Props = $ReadOnly<{
    request: { url: string, queryParams: ?Object },
    hasCSVSupport?: boolean,
    open: boolean,
    onClose: Function,
}>;

export type PlainProps = $ReadOnly<{
    open: boolean,
    onClose: Function,
    hasCSVSupport: boolean,
    absoluteApiPath: string,
    request?: { url: string, queryParams: ?Object },
    ...CssClasses,
}>;
