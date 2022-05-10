// @flow
import { RulesEngine, environmentTypes } from 'capture-core-utils/rulesEngine';
import {
    inputConverter,
    outputConverter,
    dateUtils,
} from './converters';

export const rulesEngine = new RulesEngine(inputConverter, outputConverter, dateUtils, environmentTypes.WebClient);
