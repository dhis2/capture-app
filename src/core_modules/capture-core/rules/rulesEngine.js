// @flow
import { RulesEngine } from 'capture-core-utils/rulesEngine/RulesEngine';
import {
    inputConverter,
    outputConverter,
    dateUtils,
} from './converters';

export const rulesEngine = new RulesEngine(inputConverter, outputConverter, dateUtils);
