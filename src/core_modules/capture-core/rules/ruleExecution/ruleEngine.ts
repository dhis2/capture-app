import { featureAvailable, FEATURES } from 'capture-core-utils/featuresSupport';
import { RulesEngine, environmentTypes } from '@dhis2/rules-engine-javascript';
import { RuleEngine } from '../RuleEngine/RuleEngine';
import {
    inputConverter,
    outputConverter,
    dateUtils,
} from '../converters';

let selectedRuleEngine;

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

const switchToCapture = () => {
    console.log('Using capture rule engine');
    selectedRuleEngine = captureRuleEngine();
};

const switchToKotlin = () => {
    console.log('Using kotlin rule engine');
    selectedRuleEngine = kotlinRuleEngine();
};

const versions = {
    NEW: 'new',
    OLD: 'old',
};

export const initRuleEngine = (version: string, userRoles: Array<{ id: string }>) => {
    if (version === versions.NEW) {
        switchToKotlin();
    } else if (version === versions.OLD) {
        switchToCapture();
    } else {
        featureAvailable(FEATURES.kotlinRuleEngine) ? switchToKotlin() : switchToCapture();
    }
    selectedRuleEngine.setSelectedUserRoles(userRoles.map(({ id }) => id));
};

export const ruleEngine = () => selectedRuleEngine || kotlinRuleEngine();
