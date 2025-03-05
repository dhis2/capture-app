// @flow
import { featureAvailable, FEATURES } from 'capture-core-utils/featuresSupport';
import { RulesEngine, environmentTypes } from '@dhis2/rules-engine-javascript';
import { RuleEngine } from './RuleEngine/RuleEngine';
import {
    inputConverter,
    outputConverter,
    dateUtils,
} from './converters';

const captureRuleEngine = () => new RulesEngine(
    inputConverter,
    outputConverter,
    dateUtils,
    environmentTypes.WebClient,
);

const kotlinRuleEngine = () => new RuleEngine(
    inputConverter,
    outputConverter,
);

let rulesEngine = kotlinRuleEngine();

const versions = {
    DEFAULT: 'default',
    NEW: 'new',
    OLD: 'old',
};

export const initRulesEngine = (version: string, userRoles: Array<{ id: string }>) => {
    if (version === versions.NEW) {
        rulesEngine = kotlinRuleEngine();
    } else if (version === versions.OLD) {
        rulesEngine = captureRuleEngine();
    } else {
        rulesEngine = featureAvailable(FEATURES.kotlinRuleEngine) ? kotlinRuleEngine() : captureRuleEngine();
    }
    rulesEngine.setSelectedUserRoles(userRoles.map(({ id }) => id));
};

export const ruleEngine = () => rulesEngine;
