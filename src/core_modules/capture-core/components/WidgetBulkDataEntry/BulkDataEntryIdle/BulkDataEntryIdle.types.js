// @flow
import type { DataStoreConfiguration } from '../WidgetBulkDataEntry.types';

export type Props = {
    programId: string,
    onSelectConfiguration: (configKey: string) => Promise<void>,
};

export type PlainProps = {
    bulkDataEntryConfigurations: Array<DataStoreConfiguration>,
    onSelectConfiguration: (configKey: string) => Promise<void>,
    ...CssClasses,
};
