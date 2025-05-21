// @flow
export type Props = {|
    pluginSource: string,
    configKey: string,
    dataKey?: string,
    onComplete: () => Promise<void>,
    onDefer: () => void,
    trackedEntityIds?: Array<string>,
    ...CssClasses,
|};
