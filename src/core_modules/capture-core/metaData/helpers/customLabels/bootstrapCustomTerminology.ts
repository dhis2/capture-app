import i18n from '@dhis2/d2-i18n';
import { applyCustomTerminology } from './applyCustomTerminology';
import { resolveTerminologyContext } from './resolveTerminologyContext';

type ReduxStore = { getState: () => unknown };

let bootstrapped = false;

export const bootstrapCustomTerminology = (store: ReduxStore) => {
    if (bootstrapped) return;
    bootstrapped = true;

    const originalT = i18n.t.bind(i18n);
    i18n.t = (key: string, options?: any) => {
        const translated = originalT(key, options);
        return applyCustomTerminology(translated, resolveTerminologyContext(store));
    };
};
