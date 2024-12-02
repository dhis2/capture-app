// @flow
import { RuleEngine } from './RuleEngine/RuleEngine';
import {
    inputConverter,
    outputConverter,
} from './converters';

export const rulesEngine = new RuleEngine(
    inputConverter,
    outputConverter,
);
