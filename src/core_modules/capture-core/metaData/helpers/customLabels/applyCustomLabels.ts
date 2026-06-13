import type { LabelKey } from './labels.const';

type LabelTarget = { setCustomLabel: (key: LabelKey, value?: string | null) => void };

/**
 * Copies the configured custom labels from a cached metadata object onto the
 * in-memory metadata instance, using the key → cached-field mapping. Only
 * present values are stored (setCustomLabel ignores empty values).
 */
export const applyCustomLabels = (
    target: LabelTarget,
    cached: { [key: string]: any },
    fieldMap: { [key in LabelKey]?: string },
) => {
    Object.entries(fieldMap).forEach(([key, fieldName]) => {
        if (fieldName) {
            target.setCustomLabel(key as LabelKey, cached[fieldName]);
        }
    });
};
