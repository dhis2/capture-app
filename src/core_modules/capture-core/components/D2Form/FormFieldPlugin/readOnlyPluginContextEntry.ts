import type { PluginContextEntry } from './FormFieldPlugin.types';

export const readOnlyPluginContextEntry = <TValue>(value: TValue): PluginContextEntry<TValue> => ({
    value,
    readOnly: true,
    setDataEntryFieldValue: () => undefined,
});
