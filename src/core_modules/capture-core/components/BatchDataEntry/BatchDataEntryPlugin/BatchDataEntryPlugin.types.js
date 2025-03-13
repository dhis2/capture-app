// @flow
export type Props = {|
    pluginUrl: string,
    configKey: string,
    dataKey?: string,
    onClose: () => Promise<void>,
    onBackToOriginPage: () => void,
|};
