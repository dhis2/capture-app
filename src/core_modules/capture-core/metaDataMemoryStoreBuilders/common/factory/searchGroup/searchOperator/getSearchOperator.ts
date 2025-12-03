import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { CachedTrackedEntityAttribute } from '../../../../../storageControllers';
import {
    DEFAULT_IS_UNIQUE_SEARCH_OPERATOR,
    DEFAULT_HAS_OPTION_SET_SEARCH_OPERATOR,
    DEFAULT_FALLBACK_SEARCH_OPERATOR,
    type SearchOperator,
} from './searchOperator.const';
import { forcedSearchOperators } from './forcedSearchOperators';
import { defaultSearchOperators } from './defaultSearchOperators';

const getFallbackSearchOperator = (metadata: CachedTrackedEntityAttribute): SearchOperator => {
    const { valueType, blockedSearchOperators } = metadata;
    const defaultSearchOperatorList = defaultSearchOperators[valueType];

    if (!defaultSearchOperatorList) {
        log.error(errorCreator('missing default search operator for the valueType')({ valueType }));
        return DEFAULT_FALLBACK_SEARCH_OPERATOR;
    }

    if (!blockedSearchOperators || blockedSearchOperators.length === 0) {
        return defaultSearchOperatorList[0];
    }

    const fallbackSearchOperator = defaultSearchOperatorList.find(
        searchOperator => !blockedSearchOperators.includes(searchOperator),
    );

    if (!fallbackSearchOperator) {
        log.error(
            errorCreator('all default search operators are blocked for the valueType')({
                defaultSearchOperatorList,
                valueType,
            }),
        );
        return DEFAULT_FALLBACK_SEARCH_OPERATOR;
    }

    return fallbackSearchOperator;
};

export const getSearchOperator = (metadata: CachedTrackedEntityAttribute): SearchOperator => {
    if (metadata.unique) {
        return DEFAULT_IS_UNIQUE_SEARCH_OPERATOR;
    }
    if (metadata.optionSet) {
        return DEFAULT_HAS_OPTION_SET_SEARCH_OPERATOR;
    }

    const forcedOperator = forcedSearchOperators[metadata.valueType];
    if (forcedOperator) {
        return forcedOperator;
    }

    if (metadata.preferredSearchOperator) {
        return metadata.preferredSearchOperator as SearchOperator;
    }

    return getFallbackSearchOperator(metadata);
};
