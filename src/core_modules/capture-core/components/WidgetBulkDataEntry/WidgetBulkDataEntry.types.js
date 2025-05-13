// @flow

export type DataStoreConfiguration = {|
    configKey: string,
    dataKey?: string,
    programId: string,
    title: string,
    subtitle?: string,
    pluginSource: string,
|};

export type Props = {
    programId: string,
    setShowBulkDataEntryPlugin: (show: boolean) => void,
};
