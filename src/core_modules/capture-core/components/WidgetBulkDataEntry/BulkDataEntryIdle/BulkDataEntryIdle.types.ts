import type { DataStoreConfiguration } from '../../common/bulkDataEntry';

export type Props = {
    bulkDataEntryConfigurations?: Array<DataStoreConfiguration>;
    onSelectConfiguration: (configKey: string) => Promise<void>;
};

export type PlainProps = {
    bulkDataEntryConfigurations: Array<DataStoreConfiguration>;
    onSelectConfiguration: (configKey: string) => Promise<void>;
};
