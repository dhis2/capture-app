import log from 'loglevel';
import type { PluginContextEntry } from './FormFieldPlugin.types';

export const readOnlyPluginContextEntry = <TValue>(key: string, value: TValue): PluginContextEntry<TValue> => ({
    value,
    setDataEntryFieldValue: () => {
        log.error(`setContextFieldValue: ${key} is read-only in this form`);
    },
});
