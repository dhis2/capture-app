// @flow
import { RulesEngine, environmentTypes } from '@dhis2/rules-engine-javascript';
import {
    inputConverter,
    outputConverter,
    dateUtils,
} from './converters';

export const rulesEngine = new RulesEngine(
    inputConverter,
    outputConverter,
    dateUtils,
    environmentTypes.WebClient,
);
