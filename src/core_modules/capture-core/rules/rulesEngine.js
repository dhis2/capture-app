// @flow
import log from 'loglevel';
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

const switchToCapture = () => {
    log.info('Using capture rule engine');
    rulesEngine = captureRuleEngine();
};

const switchToKotlin = () => {
    log.info('Using kotlin rule engine');
    rulesEngine = kotlinRuleEngine();
};

const versions = {
    NEW: 'new',
    OLD: 'old',
};

export const initRulesEngine = (version: string, userRoles: Array<{ id: string }>) => {
    if (version === versions.NEW) {
        switchToKotlin();
    } else if (version === versions.OLD) {
        switchToCapture();
    } else {
        featureAvailable(FEATURES.kotlinRuleEngine) ? switchToKotlin() : switchToCapture();
    }
    rulesEngine.setSelectedUserRoles(userRoles.map(({ id }) => id));
};

export const ruleEngine = () => rulesEngine;
