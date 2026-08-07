import i18n from '@dhis2/d2-i18n';
import { applyCustomTerminology } from './applyCustomTerminology';
import { resolveTerminologyContext } from './resolveTerminologyContext';

type StoreLike = { getState: () => unknown };

let bootstrapped = false;

/**
 * Wraps i18n.t so every call passes its result through applyCustomTerminology,
 * substituting DHIS2 terms with the current program's custom labels. Program /
 * stage / tracked entity type ids are resolved per call via
 * resolveTerminologyContext (URL first, then Redux domain state).
 *
 * Callers can opt out per call with i18n.t(key, { postProcess: false }) — for
 * strings that mention DHIS2 terms in the everyday sense.
 *
 * Call once at app bootstrap.
 */
export const bootstrapCustomTerminology = (store: StoreLike) => {
    if (bootstrapped) return;
    bootstrapped = true;

    const originalT = i18n.t.bind(i18n);
    i18n.t = (key: string, options?: any) => {
        const translated = originalT(key, options);
        if (options?.postProcess === false) return translated;
        return applyCustomTerminology(translated, resolveTerminologyContext(store));
    };
};
