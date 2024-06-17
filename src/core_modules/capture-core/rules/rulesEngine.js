// @flow
// import { RulesEngine, environmentTypes } from '@dhis2/rules-engine-javascript';
import { RuleEngine } from './RuleEngine/RuleEngine';
import {
    inputConverter,
    outputConverter,
    // dateUtils,
} from './converters';

// export const rulesEngine = new RulesEngine(
//     inputConverter,
//     outputConverter,
//     dateUtils,
//     environmentTypes.WebClient,
// );

export const rulesEngine = new RuleEngine(
    inputConverter,
    outputConverter,
);
