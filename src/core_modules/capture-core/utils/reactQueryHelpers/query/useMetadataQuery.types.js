// @flow
export type CustomOptions = $ReadOnly<{|
    useCache?: boolean,
    enabled?: boolean,
|}>;

export type Result<TResultData> = $ReadOnly<{|
    data?: TResultData,
    loading: boolean,
    failed?: boolean,
|}>;
