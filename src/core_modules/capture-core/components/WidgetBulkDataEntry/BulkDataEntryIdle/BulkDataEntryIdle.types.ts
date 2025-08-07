import type { DataStoreConfiguration } from '../../common/bulkDataEntry';

export type Props = {
    bulkDataEntryConfigurations?: Array<DataStoreConfiguration>;
    onSelectConfiguration: (configKey: string) => Promise<void>;
};

type CssClasses = {
    classes: Record<string, string>;
};

export type PlainProps = {
    bulkDataEntryConfigurations: Array<DataStoreConfiguration>;
    onSelectConfiguration: (configKey: string) => Promise<void>;
} & CssClasses;
