// @flow
export type Props = {|
    pluginSource: string,
    configKey: string,
    dataKey?: string,
    onClose: () => Promise<void>,
    onBackToOriginPage: () => void,
    trackedEntities?: Array<string>,
|};
