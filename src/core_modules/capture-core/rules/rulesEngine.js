// @flow
import { RulesEngine } from 'capture-core-utils/rulesEngine/RulesEngine';
import {
    inputConverter,
    outputConverter,
    momentConverter,
} from './converters';

export const rulesEngine = new RulesEngine(inputConverter, outputConverter, momentConverter);
