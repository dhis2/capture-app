// @flow
import { RulesEngine, environmentTypes } from 'rules-engine';
import {
    inputConverter,
    outputConverter,
    dateUtils,
} from './converters';

export const rulesEngine = new RulesEngine(inputConverter, outputConverter, dateUtils, environmentTypes.WebClient);
