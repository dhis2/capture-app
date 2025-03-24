import { useLayoutEffect } from 'react';
import { useLocationQuery } from '../utils/routing';
import { ruleEngine } from './rulesEngine';

export const useRuleEngineFlags = (): void => {
    // This hook is used to set the verbose flag on the rules engine
    // based on the verbose query param in the URL

    const { verbose } = useLocationQuery();

    const updateFlags = (flags: Record<string, unknown>): void => {
        const rulesEngine = ruleEngine();
        rulesEngine.setFlags({ ...rulesEngine.getFlags(), ...flags });
    };

    useLayoutEffect(() => {
        if (verbose === 'true') {
            updateFlags({ verbose: true });
        } else {
            updateFlags({ verbose: false });
        }
    }, [verbose]);
};
