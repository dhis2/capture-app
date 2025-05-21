// @flow
export type Props = {|
    pluginSource: string,
    configKey: string,
    dataKey?: string,
    onClose: () => Promise<void>,
    onBackToOriginPage: () => void,
    trackedEntityIds?: Array<string>,
    ...CssClasses,
|};
