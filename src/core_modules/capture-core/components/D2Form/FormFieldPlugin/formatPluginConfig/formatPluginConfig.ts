import { PluginConfigConvertFns } from './formatPluginConfig.const';
import type { FormattedPluginFormFieldMetadata } from '../FormFieldPlugin.types';
import type { DataElement } from '../../../../metaData';

type CustomAttributes = { [key: string]: any };

const keysToOmit = ['id', 'dataElement', 'section', 'optionGroups', 'onValidate'];

export const formatPluginConfig = (
    dataElement: DataElement,
    attributes?: CustomAttributes,
): FormattedPluginFormFieldMetadata => {
    const removeUnderscoreFromObjectAttributes = obj => Object.entries(obj)
        .reduce((acc, [key, value]) => {
            const modifiedKey = key.replace(/^_/, '');

            if (keysToOmit.includes(modifiedKey)) {
                return acc;
            }

            if (PluginConfigConvertFns[modifiedKey]) {
                const transformed = PluginConfigConvertFns[modifiedKey](value, attributes);
                if (transformed) {
                    acc[transformed.key] = transformed.value;
                }
                return acc;
            }

            // Recursively process nested objects and arrays
            if (value !== null) {
                if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        acc[modifiedKey] = value.map(removeUnderscoreFromObjectAttributes)
                            .filter(Boolean);
                    } else {
                        acc[modifiedKey] = removeUnderscoreFromObjectAttributes(value);
                    }
                } else {
                    acc[modifiedKey] = value;
                }
            }

            return acc;
        }, {});

    return removeUnderscoreFromObjectAttributes(dataElement) as FormattedPluginFormFieldMetadata;
};
