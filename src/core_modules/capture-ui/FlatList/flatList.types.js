// @flow
export type Props = {|
    list: { reactKey: string, key: string, value: Object, valueType?: string }[],
    dataTest?: string,
    ...CssClasses,
|};
