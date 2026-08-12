import i18n from '@dhis2/d2-i18n';
import {
    applyCustomTerminology,
    hasCustomTerminologyTokens,
    INTERPOLATION_OPEN,
    INTERPOLATION_CLOSE,
} from './applyCustomTerminology';
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

    // Register terminology replacement as an i18next postProcessor plugin so it
    // uses the framework's documented extension point rather than overwriting t.
    i18n.use({
        type: 'postProcessor' as const,
        name: 'customTerminology',
        process(value: string): string {
            if (!hasCustomTerminologyTokens(value)) return value;
            return applyCustomTerminology(value, resolveTerminologyContext(store));
        },
    });
    // Enable the plugin globally — i18next reads this from options at call time.
    (i18n.options as any).postProcess = 'customTerminology';

    // Thin intercept solely to bracket interpolated values with sentinel markers
    // before i18next performs interpolation. This prevents terminology replacement
    // from rewriting server-supplied names (e.g. a stage called "Birth event").
    // No equivalent pre-interpolation hook exists in the i18next plugin API.
    const originalT = i18n.t.bind(i18n);
    i18n.t = (key: string, options?: any) => originalT(key, wrapInterpolationValues(options));
};
