import i18n from '@dhis2/d2-i18n';
import { applyCustomTerminology, INTERPOLATION_OPEN, INTERPOLATION_CLOSE } from './applyCustomTerminology';
import { resolveTerminologyContext } from './resolveTerminologyContext';

type ReduxStore = { getState: () => unknown };

const I18N_CONTROL_KEYS = new Set([
    'context',
    'count',
    'defaultValue',
    'fallbackLng',
    'interpolation',
    'joinArrays',
    'keySeparator',
    'lng',
    'lngs',
    'ns',
    'nsSeparator',
    'postProcess',
    'replace',
    'returnDetails',
    'returnObjects',
    'skipInterpolation',
]);

const wrapInterpolationValues = (options?: Record<string, unknown>): Record<string, unknown> | undefined => {
    if (!options || typeof options !== 'object') return options;
    const wrapped: Record<string, unknown> = {};
    for (const key of Object.keys(options)) {
        const value = options[key];
        wrapped[key] = typeof value === 'string' && !I18N_CONTROL_KEYS.has(key)
            ? `${INTERPOLATION_OPEN}${value}${INTERPOLATION_CLOSE}`
            : value;
    }
    return wrapped;
};

let bootstrapped = false;

export const bootstrapCustomTerminology = (store: ReduxStore) => {
    if (bootstrapped) return;
    bootstrapped = true;

    const originalT = i18n.t.bind(i18n);
    i18n.t = (key: string, options?: any) => {
        const translated = originalT(key, wrapInterpolationValues(options));
        return applyCustomTerminology(translated, resolveTerminologyContext(store));
    };
};
