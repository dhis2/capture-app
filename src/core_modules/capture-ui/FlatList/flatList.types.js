// @flow
export type Props = {|
    list: { reactKey: string, key: string, value: { id: string, name: string }, valueType?: string }[],
    dataTest?: string,
    ...CssClasses,
|};
