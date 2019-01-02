// @flow
import i18n from '@dhis2/d2-i18n';
import { RulesEngine } from 'capture-core-utils/RulesEngine';
import inputValueConverter from './converters/inputValueConverter';
import outputRulesEffectsValueConverter from './converters/rulesEffectsValueConverter';
import momentConverter from './converters/momentConverter';
import getRulesActionsForEventInner from './rulesEngineActionsCreatorForEvent';
import getRulesActionsForTEIInner from './rulesEngineActionsCreatorForTEI';

const rulesEngine =
    new RulesEngine(inputValueConverter, momentConverter, i18n.t, outputRulesEffectsValueConverter);

export function getRulesActionsForEvent(...args) {
    return getRulesActionsForEventInner(rulesEngine, ...args);
}

export function getRulesActionsForTEI(...args) {
    return getRulesActionsForTEIInner(rulesEngine, ...args);
}
