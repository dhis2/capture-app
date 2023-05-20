// @flow
import { PluginConfigConvertFns } from './formatPluginConfig.const';
import type { PluginFormFieldMetadata } from '../FormFieldPlugin.types';
import { DataElement } from '../../../../metaData';

type FormattedAttributes = {| [key: string]: any |};

type FormatOptions = {|
    keysToOmit?: Array<string>,
    attributes?: FormattedAttributes,
|}

export const formatPluginConfig = <TConfigReturn = PluginFormFieldMetadata>(
    dataElement: DataElement | PluginFormFieldMetadata,
    {
        attributes,
        keysToOmit = ['dataElement', 'optionGroups'],
    }: FormatOptions = {},
): TConfigReturn => {
    const removeUnderscoreFromObjectAttributes = (obj) => {
        const newObj = {};

        for (const [key, value] of Object.entries(obj)) {
            const modifiedKey = key.replace(/^_/, '');

            // Skip any keys that should be omitted
            if (keysToOmit.includes(modifiedKey)) {
                continue;
            }

            // If we encounter a key that has a conversion function, apply it
            if (PluginConfigConvertFns[modifiedKey]) {
                const transformed = PluginConfigConvertFns[modifiedKey](value, attributes);
                if (transformed) {
                    newObj[transformed.key] = transformed.value;
                }
                continue;
            }

            // Recursively process nested objects and arrays
            if (value && typeof value === 'object') {
                if (Array.isArray(value)) {
                    newObj[modifiedKey] = value.map(removeUnderscoreFromObjectAttributes).filter(Boolean);
                } else {
                    newObj[modifiedKey] = removeUnderscoreFromObjectAttributes(value);
                }
            } else {
                newObj[modifiedKey] = value;
            }
        }

        return newObj;
    };

    // $FlowFixMe
    return removeUnderscoreFromObjectAttributes(dataElement);
};
