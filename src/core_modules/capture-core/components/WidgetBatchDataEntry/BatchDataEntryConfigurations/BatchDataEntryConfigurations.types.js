// @flow
type ActiveList = {|
    dataKey?: string,
    configKey: string,
    pluginUrl: string,
    title: string,
|};

export type DataStoreConfigurationRaw = {|
    configKey: string,
    dataKey?: string,
    programId: string,
    title: { [locale: string]: string },
    subtitle?: { [locale: string]: string },
    pluginUrl: string,
|};

export type DataStoreConfiguration = {|
    configKey: string,
    dataKey?: string,
    programId: string,
    title: string,
    subtitle?: string,
    pluginUrl: string,
|};

export type Props = {
    programId: string,
    onSelectConfiguration: (dataStoreConfiguration: ActiveList) => Promise<void>,
};

export type PlainProps = {
    batchDataEntryConfigurations: Array<DataStoreConfiguration>,
    onSelectConfiguration: (dataStoreConfiguration: ActiveList) => Promise<void>,
    ...CssClasses,
};
