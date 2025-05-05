// @flow
export type DataStoreConfigurationRaw = {|
    configKey: string,
    dataKey?: string,
    programId: string,
    title: { [locale: string]: string },
    subtitle?: { [locale: string]: string },
    pluginSource: string,
|};

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
